import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { MobileMenu } from "@/components/blog/mobile-menu"
import { getBlogPosts, getBlogTags } from "@/actions/notion-client"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

interface BlogListPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { tag: selectedTag } = await searchParams
  const allBlogPosts = await getBlogPosts()
  const tags = await getBlogTags()

  // Filter posts by tag if selectedTag is provided
  const blogPosts = selectedTag
    ? allBlogPosts.filter(post => post.tags.includes(selectedTag))
    : allBlogPosts

  // Fetch recent posts from Notion (limit to 4 posts)
  const recentPosts = allBlogPosts.slice(0, 4).map(post => ({
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

        {/* Selected tag indicator */}
        {selectedTag && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">絞り込み:</span>
            <Link href="/">
              <Badge className="bg-red-500 hover:bg-red-600 text-white cursor-pointer flex items-center gap-1">
                {selectedTag}
                <X className="h-3 w-3" />
              </Badge>
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 min-w-0">
            <div className="space-y-6">
              {blogPosts.length > 0 ? (
                blogPosts.map((post, index) => (
                  <BlogPostCard key={index} {...post} />
                ))
              ) : (
                <p className="text-muted-foreground">該当する記事がありません。</p>
              )}
            </div>
          </main>

          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <BlogSidebar tags={tags} recentPosts={recentPosts} selectedTag={selectedTag} />
          </aside>
        </div>
      </div>
      {/* Mobile hamburger menu with TOC and tags */}
      <MobileMenu tocItems={[]} tags={tags} selectedTag={selectedTag} />
    </div>
  )
}
