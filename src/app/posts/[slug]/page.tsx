import { BlogHeader } from "@/components/blog/blog-header"
import { BlogContent } from "@/components/blog/blog-content"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { BlogNavigation } from "@/components/blog/blog-navigation"
import { MobileMenu } from "@/components/blog/mobile-menu"
import { BlogSidebarContent } from "@/components/blog/blog-sidebar-content"
import { getBlogPostBySlug, getBlogTags, getBlogPosts } from "@/actions/notion-client"
import { extractHeadingsFromHtml } from "@/lib/extract-headings"
import { highlightCodeBlocks } from "@/lib/syntax-highlight"
import { notFound } from "next/navigation"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  // Fetch blog post from Notion API
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Apply syntax highlighting to code blocks
  const highlightedContent = await highlightCodeBlocks(post.content)

  // Extract table of contents from HTML content dynamically
  const tocItems = extractHeadingsFromHtml(highlightedContent)

  // Fetch real tags with counts from Notion
  const tags = await getBlogTags()

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <BlogHeader
          title={post.title}
          date={post.createdTime}
          tags={post.tags}
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 min-w-0">
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
          </main>

          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <BlogSidebar tocItems={tocItems} tags={tags} recentPosts={recentPosts} />
          </aside>
        </div>

        {/* Mobile hamburger menu with TOC and tags */}
        <MobileMenu tocItems={tocItems} tags={tags} />
      </div>
    </div>
  )
}
