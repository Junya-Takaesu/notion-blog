import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { SourceIcon } from "./source-icon"

interface BlogPostCardProps {
  title: string
  excerpt: string
  date: string
  tags: string[]
  href: string
  source?: string
  isExternal?: boolean
}

export function BlogPostCard({ title, excerpt, date, tags, href, source, isExternal = false }: BlogPostCardProps) {
  const linkProps = isExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Card className="group relative hover:shadow-lg transition-shadow">
      {/* カード全体をクリック可能にするリンク */}
      {isExternal ? (
        <a
          href={href}
          className="absolute inset-0 z-0"
          aria-label={`${title}を読む（外部サイト）`}
          {...linkProps}
        />
      ) : (
        <Link href={href} className="absolute inset-0 z-0" aria-label={`${title}を読む`} />
      )}

      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <time dateTime={date}>{date}</time>
          {source && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1.5">
                <SourceIcon source={source} size={14} className="text-muted-foreground" />
                <span className="capitalize">{source}</span>
              </div>
            </>
          )}
          {isExternal && (
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/70" />
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors text-balance leading-snug break-words flex items-center gap-2">
          {title}
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 relative z-10">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tags=${encodeURIComponent(tag)}`}
              className="relative z-10"
            >
              <Badge
                variant="secondary"
                className="text-xs sm:text-sm cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
