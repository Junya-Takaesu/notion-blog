import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BlogPostCardSkeleton() {
  return (
    <Card className="group">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded" />
          <Skeleton className="h-3 sm:h-4 w-24" />
        </div>
        <Skeleton className="h-7 sm:h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-3 sm:mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Skeleton className="h-5 sm:h-6 w-16 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-20 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function BlogPostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogPostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function BlogHeaderSkeleton() {
  return (
    <header className="border-b border-border pb-4 sm:pb-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded" />
        <Skeleton className="h-3 sm:h-4 w-24" />
      </div>
      <Skeleton className="h-8 sm:h-10 lg:h-12 w-3/4 mb-3 sm:mb-4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 sm:h-6 w-16 rounded-full" />
        <Skeleton className="h-5 sm:h-6 w-20 rounded-full" />
      </div>
    </header>
  )
}

export function BlogContentSkeleton() {
  return (
    <article className="space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-6 w-1/4 mt-6" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg mt-4" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  )
}

export function BlogSidebarSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function BlogNavigationSkeleton() {
  return (
    <nav className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-4 mt-12 pt-8 border-t border-border">
      <div className="flex-1 h-auto py-4 px-4 border rounded-md">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="flex-1 h-auto py-4 px-4 border rounded-md">
        <div className="flex items-center gap-3 sm:justify-end sm:flex-row-reverse">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 sm:text-right">
            <Skeleton className="h-3 w-16 mb-1 sm:ml-auto" />
            <Skeleton className="h-4 w-32 sm:ml-auto" />
          </div>
        </div>
      </div>
    </nav>
  )
}

export function TocSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[85, 72, 90, 78, 95].map((width, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${width}%`, marginLeft: `${(i % 3) * 12}px` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
