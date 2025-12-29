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

  // ソースに応じた背景色と文字色の設定
  const getCardStyles = () => {
    if (source === 'qiita') {
      return {
        cardClassName: "group relative shadow-sm hover:shadow-xl transition-shadow bg-[#55C500] border-[#55C500]",
        textClassName: "text-white",
        mutedTextClassName: "text-white/90",
      };
    }
    if (source === 'zenn') {
      return {
        cardClassName: "group relative shadow-sm hover:shadow-xl transition-shadow bg-[#3EA8FF] border-[#3EA8FF]",
        textClassName: "text-white",
        mutedTextClassName: "text-white/90",
      };
    }
    return {
      cardClassName: "group relative shadow-sm hover:shadow-lg transition-shadow",
      textClassName: "",
      mutedTextClassName: "",
    };
  };

  const styles = getCardStyles();

  return (
    <Card className={styles.cardClassName}>
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

      <CardHeader className="pb-3 sm:pb-4 pointer-events-none">
        <div className={`flex items-center gap-2 text-xs sm:text-sm mb-2 sm:mb-3 ${styles.mutedTextClassName || 'text-muted-foreground'}`}>
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <time dateTime={date}>{date}</time>
          {source && (
            <>
              <span className={styles.mutedTextClassName ? "text-white/70" : "text-muted-foreground/50"}>•</span>
              <div className="flex items-center gap-1.5">
                <SourceIcon source={source} size={14} className={styles.mutedTextClassName || "text-muted-foreground"} />
                <span className="capitalize">{source}</span>
              </div>
            </>
          )}
          {isExternal && (
            <ExternalLink className={`h-3 w-3 sm:h-4 sm:w-4 ${styles.mutedTextClassName ? "text-white/80" : "text-muted-foreground/70"}`} />
          )}
        </div>
        <h2 className={`text-xl sm:text-2xl font-bold transition-colors text-balance leading-snug break-words flex items-center gap-2 ${styles.textClassName ? `${styles.textClassName} group-hover:opacity-90` : 'group-hover:text-primary'}`}>
          {title}
        </h2>
      </CardHeader>
      <CardContent className="pointer-events-none">
        <p className={`text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-3 ${styles.mutedTextClassName || 'text-muted-foreground'}`}>{excerpt}</p>
      </CardContent>
      <CardContent className="pt-0">
        <div className="inline-flex flex-wrap gap-1.5 sm:gap-2 relative z-10 pointer-events-auto">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tags=${encodeURIComponent(tag)}`}
              className="relative z-10 pointer-events-auto"
            >
              <Badge
                variant="secondary"
                className={`text-xs sm:text-sm cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  styles.textClassName 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : ''
                }`}
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
