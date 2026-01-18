/**
 * 連続するリストアイテムを<ul>/<ol>タグでラップする
 */
export function wrapListItems(htmlParts: string[]): string {
  const result: string[] = [];
  let currentListType: 'bulleted' | 'numbered' | null = null;
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length > 0 && currentListType) {
      const tag = currentListType === 'bulleted' ? 'ul' : 'ol';
      result.push(`<${tag}>${currentListItems.join('')}</${tag}>`);
      currentListItems = [];
      currentListType = null;
    }
  };

  for (const htmlPart of htmlParts) {
    // data-list-typeを持つ<li>タグを検出
    const bulletedMatch = htmlPart.match(/^<li data-list-type="bulleted">/);
    const numberedMatch = htmlPart.match(/^<li data-list-type="numbered">/);

    if (bulletedMatch) {
      if (currentListType !== 'bulleted') {
        flushList();
        currentListType = 'bulleted';
      }
      // data-list-type属性を削除
      currentListItems.push(htmlPart.replace(' data-list-type="bulleted"', ''));
    } else if (numberedMatch) {
      if (currentListType !== 'numbered') {
        flushList();
        currentListType = 'numbered';
      }
      // data-list-type属性を削除
      currentListItems.push(htmlPart.replace(' data-list-type="numbered"', ''));
    } else {
      flushList();
      if (htmlPart.trim()) {
        result.push(htmlPart);
      }
    }
  }

  // 最後のリストをフラッシュ
  flushList();

  return result.join('\n');
}
