import { Suspense } from "react"
import type { Metadata } from "next"
import { PostContentData } from "@/components/blog/post-content-data"
import { PostSidebarData } from "@/components/blog/post-sidebar-data"
import { PostMobileMenuData } from "@/components/blog/post-mobile-menu-data"
import {
  BlogHeaderSkeleton,
  BlogContentSkeleton,
  BlogNavigationSkeleton,
  BlogSidebarSkeleton,
} from "@/components/blog/skeletons"
import { getBlogPostBySlug } from "@/actions/blog"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: '記事が見つかりません',
      description: '指定された記事が見つかりませんでした。',
    }
  }

  // 説明文を生成（HTMLタグを除去して最初の160文字）
  const plainText = post.content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const description = plainText.length > 160 
    ? plainText.substring(0, 157) + '...'
    : plainText || '技術ブログ記事'

  // サイトURLを環境変数から取得（本番環境では設定が必要）
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://your-domain.com'

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.createdTime,
      modifiedTime: post.lastEditedTime,
      tags: post.tags,
      url: `${siteUrl}/posts/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  }
}

function PostContentSkeleton() {
  return (
    <>
      <BlogHeaderSkeleton />
      <BlogContentSkeleton />
      <BlogNavigationSkeleton />
    </>
  )
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 min-w-0">
            <Suspense fallback={<PostContentSkeleton />}>
              <PostContentData slug={slug} />
            </Suspense>
          </main>

          <aside className="w-full lg:w-80 lg:flex-shrink-0 hidden lg:block">
            <Suspense fallback={<BlogSidebarSkeleton />}>
              <PostSidebarData slug={slug} />
            </Suspense>
          </aside>
        </div>

        {/* Mobile hamburger menu with TOC and tags */}
        <Suspense fallback={null}>
          <PostMobileMenuData slug={slug} />
        </Suspense>
      </div>
    </div>
  )
}
