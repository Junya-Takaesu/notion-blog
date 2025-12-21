import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Tag {
  name: string
  count: number
}

interface RecentPost {
  title: string
  date: string
  href: string
}

interface BlogSidebarProps {
  tags?: Tag[]
  recentPosts?: RecentPost[]
}

export function BlogSidebar({ tags = [], recentPosts = [] }: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">タグ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tags.map((tag, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                  >
                    <span>{tag.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {tag.count}
                    </Badge>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {recentPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">最新記事</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentPosts.map((post, index) => (
                <li key={index}>
                  <a href={post.href} className="block group">
                    <time className="text-xs text-muted-foreground block mb-1">{post.date}</time>
                    <p className="text-sm leading-snug group-hover:text-primary transition-colors">{post.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </aside>
  )
}
