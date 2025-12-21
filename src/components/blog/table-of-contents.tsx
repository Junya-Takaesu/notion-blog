import { Card, CardContent } from "@/components/ui/card"
import { List } from "lucide-react"

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <List className="h-5 w-5" />
          <span>目次</span>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}>
              <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
