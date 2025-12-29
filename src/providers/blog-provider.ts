import { BlogPost, BlogPostDetail } from "@/lib/types/blog";

/**
 * キャッシュ設定
 */
export interface CacheConfig {
  /** キャッシュを有効にするか */
  enabled: boolean;
  /** キャッシュの有効期間（秒） */
  revalidate?: number;
  /** キャッシュのタグ（無効化用） */
  tags?: string[];
}

/**
 * ブログプロバイダーの基本インターフェース
 * 各記事ソース（Notion, Qiita など）はこのインターフェースを実装する
 */
export interface BlogProvider {
  readonly source: string;
  readonly cacheConfig: CacheConfig;

  /**
   * 指定年月の記事を取得
   * @param year 年（例: 2024）
   * @param month 月（1-12）
   */
  getPostsByMonth(year: number, month: number): Promise<BlogPost[]>;
}

/**
 * 詳細ページを持つプロバイダー用のインターフェース
 * Notion のみが詳細取得に対応
 */
export interface DetailableBlogProvider extends BlogProvider {
  getPostBySlug(slug: string): Promise<BlogPostDetail | null>;
}
