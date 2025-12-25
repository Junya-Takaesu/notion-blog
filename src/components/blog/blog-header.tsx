import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Link from "next/link"

interface BlogHeaderProps {
  title: string
  date: string
  tags: string[]
  slug?: string
}

export function BlogHeader({ title, date, tags, slug }: BlogHeaderProps) {
  return (
    <header className="border-b border-border pb-4 sm:pb-6 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-wrap">
        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
        <time dateTime={date}>{date}</time>
        {slug && (
          <>
            <span className="text-muted-foreground">•</span>
            <Badge variant="outline" className="font-mono text-xs">
              Slug: {slug}
            </Badge>
          </>
        )}
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-balance break-words">{title}</h1>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
            <Badge variant="secondary" className="text-xs sm:text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </header>
  )
}
