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
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            <time dateTime={date}>{date}</time>
          </div>
          <h2 className="text-2xl font-bold group-hover:text-primary transition-colors text-balance leading-snug">
            {title}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">{excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
