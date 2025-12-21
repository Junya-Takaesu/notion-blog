import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { List } from "lucide-react"

interface Tag {
  name: string
  count: number
}

interface TocItem {
  id: string
  title: string
  level: number
}

interface RecentPost {
  title: string
  date: string
  href: string
}

interface BlogSidebarContentProps {
  tocItems?: TocItem[]
  tags?: Tag[]
  recentPosts?: RecentPost[]
  onLinkClick?: () => void
}

export function BlogSidebarContent({
  tocItems = [],
  tags = [],
  recentPosts = [],
  onLinkClick
}: BlogSidebarContentProps) {
  return (
    <div className="space-y-6">
      {tocItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <List className="h-5 w-5" />
              <span>目次</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tocItems.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={onLinkClick}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">タグ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <a
                  key={index}
                  href="#"
                  onClick={onLinkClick}
                >
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                    {tag.name} {tag.count}
                  </Badge>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentPosts && recentPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">最新記事</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentPosts.map((post, index) => (
                <li key={index}>
                  <a href={post.href} className="block group" onClick={onLinkClick}>
                    <time className="text-xs text-muted-foreground block mb-1">{post.date}</time>
                    <p className="text-sm leading-snug group-hover:text-primary transition-colors">{post.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
