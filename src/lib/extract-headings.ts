export interface TocItem {
  id: string
  title: string
  level: number
}

/**
 * Extract headings from HTML content to generate table of contents
 * Handles cases where no headings exist (returns empty array)
 */
export function extractHeadingsFromHtml(html: string): TocItem[] {
  const headings: TocItem[] = []

  // Match h1, h2, h3 tags with id attributes
  const headingRegex = /<h([1-3])\s+id="([^"]+)">([^<]+)<\/h\1>/gi
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const id = match[2].trim()
    const title = match[3].trim()

    if (title && id) {
      headings.push({
        id,
        title,
        level,
      })
    }
  }

  return headings
}
