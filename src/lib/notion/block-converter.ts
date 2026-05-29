import { escapeHtmlAttribute, escapeHtmlContent } from "../html-escape";
import { getAllBlocks } from "./block-fetcher";
import { getCalloutStyle, renderBookmarkCard } from "./html-renderers";
import { wrapListItems } from "./list-wrapper";

type RichTextItem = {
  type: string;
  href?: string | null;
  plain_text?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
};

function getPlainText(richText: Array<{ plain_text?: string }> = []): string {
  return richText.map((text) => text.plain_text || '').join('');
}

function renderRichTextItem(item: RichTextItem): string {
  let html = escapeHtmlContent(item.plain_text || '');
  const annotations = item.annotations;

  if (annotations?.code) html = `<code>${html}</code>`;
  if (annotations?.bold) html = `<strong>${html}</strong>`;
  if (annotations?.italic) html = `<em>${html}</em>`;
  if (annotations?.strikethrough) html = `<s>${html}</s>`;
  if (annotations?.underline) html = `<u>${html}</u>`;

  if (item.type === 'text' && item.href) {
    return `<a href="${escapeHtmlAttribute(item.href)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
  }

  return html;
}

function renderRichText(richText: RichTextItem[] = []): string {
  return richText.map(renderRichTextItem).join('');
}

/**
 * ブロックとその子ブロックを再帰的にHTMLに変換
 *
 * @param block Notion のブロックオブジェクト
 * @param getHeadingId 見出し用の一意な ID を採番するための関数
 * @param depth 現在のネストの深さ。再帰呼び出し時に増加させており、将来の拡張（例：インデントや最大ネスト深度の制御）のために保持されていますが、現時点では描画処理には使用されません。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertBlockToHtml(block: any, getHeadingId: () => number, depth: number = 0): Promise<string> {
  // ネストされた子ブロックを取得
  let childrenHtml = '';
  if (block.has_children) {
    const childBlocks = await getAllBlocks(block.id);
    const childHtmlParts: string[] = [];
    for (const childBlock of childBlocks) {
      const html = await convertBlockToHtml(childBlock, getHeadingId, depth + 1);
      childHtmlParts.push(html);
    }
    // 子ブロックのリストアイテムをラップ
    childrenHtml = wrapListItems(childHtmlParts);
  }

  switch (block.type) {
    case 'paragraph': {
      const richText = block.paragraph?.rich_text || [];
      if (richText.length === 0) return childrenHtml || '';
      // 各要素を HTML に変換して結合
      const htmlParts = await Promise.all(richText.map(async (item: RichTextItem) => {
        // mention → ブックマークカード
        if (item.type === 'mention' && item.href) {
          return await renderBookmarkCard(item.href);
        }

        return renderRichTextItem(item);
      }));

      // text のみの場合は <p> タグで囲む、mention（ブックマーク）が含まれる場合はそのまま結合
      const hasMention = richText.some((item: { type: string }) => item.type === 'mention');
      if (hasMention) {
        return htmlParts.join('') + childrenHtml;
      }
      return `<p>${htmlParts.join('')}</p>${childrenHtml}`;
    }
    case 'heading_1': {
      const richText = block.heading_1?.rich_text || [];
      const id = `heading-${getHeadingId()}`;
      return `<h1 id="${id}">${renderRichText(richText)}</h1>${childrenHtml}`;
    }
    case 'heading_2': {
      const richText = block.heading_2?.rich_text || [];
      const id = `heading-${getHeadingId()}`;
      return `<h2 id="${id}">${renderRichText(richText)}</h2>${childrenHtml}`;
    }
    case 'heading_3': {
      const richText = block.heading_3?.rich_text || [];
      const id = `heading-${getHeadingId()}`;
      return `<h3 id="${id}">${renderRichText(richText)}</h3>${childrenHtml}`;
    }
    case 'bulleted_list_item': {
      const richText = block.bulleted_list_item?.rich_text || [];
      // 子要素がある場合はネストしたリストを含める
      return `<li data-list-type="bulleted">${renderRichText(richText)}${childrenHtml}</li>`;
    }
    case 'numbered_list_item': {
      const richText = block.numbered_list_item?.rich_text || [];
      // 子要素がある場合はネストしたリストを含める
      return `<li data-list-type="numbered">${renderRichText(richText)}${childrenHtml}</li>`;
    }
    case 'code': {
      const text = getPlainText(block.code?.rich_text);
      const language = block.code?.language || 'plain text';
      const escapedText = escapeHtmlContent(text);
      const escapedLanguage = escapeHtmlAttribute(language);
      return `<pre data-language="${escapedLanguage}"><code>${escapedText}</code></pre>`;
    }
    case 'quote': {
      const richText = block.quote?.rich_text || [];
      return `<blockquote>${renderRichText(richText)}${childrenHtml}</blockquote>`;
    }
    case 'bookmark': {
      const url = block.bookmark?.url || '';
      return renderBookmarkCard(url);
    }
    case 'image': {
      const imageData = block.image;
      let imageUrl = '';

      if (imageData?.type === 'external') {
        imageUrl = imageData.external?.url || '';
      } else if (imageData?.type === 'file') {
        imageUrl = imageData.file?.url || '';
      }

      const caption = imageData?.caption?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const altText = caption || 'Image';

      if (!imageUrl) {
        return '';
      }

      // エスケープしてインジェクション対策
      const escapedUrl = escapeHtmlAttribute(imageUrl);
      const escapedAlt = escapeHtmlAttribute(altText);
      const escapedCaption = escapeHtmlContent(caption);

      return `<figure class="my-4"><img src="${escapedUrl}" alt="${escapedAlt}" class="w-full rounded-lg" />${caption ? `<figcaption class="text-sm text-muted-foreground mt-2 text-center">${escapedCaption}</figcaption>` : ''}</figure>`;
    }
    case 'callout': {
      const calloutData = block.callout;
      const richText = calloutData?.rich_text || [];
      const color = calloutData?.color || 'default';
      const icon = calloutData?.icon;

      // アイコンの処理
      let iconHtml = '';
      if (icon?.type === 'emoji') {
        iconHtml = `<span class="notion-callout-icon">${icon.emoji}</span>`;
      } else if (icon?.type === 'external') {
        const iconUrl = escapeHtmlAttribute(icon.external?.url || '');
        iconHtml = `<img src="${iconUrl}" alt="" class="notion-callout-icon-img" />`;
      } else if (icon?.type === 'file') {
        const iconUrl = escapeHtmlAttribute(icon.file?.url || '');
        iconHtml = `<img src="${iconUrl}" alt="" class="notion-callout-icon-img" />`;
      }

      const style = getCalloutStyle(color);
      const styleAttr = style ? ` style="${style}"` : '';

      return `<div class="notion-callout bg-gradient-to-br from-white-500/50 to-white-500/10 shadow-sm"${styleAttr}>${iconHtml}<span class="notion-callout-text">${renderRichText(richText)}</span></div>${childrenHtml}`;
    }
    case 'table': {
      // テーブルの子ブロック（table_row）を取得して行を構築
      const tableData = block.table;
      const hasColumnHeader = tableData?.has_column_header || false;
      const hasRowHeader = tableData?.has_row_header || false;
      const childBlocks = block.has_children ? await getAllBlocks(block.id) : [];

      let rowsHtml = '';
      childBlocks.forEach((childBlock: { type: string; table_row?: { cells?: RichTextItem[][] } }, rowIndex: number) => {
        if (childBlock.type === 'table_row') {
          const cells = childBlock.table_row?.cells || [];
          const isHeaderRow = hasColumnHeader && rowIndex === 0;

          const cellsHtml = cells.map((cell: RichTextItem[], cellIndex: number) => {
            const cellHtml = renderRichText(cell);
            const isRowHeaderCell = hasRowHeader && cellIndex === 0;

            if (isHeaderRow || isRowHeaderCell) {
              return `<th class="border border-border px-3 py-2 text-left font-semibold bg-muted dark:text-foreground">${cellHtml}</th>`;
            }
            return `<td class="border border-border px-6 py-2">${cellHtml}</td>`;
          }).join('');

          rowsHtml += `<tr>${cellsHtml}</tr>`;
        }
      });

      return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-border"><tbody>${rowsHtml}</tbody></table></div>`;
    }
    case 'table_row': {
      // table_row は table 内で処理されるため、単独では空を返す
      return '';
    }
    default:
      return childrenHtml;
  }
}
