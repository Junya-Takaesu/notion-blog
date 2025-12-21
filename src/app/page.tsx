'use server'

import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"

export default async function BlogListPage() {
  const blogPosts = [
    {
      title: "じぶんが管理職になれるわけないじゃん、ムリムリ! (※ムリでもやるんだ!!)",
      excerpt:
        "社会人人生をずっと'エンジニア(プレイヤー)'としてだけバリューを出し続けてきた筆者が、管理職になって発生した苦悩やモヤモヤ、そしてそれを解決するためにとったアプローチについてまとめました。",
      date: "2025-12-15",
      tags: ["テクノロジー", "事例紹介", "セキュリティ", "アドベントカレンダー"],
      href: "/",
    },
    {
      title: "動かして理解する。AI駆動型マルウェアとは",
      excerpt:
        "AI技術を活用した新しいマルウェアの脅威について、実際に動作を確認しながら詳しく解説します。セキュリティ担当者必見の内容です。",
      date: "2025-12-18",
      tags: ["セキュリティ", "AI", "テクノロジー"],
      href: "/",
    },
    {
      title: "Google Cloud資格全冠達成のリアル！",
      excerpt: "Google Cloudの全ての認定資格を取得した経験から、効率的な学習方法と実務での活用法をお伝えします。",
      date: "2025-12-17",
      tags: ["クラウドコンピューティング", "事例紹介"],
      href: "/",
    },
    {
      title: "ハッカソンでIoT腹巻きを作ったら、競馬の冠レースを開催していた話",
      excerpt: "社内ハッカソンで作成したIoTデバイスが思わぬ方向に進化。ユニークな開発事例をご紹介します。",
      date: "2025-12-16",
      tags: ["テクノロジー", "事例紹介", "IoT"],
      href: "/",
    },
    {
      title: "LLMに易しいOpenStack MCPサーバーの作り方",
      excerpt: "大規模言語モデル(LLM)と統合しやすいOpenStack環境の構築方法について、実践的なアプローチを解説します。",
      date: "2025-12-14",
      tags: ["クラウドコンピューティング", "AI", "プログラミング"],
      href: "/",
    },
    {
      title: "マイクロサービスアーキテクチャ導入のベストプラクティス",
      excerpt:
        "大規模システムをマイクロサービスに移行する際のポイントと、実際に直面した課題とその解決方法をまとめました。",
      date: "2025-12-13",
      tags: ["テクノロジー", "プログラミング"],
      href: "/",
    },
  ]

  const tags = [
    { name: "テクノロジー", count: 333 },
    { name: "事例紹介", count: 69 },
    { name: "セキュリティ", count: 86 },
    { name: "アドベントカレンダー", count: 91 },
    { name: "クラウドコンピューティング", count: 65 },
    { name: "プログラミング", count: 63 },
  ]

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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">記事一覧</h1>
          <hr />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <main>
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <BlogPostCard key={index} {...post} />
              ))}
            </div>
          </main>

          <BlogSidebar tags={tags} recentPosts={recentPosts} />
        </div>
      </div>
    </div>
  )
}
