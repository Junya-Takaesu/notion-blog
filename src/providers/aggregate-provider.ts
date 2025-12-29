import { unstable_cache } from 'next/cache';
import { BlogPost, FetchResult, TagWithCount } from "@/lib/types/blog";
import { BlogProvider } from "./blog-provider";
import { notionProvider } from "./notion-provider";
import { getQiitaProvider } from "./qiita-provider";

const MIN_POSTS_THRESHOLD = 15;

/**
 * 記事履歴の取得年数（環境変数で設定可能、デフォルト5年）
 */
function getHistoryYears(): number {
  const envValue = process.env.BLOG_HISTORY_YEARS;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 5; // デフォルト5年
}

/**
 * 全てのアクティブなプロバイダーを取得
 */
export function getActiveProviders(): BlogProvider[] {
  const providers: BlogProvider[] = [notionProvider];

  const qiitaProvider = getQiitaProvider();
  if (qiitaProvider) {
    providers.push(qiitaProvider);
  }

  return providers;
}

/**
 * 指定年月の記事を全プロバイダーから取得
 */
export async function getPostsByMonth(
  providers: BlogProvider[],
  year: number,
  month: number
): Promise<BlogPost[]> {
  const fetchPromises = providers.map(provider => {
    const fetcher = () => provider.getPostsByMonth(year, month);

    // プロバイダーごとのキャッシュ設定を適用
    if (provider.cacheConfig.enabled) {
      const cachedFetcher = unstable_cache(
        fetcher,
        [`${provider.source}-posts-${year}-${month}`],
        {
          revalidate: provider.cacheConfig.revalidate,
          tags: provider.cacheConfig.tags,
        }
      );
      return cachedFetcher();
    }

    return fetcher();
  });

  const results = await Promise.allSettled(fetchPromises);

  // 失敗したプロバイダーをログに記録
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Provider ${providers[index].source} failed:`, result.reason);
    }
  });

  return results
    .filter((r): r is PromiseFulfilledResult<BlogPost[]> =>
      r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 指定年月から過去に遡って記事を取得
 * MIN_POSTS_THRESHOLD 件以上になるまで取得を続ける
 */
export async function fetchPostsFromMonth(
  startYear: number,
  startMonth: number,
  providers?: BlogProvider[]
): Promise<FetchResult> {
  const activeProviders = providers ?? getActiveProviders();
  const allPosts: BlogPost[] = [];
  let year = startYear;
  let month = startMonth;
  let lastYearMonth = `${year}-${String(month).padStart(2, '0')}`;

  // 過去の限界（環境変数で設定可能）
  const limitDate = new Date();
  limitDate.setFullYear(limitDate.getFullYear() - getHistoryYears());

  while (allPosts.length < MIN_POSTS_THRESHOLD) {
    const currentDate = new Date(year, month - 1, 1);

    // 過去限界チェック
    if (currentDate < limitDate) {
      return { posts: allPosts, lastYearMonth, hasMore: false };
    }

    // 該当年月の記事を取得（プロバイダーごとのキャッシュ設定が適用される）
    const monthPosts = await getPostsByMonth(activeProviders, year, month);
    allPosts.push(...monthPosts);
    lastYearMonth = `${year}-${String(month).padStart(2, '0')}`;

    // 前月へ移動
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }

  return { posts: allPosts, lastYearMonth, hasMore: true };
}

/**
 * 前月の年月を計算
 * @param yearMonth "YYYY-MM" 形式の文字列
 * @throws TypeError 形式が不正な場合
 */
export function getPreviousMonth(yearMonth: string): { year: number; month: number } {
  // 入力バリデーション
  if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
    throw new TypeError(`Invalid yearMonth format, expected YYYY-MM: ${yearMonth}`);
  }

  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  if (month < 1 || month > 12) {
    throw new TypeError(`Invalid month value, expected 1-12: ${month}`);
  }

  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

/**
 * 全記事を取得（タグ取得用）
 * 過去5年分の記事を全て取得
 */
export async function getAllPosts(providers?: BlogProvider[]): Promise<BlogPost[]> {
  const activeProviders = providers ?? getActiveProviders();
  const allPosts: BlogPost[] = [];

  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  // 過去の履歴を取得（環境変数で設定可能）
  const limitDate = new Date();
  limitDate.setFullYear(limitDate.getFullYear() - getHistoryYears());

  while (true) {
    const currentDate = new Date(year, month - 1, 1);
    if (currentDate < limitDate) {
      break;
    }

    const monthPosts = await getPostsByMonth(activeProviders, year, month);
    allPosts.push(...monthPosts);

    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }

  return allPosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 全タグとその記事数を取得
 */
export async function getBlogTags(providers?: BlogProvider[]): Promise<TagWithCount[]> {
  const allPosts = await getAllPosts(providers);

  const tagCounts = new Map<string, number>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
