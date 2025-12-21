import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface BlogHeaderProps {
  title: string
  date: string
  tags: string[]
  slug?: string
}

export function BlogHeader({ title, date, tags, slug }: BlogHeaderProps) {
  return (
    <header className="border-b border-border pb-6 mb-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="h-4 w-4" />
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
      <h1 className="text-4xl font-bold mb-4 text-balance">{title}</h1>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </header>
  )
}
