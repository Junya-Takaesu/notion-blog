import { BlogSidebarContent } from "./blog-sidebar-content"
import { getBlogPostBySlug, getBlogPosts, getBlogTags } from "@/actions/notion-client"
import { extractHeadingsFromHtml } from "@/lib/extract-headings"
import { highlightCodeBlocks } from "@/lib/syntax-highlight"

interface PostSidebarDataProps {
  slug: string
}

export async function PostSidebarData({ slug }: PostSidebarDataProps) {
  const [post, tags, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogTags(),
    getBlogPosts(),
  ])

  // Extract TOC if post exists
  let tocItems: { id: string; title: string; level: number }[] = []
  if (post) {
    const highlightedContent = await highlightCodeBlocks(post.content)
    tocItems = extractHeadingsFromHtml(highlightedContent)
  }

  // Get recent posts (limit to 4 posts)
  const recentPosts = allPosts.slice(0, 4).map(post => ({
    title: post.title,
    date: post.date,
    href: post.href,
  }))

  return (
    <BlogSidebarContent
      tocItems={tocItems}
      tags={tags}
      recentPosts={recentPosts}
    />
  )
}
