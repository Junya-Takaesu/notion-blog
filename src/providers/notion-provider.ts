import { BlogPost, BlogPostDetail } from "@/lib/types/blog";
import { CacheConfig, DetailableBlogProvider } from "./blog-provider";
import { getNotionClient, getDatasourceId } from "@/lib/notion/client";
import { NotionCache } from "@/lib/notion/cache";
import { mapNotionPageToBlogPost, mapNotionPageToBlogPostDetail } from "@/lib/notion/post-mapper";
import { NotionPage } from "@/lib/notion/types";
import { getAllBlocks } from "@/lib/notion/block-fetcher";
import { convertBlockToHtml } from "@/lib/notion/block-converter";
import { wrapListItems } from "@/lib/notion/list-wrapper";

// キャッシュインスタンス（1分間のTTL）
const postsCache = new NotionCache<BlogPost[]>(60 * 1000);

async function getAllNotionPosts(): Promise<BlogPost[]> {
  const cached = postsCache.get('all-posts');
  if (cached) {
    return cached;
  }

  const client = getNotionClient();
  const dsId = getDatasourceId();

  const response = await client.dataSources.query({
    data_source_id: dsId,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
  });

  const blogPosts: BlogPost[] = response.results.map((page: NotionPage) =>
    mapNotionPageToBlogPost(page)
  );

  // Sort by date descending
  const sortedPosts = blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  postsCache.set('all-posts', sortedPosts);

  return sortedPosts;
}

export class NotionBlogProvider implements DetailableBlogProvider {
  readonly source = 'notion';
  readonly cacheConfig: CacheConfig = {
    enabled: false,  // キャッシュ無効（リアルタイム反映が必要）
  };

  async getPostsByMonth(year: number, month: number): Promise<BlogPost[]> {
    try {
      const allPosts = await getAllNotionPosts();

      // 年月でフィルタリング
      return allPosts.filter(post => {
        const postDate = new Date(post.date);
        return postDate.getFullYear() === year && postDate.getMonth() + 1 === month;
      });
    } catch (error) {
      console.error('Failed to get blog posts by month from Notion:', error);
      throw new Error(`Failed to get blog posts by month from Notion: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
    try {
      const client = getNotionClient();
      const dsId = getDatasourceId();

      const response = await client.dataSources.query({
        data_source_id: dsId,
        filter: {
          and: [
            {
              property: 'Slug',
              rich_text: {
                equals: slug,
              },
            },
            {
              property: 'Published',
              checkbox: {
                equals: true,
              },
            },
          ],
        },
      });

      if (response.results.length === 0) {
        return null;
      }

      if (response.results.length > 1) {
        throw new Error(`Multiple pages found with slug "${slug}". Expected exactly 1 page, but found ${response.results.length}.`);
      }

      const page = response.results[0] as NotionPage;

      // ページネーション対応ですべてのブロックを取得
      const blocks = await getAllBlocks(page.id);

      let headingCounter = 0;
      const htmlParts: string[] = [];
      for (const block of blocks) {
        const html = await convertBlockToHtml(block, () => {
          headingCounter++;
          return headingCounter;
        });
        htmlParts.push(html);
      }

      // 連続するリストアイテムを<ul>/<ol>でラップ
      const content = wrapListItems(htmlParts);

      return mapNotionPageToBlogPostDetail(page, content);
    } catch (error) {
      console.error(`Failed to get blog post by slug ${slug}:`, error);
      throw new Error(`Failed to get blog post by slug ${slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const notionProvider = new NotionBlogProvider();
