import { BlogSidebarContent } from "./blog-sidebar-content"
import { getBlogPosts, getBlogTags } from "@/actions/blog"

interface SidebarDataProps {
  selectedTags: string[]
}

export async function SidebarData({ selectedTags }: SidebarDataProps) {
  const [tags, allBlogPosts] = await Promise.all([
    getBlogTags(),
    getBlogPosts(),
  ])

  const recentPosts = allBlogPosts.slice(0, 4).map(post => ({
    title: post.title,
    date: post.date,
    href: post.href,
    isExternal: post.isExternal,
  }))

  return (
    <BlogSidebarContent
      tags={tags}
      recentPosts={recentPosts}
      selectedTags={selectedTags}
    />
  )
}
