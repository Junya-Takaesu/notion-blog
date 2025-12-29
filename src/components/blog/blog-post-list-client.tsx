'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogPost, FetchResult } from "@/lib/types/blog";
import { Loader2 } from "lucide-react";

interface BlogPostListClientProps {
  initialPosts: BlogPost[];
  initialLastYearMonth: string;
  initialHasMore: boolean;
}

export function BlogPostListClient({
  initialPosts,
  initialLastYearMonth,
  initialHasMore,
}: BlogPostListClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [lastYearMonth, setLastYearMonth] = useState<string>(initialLastYearMonth);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts?startYearMonth=${lastYearMonth}`);
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data: FetchResult = await res.json();

      // 重複を除外して追加
      setPosts(prev => {
        const existingHrefs = new Set(prev.map(p => p.href));
        const newPosts = data.posts.filter(p => !existingHrefs.has(p.href));
        return [...prev, ...newPosts];
      });
      setLastYearMonth(data.lastYearMonth);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, lastYearMonth]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: '100px' }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [loadMore, isLoading]);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <BlogPostCard key={post.href} {...post} />
      ))}

      {/* Loading sentinel */}
      <div ref={sentinelRef} className="py-4">
        {isLoading && (
          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>読み込み中...</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-muted-foreground text-sm">
            すべての記事を読み込みました
          </p>
        )}
      </div>
    </div>
  );
}
