import type { ReactNode } from "react"

interface BlogContentProps {
  children: ReactNode
}

export function BlogContent({ children }: BlogContentProps) {
  return (
    <article className="prose prose-slate prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4 prose-p:leading-relaxed prose-p:text-foreground/90 prose-li:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-xs sm:prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-img:rounded-lg overflow-hidden">
      {children}
    </article>
  )
}
