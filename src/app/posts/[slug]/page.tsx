import { Suspense } from "react"
import { PostContentData } from "@/components/blog/post-content-data"
import { PostSidebarData } from "@/components/blog/post-sidebar-data"
import { PostMobileMenuData } from "@/components/blog/post-mobile-menu-data"
import {
  BlogHeaderSkeleton,
  BlogContentSkeleton,
  BlogNavigationSkeleton,
  BlogSidebarSkeleton,
} from "@/components/blog/skeletons"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

function PostContentSkeleton() {
  return (
    <>
      <BlogHeaderSkeleton />
      <BlogContentSkeleton />
      <BlogNavigationSkeleton />
    </>
  )
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
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
