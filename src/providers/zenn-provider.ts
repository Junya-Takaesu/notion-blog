import { BlogPost } from "@/lib/types/blog";
import { BlogProvider, CacheConfig } from "./blog-provider";

/**
 * Zenn API レスポンスの型
 */
interface ZennArticle {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  body_updated_at: string;
  body_letters_count: number;
  article_type: string;
  emoji: string;
  path: string;
  liked_count: number;
  bookmarked_count: number;
  comments_count: number;
  user: {
    id: number;
    username: string;
    name: string;
    avatar_small_url: string;
  };
  publication: unknown | null;
}

interface ZennResponse {
  articles: ZennArticle[];
  next_page: number | null;
  total_count: number;
}

function mapZennArticleToBlogPost(article: ZennArticle): BlogPost {
  return {
    title: article.title,
    excerpt: '',  // Zenn APIには抜粋がないため空文字
    date: article.published_at.split('T')[0],  // "2024-01-15"
    tags: [],  // Zenn APIの記事一覧にはタグ情報が含まれない
    href: `https://zenn.dev${article.path}`,
    source: 'zenn',
    isExternal: true,
  };
}

export class ZennBlogProvider implements BlogProvider {
  readonly source = 'zenn';
  readonly cacheConfig: CacheConfig = {
    enabled: true,
    revalidate: 3600,  // 1時間 = 3600秒
    tags: ['zenn-posts'],
  };

  private readonly username: string;

  constructor() {
    const username = process.env.ZENN_USERNAME;

    if (!username) {
      throw new Error('ZENN_USERNAME is required');
    }

    this.username = username;
  }

  async getPostsByMonth(year: number, month: number): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `https://zenn.dev/api/articles?username=${this.username}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Zenn API error: ${response.status}`);
      }

      const data: ZennResponse = await response.json();

      // 年月でフィルタリング
      const filtered = data.articles.filter(article => {
        const date = new Date(article.published_at);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });

      return filtered.map(mapZennArticleToBlogPost);
    } catch (error) {
      console.error('Failed to get blog posts from Zenn:', error);
      throw new Error(`Failed to get blog posts from Zenn: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 環境変数が設定されている場合のみインスタンスを作成
let zennProvider: ZennBlogProvider | null = null;

export function getZennProvider(): ZennBlogProvider | null {
  if (zennProvider) {
    return zennProvider;
  }

  if (process.env.ZENN_USERNAME) {
    try {
      zennProvider = new ZennBlogProvider();
      return zennProvider;
    } catch {
      console.warn('Zenn provider initialization failed. Zenn posts will not be available.');
      return null;
    }
  }

  return null;
}
