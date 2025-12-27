import { BlogPostCard } from "@/components/blog/blog-post-card"
import { getBlogPosts } from "@/actions/notion-client"

interface BlogPostListProps {
  selectedTags: string[]
}

export async function BlogPostList({ selectedTags }: BlogPostListProps) {
  const allBlogPosts = await getBlogPosts()

  // Filter posts by tags (OR condition) if any tags are selected
  const blogPosts = selectedTags.length > 0
    ? allBlogPosts.filter(post => selectedTags.some(tag => post.tags.includes(tag)))
    : allBlogPosts

  if (blogPosts.length === 0) {
    return <p className="text-muted-foreground">該当する記事がありません。</p>
  }

  return (
    <div className="space-y-6">
      {blogPosts.map((post) => (
        <BlogPostCard key={post.href} {...post} />
      ))}
    </div>
  )
}
