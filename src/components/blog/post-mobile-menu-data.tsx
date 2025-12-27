import { MobileMenu } from "./mobile-menu"
import { getBlogPostBySlug, getBlogTags } from "@/actions/notion-client"
import { extractHeadingsFromHtml } from "@/lib/extract-headings"
import { highlightCodeBlocks } from "@/lib/syntax-highlight"

interface PostMobileMenuDataProps {
  slug: string
}

export async function PostMobileMenuData({ slug }: PostMobileMenuDataProps) {
  const [post, tags] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogTags(),
  ])

  // Extract TOC if post exists
  let tocItems: { id: string; title: string; level: number }[] = []
  if (post) {
    const highlightedContent = await highlightCodeBlocks(post.content)
    tocItems = extractHeadingsFromHtml(highlightedContent)
  }

  return (
    <MobileMenu
      tocItems={tocItems}
      tags={tags}
    />
  )
}
