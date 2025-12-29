/**
 * 記事の統合インターフェース
 * Notion, Qiita など複数のソースからの記事を統一的に扱う
 */
export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  href: string;           // Notion: /posts/xxx, Qiita: https://qiita.com/...
  source: 'notion' | 'qiita' | 'zenn' | string;  // 将来の拡張用
  isExternal: boolean;    // Qiita: true, Notion: false
}

/**
 * Notion 記事の詳細情報（詳細ページ用）
 */
export interface BlogPostDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdTime: string;
  lastEditedTime: string;
}

/**
 * 年月指定での取得結果
 */
export interface MonthlyPostsResult {
  posts: BlogPost[];
  yearMonth: string;  // "2024-01" 形式
}

/**
 * 記事取得の結果（Lazy Load 用）
 */
export interface FetchResult {
  posts: BlogPost[];
  lastYearMonth: string;  // "2024-01" 形式
  hasMore: boolean;
}

/**
 * タグとその記事数
 */
export interface TagWithCount {
  name: string;
  count: number;
}
