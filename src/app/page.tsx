import { Suspense } from "react"
import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/utils"
import { BlogPostList } from "@/components/blog/blog-post-list"
import { SidebarData } from "@/components/blog/sidebar-data"
import { MobileMenuData } from "@/components/blog/mobile-menu-data"
import { BlogPostListSkeleton, BlogSidebarSkeleton } from "@/components/blog/skeletons"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import Link from "next/link"

// Enable ISR with 10-minute revalidation
export const revalidate = 600

export const metadata: Metadata = {
  title: "記事一覧",
  description: `${SITE_CONFIG.description}`,
}

interface BlogListPageProps {
  searchParams: Promise<{ tags?: string }>
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { tags: tagsParam } = await searchParams

  // Parse selected tags from comma-separated URL parameter
  const selectedTags = tagsParam
    ? tagsParam.split(',').map(t => decodeURIComponent(t)).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">記事一覧</h1>
          <hr />
        </div>

        {/* Selected tags indicator */}
        {selectedTags.length > 0 && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">絞り込み:</span>
            {selectedTags.map(tag => {
              // Create new URL without this tag
              const remainingTags = selectedTags.filter(t => t !== tag)
              const href = remainingTags.length > 0
                ? `/?tags=${remainingTags.map(t => encodeURIComponent(t)).join(',')}`
                : '/'
              return (
                <Link key={tag} href={href}>
                  <Badge className="bg-red-500 hover:bg-red-600 text-white cursor-pointer flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3" />
                  </Badge>
                </Link>
              )
            })}
            {selectedTags.length > 1 && (
              <Link href="/">
                <Badge variant="outline" className="cursor-pointer flex items-center gap-1 hover:bg-secondary">
                  すべてクリア
                  <X className="h-3 w-3" />
                </Badge>
              </Link>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 min-w-0">
            <Suspense fallback={<BlogPostListSkeleton count={3} />}>
              <BlogPostList selectedTags={selectedTags} />
            </Suspense>
          </main>

          <aside className="w-full lg:w-80 lg:flex-shrink-0 hidden lg:block">
            <Suspense fallback={<BlogSidebarSkeleton />}>
              <SidebarData selectedTags={selectedTags} />
            </Suspense>
          </aside>
        </div>
      </div>
      {/* Mobile hamburger menu with TOC and tags */}
      <Suspense fallback={null}>
        <MobileMenuData selectedTags={selectedTags} />
      </Suspense>
    </div>
  )
}
