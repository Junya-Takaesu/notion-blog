import { escapeHtmlAttribute, escapeHtmlContent } from "../html-escape";
import { getAllBlocks } from "./block-fetcher";
import { getCalloutStyle, renderBookmarkCard, renderLink } from "./html-renderers";
import { wrapListItems } from "./list-wrapper";

/**
 * ブロックとその子ブロックを再帰的にHTMLに変換
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
      const htmlParts = await Promise.all(richText.map(async (item: { type: string; href?: string | null; plain_text?: string }) => {
        const { type, href, plain_text } = item;

        // mention → ブックマークカード
        if (type === 'mention' && href) {
          return await renderBookmarkCard(href);
        }

        // text + href あり → リンク
        if (type === 'text' && href) {
          return renderLink(href, plain_text || href);
        }

        // text + href なし → 通常テキスト
        return escapeHtmlContent(plain_text || '');
      }));

      // text のみの場合は <p> タグで囲む、mention（ブックマーク）が含まれる場合はそのまま結合
      const hasMention = richText.some((item: { type: string }) => item.type === 'mention');
      if (hasMention) {
        return htmlParts.join('') + childrenHtml;
      }
      return `<p>${htmlParts.join('')}</p>${childrenHtml}`;
    }
    case 'heading_1': {
      const text = block.heading_1?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const id = `heading-${getHeadingId()}`;
      return `<h1 id="${id}">${escapeHtmlContent(text)}</h1>${childrenHtml}`;
    }
    case 'heading_2': {
      const text = block.heading_2?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const id = `heading-${getHeadingId()}`;
      return `<h2 id="${id}">${escapeHtmlContent(text)}</h2>${childrenHtml}`;
    }
    case 'heading_3': {
      const text = block.heading_3?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const id = `heading-${getHeadingId()}`;
      return `<h3 id="${id}">${escapeHtmlContent(text)}</h3>${childrenHtml}`;
    }
    case 'bulleted_list_item': {
      const text = block.bulleted_list_item?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      // 子要素がある場合はネストしたリストを含める
      return `<li data-list-type="bulleted">${escapeHtmlContent(text)}${childrenHtml}</li>`;
    }
    case 'numbered_list_item': {
      const text = block.numbered_list_item?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      // 子要素がある場合はネストしたリストを含める
      return `<li data-list-type="numbered">${escapeHtmlContent(text)}${childrenHtml}</li>`;
    }
    case 'code': {
      const text = block.code?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const language = block.code?.language || 'plain text';
      const escapedText = escapeHtmlContent(text);
      const escapedLanguage = escapeHtmlAttribute(language);
      return `<pre data-language="${escapedLanguage}"><code>${escapedText}</code></pre>`;
    }
    case 'quote': {
      const text = block.quote?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      return `<blockquote>${escapeHtmlContent(text)}${childrenHtml}</blockquote>`;
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
      const text = calloutData?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
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
      const escapedText = escapeHtmlContent(text);

      return `<div class="notion-callout bg-gradient-to-br from-white-500/50 to-white-500/10 shadow-sm"${styleAttr}>${iconHtml}<span class="notion-callout-text">${escapedText}</span></div>${childrenHtml}`;
    }
    default:
      return childrenHtml;
  }
}
