import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogNavigationProps {
  previousPost?: {
    title: string
    href: string
  }
  nextPost?: {
    title: string
    href: string
  }
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  return (
    <nav className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
      {previousPost ? (
        <Button variant="ghost" asChild className="flex-1 justify-start h-auto py-4">
          <a href={previousPost.href} className="flex items-start gap-2">
            <ChevronLeft className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground mb-1">前の記事</div>
              <div className="text-sm font-medium">{previousPost.title}</div>
            </div>
          </a>
        </Button>
      ) : (
        <div className="flex-1" />
      )}

      {nextPost ? (
        <Button variant="ghost" asChild className="flex-1 justify-end h-auto py-4">
          <a href={nextPost.href} className="flex items-start gap-2">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">次の記事</div>
              <div className="text-sm font-medium">{nextPost.title}</div>
            </div>
            <ChevronRight className="h-5 w-5 mt-0.5 flex-shrink-0" />
          </a>
        </Button>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}
