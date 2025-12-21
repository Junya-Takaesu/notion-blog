import { BlogHeader } from "@/components/blog/blog-header"
import { BlogContent } from "@/components/blog/blog-content"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { BlogNavigation } from "@/components/blog/blog-navigation"
import { getBlogPostBySlug, getBlogTags } from "@/actions/notion-client"
import { extractHeadingsFromHtml } from "@/lib/extract-headings"
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

  // Extract table of contents from HTML content dynamically
  const tocItems = extractHeadingsFromHtml(post.content)

  // Fetch real tags with counts from Notion
  const tags = await getBlogTags()

  // TODO: Fetch recent posts from Notion
  const recentPosts = [
    {
      title: "動かして理解する。AI駆動型マルウェアとは",
      date: "2025-12-18",
      href: "#",
    },
    {
      title: "Google Cloud資格全冠達成のリアル！",
      date: "2025-12-17",
      href: "#",
    },
    {
      title: "ハッカソンでIoT腹巻きを作ったら、競馬の冠レースを開催していた話",
      date: "2025-12-16",
      href: "#",
    },
    {
      title: "LLMに易しいOpenStack MCPサーバーの作り方",
      date: "2025-12-14",
      href: "#",
    },
  ]



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
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </BlogContent>

            <BlogNavigation
              previousPost={{
                title: "ハッカソンでIoT腹巻きを作ったら、競馬の冠レースを開催していた話",
                href: "#",
              }}
              nextPost={{
                title: "LLMに易しいOpenStack MCPサーバーの作り方",
                href: "#",
              }}
            />
          </main>

          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <BlogSidebar tocItems={tocItems} tags={tags} recentPosts={recentPosts} />
          </aside>
        </div>
      </div>
    </div>
  )
}
