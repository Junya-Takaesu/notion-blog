import { BlogPost } from "@/lib/types/blog";
import { BlogProvider, CacheConfig } from "./blog-provider";

/**
 * Qiita API レスポンスの型
 */
interface QiitaItem {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
  tags: Array<{
    name: string;
    versions: string[];
  }>;
  likes_count: number;
  stocks_count: number;
  comments_count: number;
  reactions_count: number;
  page_views_count: number | null;
  private: boolean;
}

function mapQiitaItemToBlogPost(item: QiitaItem): BlogPost {
  return {
    title: item.title,
    excerpt: '',  // Qiita APIには抜粋がないため空文字
    date: item.created_at.split('T')[0],  // "2024-01-15"
    tags: item.tags.map(t => t.name),
    href: item.url,        // 外部リンク
    source: 'qiita',
    isExternal: true,
  };
}

export class QiitaBlogProvider implements BlogProvider {
  readonly source = 'qiita';
  readonly cacheConfig: CacheConfig = {
    enabled: true,
    revalidate: 3600,  // 1時間 = 3600秒
    tags: ['qiita-posts'],
  };

  private readonly userId: string;
  private readonly accessToken: string;

  constructor() {
    const userId = process.env.QIITA_USER_ID;
    const accessToken = process.env.QIITA_ACCESS_TOKEN;

    if (!userId || !accessToken) {
      throw new Error('QIITA_USER_ID and QIITA_ACCESS_TOKEN are required');
    }

    this.userId = userId;
    this.accessToken = accessToken;
  }

  async getPostsByMonth(year: number, month: number): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `https://qiita.com/api/v2/users/${this.userId}/items?page=1&per_page=100`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Qiita API error: ${response.status}`);
      }

      const items: QiitaItem[] = await response.json();

      // 年月でフィルタリング
      const filtered = items.filter(item => {
        const date = new Date(item.created_at);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });

      return filtered.map(mapQiitaItemToBlogPost);
    } catch (error) {
      console.error('Failed to get blog posts from Qiita:', error);
      throw new Error(`Failed to get blog posts from Qiita: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 環境変数が設定されている場合のみインスタンスを作成
let qiitaProvider: QiitaBlogProvider | null = null;

export function getQiitaProvider(): QiitaBlogProvider | null {
  if (qiitaProvider) {
    return qiitaProvider;
  }

  if (process.env.QIITA_USER_ID && process.env.QIITA_ACCESS_TOKEN) {
    try {
      qiitaProvider = new QiitaBlogProvider();
      return qiitaProvider;
    } catch {
      console.warn('Qiita provider initialization failed. Qiita posts will not be available.');
      return null;
    }
  }

  return null;
}
