import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { getBlogPosts, getBlogTags } from "@/actions/notion-client"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function BlogListPage() {
  const blogPosts = await getBlogPosts()
  const tags = await getBlogTags()

  const recentPosts = [
    {
      title: "動かして理解する。AI駆動型マルウェアとは",
      date: "2025-12-18",
      href: "/",
    },
    {
      title: "Google Cloud資格全冠達成のリアル！",
      date: "2025-12-17",
      href: "/",
    },
    {
      title: "ハッカソンでIoT腹巻きを作ったら、競馬の冠レースを開催していた話",
      date: "2025-12-16",
      href: "/",
    },
    {
      title: "LLMに易しいOpenStack MCPサーバーの作り方",
      date: "2025-12-14",
      href: "/",
    },
  ]

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
    </div>
  )
}
