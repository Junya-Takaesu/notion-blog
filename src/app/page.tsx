import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { MobileMenu } from "@/components/blog/mobile-menu"
import { getBlogPosts, getBlogTags } from "@/actions/notion-client"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function BlogListPage() {
  const blogPosts = await getBlogPosts()
  const tags = await getBlogTags()

  // Fetch recent posts from Notion (limit to 4 posts)
  const recentPosts = blogPosts.slice(0, 4).map(post => ({
    title: post.title,
    date: post.date,
    href: post.href,
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">記事一覧</h1>
          <hr />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 min-w-0">
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <BlogPostCard key={index} {...post} />
              ))}
            </div>
          </main>

          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <BlogSidebar tags={tags} recentPosts={recentPosts} />
          </aside>
        </div>
      </div>
      {/* Mobile hamburger menu with TOC and tags */}
      <MobileMenu tocItems={[]} tags={tags} />
    </div>
  )
}
