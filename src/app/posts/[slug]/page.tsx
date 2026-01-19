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
import { getBlogPostBySlug, getBlogPosts } from "@/actions/blog"
import { generateDescription, generateArticleMetadata } from "@/lib/utils"

// Enable ISR with 10-minute revalidation
export const revalidate = 600

// 静的パスの生成（Notion記事のみ）
export async function generateStaticParams() {
  const posts = await getBlogPosts()

  return posts
    .filter(post => !post.isExternal)  // Notion記事のみ
    .map((post) => ({
      slug: post.href.replace('/posts/', ''),
    }))
}

// 新規記事もオンデマンド生成
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: '記事が見つかりません',
      description: '指定された記事が見つかりませんでした。',
    }
  }

  return generateArticleMetadata({
    title: post.title,
    description: generateDescription(post.content),
    slug,
    publishedTime: post.createdTime,
    modifiedTime: post.lastEditedTime,
    tags: post.tags,
  })
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
