import { BlogPostCard } from "@/components/blog/blog-post-card"
import { getBlogPosts, getInitialPosts } from "@/actions/blog"
import { BlogPostListClient } from "./blog-post-list-client"

interface BlogPostListProps {
  selectedTags: string[]
}

export async function BlogPostList({ selectedTags }: BlogPostListProps) {
  // タグフィルタリングがある場合は全記事取得、ない場合はしきい値分のみ取得
  if (selectedTags.length > 0) {
    const allBlogPosts = await getBlogPosts()
    const filteredPosts = allBlogPosts.filter(post =>
      selectedTags.some(tag => post.tags.includes(tag))
    )

    if (filteredPosts.length === 0) {
      return <p className="text-muted-foreground">該当する記事がありません。</p>
    }

    return (
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <BlogPostCard key={post.href} {...post} />
        ))}
      </div>
    )
  }

  // Lazy Load: 初回はしきい値分のみ取得
  const { posts: initialPosts, lastYearMonth, hasMore } = await getInitialPosts()

  if (initialPosts.length === 0) {
    return <p className="text-muted-foreground">該当する記事がありません。</p>
  }

  return (
    <BlogPostListClient
      initialPosts={initialPosts}
      initialLastYearMonth={lastYearMonth}
      initialHasMore={hasMore}
    />
  )
}
