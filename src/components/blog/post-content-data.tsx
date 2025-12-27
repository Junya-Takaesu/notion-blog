import { BlogHeader } from "@/components/blog/blog-header"
import { BlogContent } from "@/components/blog/blog-content"
import { BlogNavigation } from "@/components/blog/blog-navigation"
import { BlogSidebarContent } from "@/components/blog/blog-sidebar-content"
import { getBlogPostBySlug, getBlogPosts } from "@/actions/notion-client"
import { extractHeadingsFromHtml } from "@/lib/extract-headings"
import { highlightCodeBlocks } from "@/lib/syntax-highlight"
import { notFound } from "next/navigation"

interface PostContentDataProps {
  slug: string
}

export async function PostContentData({ slug }: PostContentDataProps) {
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Apply syntax highlighting to code blocks
  const highlightedContent = await highlightCodeBlocks(post.content)

  // Fetch all posts from Notion
  const allPosts = await getBlogPosts()

  // Get recent posts (limit to 4 posts)
  const recentPosts = allPosts.slice(0, 4).map(post => ({
    title: post.title,
    date: post.date,
    href: post.href,
  }))

  // Find current post index and get previous/next posts
  const currentIndex = allPosts.findIndex(p => p.href === `/posts/${slug}`)
  const previousPost = currentIndex > 0 ? {
    title: allPosts[currentIndex - 1].title,
    href: allPosts[currentIndex - 1].href,
  } : undefined
  const nextPost = currentIndex < allPosts.length - 1 ? {
    title: allPosts[currentIndex + 1].title,
    href: allPosts[currentIndex + 1].href,
  } : undefined

  return (
    <>
      <BlogHeader
        title={post.title}
        date={post.createdTime}
        tags={post.tags}
      />
      <BlogContent>
        <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
      </BlogContent>
      <BlogNavigation
        previousPost={previousPost}
        nextPost={nextPost}
      />
      {/* Recent posts section for mobile - shown after navigation */}
      <div className="lg:hidden mt-8">
        <BlogSidebarContent recentPosts={recentPosts} />
      </div>
    </>
  )
}

export async function PostTocData({ slug }: PostContentDataProps) {
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return { tocItems: [] }
  }

  // Apply syntax highlighting to code blocks
  const highlightedContent = await highlightCodeBlocks(post.content)

  // Extract table of contents from HTML content dynamically
  const tocItems = extractHeadingsFromHtml(highlightedContent)

  return { tocItems }
}
