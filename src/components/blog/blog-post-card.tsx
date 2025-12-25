import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Link from "next/link"

interface BlogPostCardProps {
  title: string
  excerpt: string
  date: string
  tags: string[]
  href: string
}

export function BlogPostCard({ title, excerpt, date, tags, href }: BlogPostCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <Link href={href}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <time dateTime={date}>{date}</time>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors text-balance leading-snug break-words">
            {title}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3">{excerpt}</p>
        </CardContent>
      </Link>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
            >
              <Badge variant="secondary" className="text-xs sm:text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
