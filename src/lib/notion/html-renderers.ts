import { getLinkPreview } from "link-preview-js";
import { escapeHtmlAttribute, escapeHtmlContent } from "../html-escape";

/**
 * Notion colorをインラインスタイルに変換
 */
export function getCalloutStyle(color: string): string {
  const parts = color.split('_');
  if (parts.length === 2 && parts[1] === 'background') {
    return `background-color: ${parts[0]}; color: white;`;
  }
  if (parts.length === 1 && parts[0] !== 'default') {
    return `color: ${parts[0]};`;
  }
  return '';
}

/**
 * ブックマークカードHTMLを生成（mentionタイプ用）
 */
export async function renderBookmarkCard(href: string): Promise<string> {
  try {
    const linkPreview = await getLinkPreview(href) as {
      url?: string;
      title?: string;
      description?: string;
      images?: string[];
      favicons?: string[];
    };

    const url = linkPreview.url || href;
    const title = linkPreview.title || '';
    const description = linkPreview.description || '';
    const faviconUrl = linkPreview.favicons?.[0] || '';
    const imageUrl = linkPreview.images?.[0] || '';

    const escapedUrl = escapeHtmlAttribute(url);
    const escapedTitle = title ? escapeHtmlAttribute(title) : '';
    const escapedDescription = description ? escapeHtmlContent(description) : '';
    const escapedFaviconUrl = faviconUrl ? escapeHtmlAttribute(faviconUrl) : '';
    const escapedImageUrl = imageUrl ? escapeHtmlAttribute(imageUrl) : '';

    return `
      <a
        href="${escapedUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="not-prose my-4 flex w-full overflow-hidden rounded-md border border-slate-200 bg-white no-underline transition hover:border-slate-300 hover:shadow-sm hover:no-underline"
      >
        <div class="flex min-w-0 flex-1 flex-col justify-center p-3">
          ${title ? `<div class="text-sm font-medium leading-snug text-slate-900">${escapedTitle}</div>` : ''}
          ${description ? `<div class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">${escapedDescription}</div>` : ''}
          <div class="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
            ${faviconUrl ? `<img src="${escapedFaviconUrl}" alt="" class="h-3.5 w-3.5 shrink-0" loading="lazy" />` : ''}
            <span class="truncate">${escapedUrl}</span>
          </div>
        </div>
        ${imageUrl ? `<div class="hidden h-24 w-40 shrink-0 sm:block"><img src="${escapedImageUrl}" alt="" class="h-full w-full object-cover" loading="lazy" /></div>` : ''}
      </a>
    `;
  } catch {
    // フォールバック: シンプルなリンク
    return `<a href="${escapeHtmlAttribute(href)}" target="_blank" rel="noopener noreferrer">${escapeHtmlContent(href)}</a>`;
  }
}

/**
 * リンクHTMLを生成（text + href用）
 */
export function renderLink(href: string, label: string): string {
  return `<a href="${escapeHtmlAttribute(href)}" target="_blank" rel="noopener noreferrer">${escapeHtmlContent(label)}</a>`;
}
