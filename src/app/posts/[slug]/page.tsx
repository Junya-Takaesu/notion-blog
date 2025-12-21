import { BlogHeader } from "@/components/blog/blog-header"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { BlogContent } from "@/components/blog/blog-content"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { BlogNavigation } from "@/components/blog/blog-navigation"
import { getBlogPostBySlug } from "@/actions/notion-client"
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
  // TODO: Extract table of contents from Notion content
  const tocItems = [
    { id: "section-1", title: "ひとよひとよに管理職(マネージャー)…", level: 2 },
    { id: "section-2", title: "ふたやく以上での立ち回り…!?", level: 2 },
    { id: "section-3", title: "みつめられてもなんにも出ないですよ…? (1on1の話題)", level: 2 },
    { id: "section-4", title: "ウェルカムトゥ影(ダーク)サイト", level: 2 },
    { id: "section-5", title: "超絶進化のマネージャー生活この手につかむ!", level: 2 },
    { id: "section-5-1", title: "1. チームのふりかえりで出た良し悪しを自身の良し悪しへ転換する", level: 3 },
    {
      id: "section-5-2",
      title: "2. 自身がしっくりくるエンジニアリングマネージャーの型にそっくりハマるよう動いてみる",
      level: 3,
    },
    { id: "section-6", title: "それ目指して歩き出してきたんです確か…", level: 2 },
  ]

  // TODO: Fetch tags with counts from Notion
  const tags = [
    { name: "テクノロジー", count: 333 },
    { name: "事例紹介", count: 69 },
    { name: "セキュリティ", count: 86 },
    { name: "アドベントカレンダー", count: 91 },
    { name: "クラウドコンピューティング", count: 65 },
    { name: "プログラミング", count: 63 },
  ]

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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BlogHeader
          title={post.title}
          date={post.createdTime}
          tags={post.tags}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <main>
            <TableOfContents items={tocItems} />

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

          <BlogSidebar tags={tags} recentPosts={recentPosts} />
        </div>
      </div>
    </div>
  )
}
