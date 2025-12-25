import { BlogSidebarContent } from "./blog-sidebar-content"

interface Tag {
  name: string
  count: number
}

interface RecentPost {
  title: string
  date: string
  href: string
}

interface TocItem {
  id: string
  title: string
  level: number
}

interface BlogSidebarProps {
  tocItems?: TocItem[]
  tags?: Tag[]
  recentPosts?: RecentPost[]
  selectedTag?: string
}

export function BlogSidebar({ tocItems = [], tags = [], recentPosts = [], selectedTag }: BlogSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <BlogSidebarContent tocItems={tocItems} tags={tags} recentPosts={recentPosts} selectedTag={selectedTag} />
    </aside>
  )
}
