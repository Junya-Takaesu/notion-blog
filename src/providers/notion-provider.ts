import { Client } from "@notionhq/client";
import { BlogPost, BlogPostDetail } from "@/lib/types/blog";
import { CacheConfig, DetailableBlogProvider } from "./blog-provider";

function validateEnvVar(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`${name} is required but not defined in environment variables`);
  }
  return value;
}

let notion: Client | null = null;
let datasourceId: string | null = null;

function getNotionClient() {
  if (!notion) {
    const notionToken = validateEnvVar(process.env.NOTION_TOKEN, 'NOTION_TOKEN');
    notion = new Client({
      auth: notionToken,
    });
  }
  return notion;
}

function getDatasourceId() {
  if (!datasourceId) {
    datasourceId = validateEnvVar(process.env.NOTION_DATASOURCE_ID, 'NOTION_DATASOURCE_ID');
  }
  return datasourceId;
}

interface NotionPage {
  id: string;
  properties?: Record<string, unknown>;
  created_time?: string;
  last_edited_time?: string;
}

interface NotionTag {
  name: string;
}

/**
 * HTML属性値のエスケープ
 */
function escapeHtmlAttribute(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * HTMLテキストコンテンツのエスケープ
 */
function escapeHtmlContent(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertBlockToHtml(block: any, getHeadingId: () => number): string {
  const type = block.type;

  switch (type) {
    case 'paragraph': {
      const text = block.paragraph?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      return `<p>${escapeHtmlContent(text)}</p>`;
    }
    case 'heading_1': {
      const text = block.heading_1?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const id = `heading-${getHeadingId()}`;
      return `<h1 id="${id}">${escapeHtmlContent(text)}</h1>`;
    }
    case 'heading_2': {
      const text = block.heading_2?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const id = `heading-${getHeadingId()}`;
      return `<h2 id="${id}">${escapeHtmlContent(text)}</h2>`;
    }
    case 'heading_3': {
      const text = block.heading_3?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const id = `heading-${getHeadingId()}`;
      return `<h3 id="${id}">${escapeHtmlContent(text)}</h3>`;
    }
    case 'bulleted_list_item': {
      const text = block.bulleted_list_item?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      return `<li>${escapeHtmlContent(text)}</li>`;
    }
    case 'numbered_list_item': {
      const text = block.numbered_list_item?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      return `<li>${escapeHtmlContent(text)}</li>`;
    }
    case 'code': {
      const text = block.code?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const language = block.code?.language || 'plain text';
      const escapedText = escapeHtmlContent(text);
      const escapedLanguage = escapeHtmlAttribute(language);
      return `<pre data-language="${escapedLanguage}"><code>${escapedText}</code></pre>`;
    }
    case 'quote': {
      const text = block.quote?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      return `<blockquote>${escapeHtmlContent(text)}</blockquote>`;
    }
    case 'image': {
      const imageData = block.image;
      let imageUrl = '';

      if (imageData?.type === 'external') {
        imageUrl = imageData.external?.url || '';
      } else if (imageData?.type === 'file') {
        imageUrl = imageData.file?.url || '';
      }

      const caption = imageData?.caption?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
      const altText = caption || 'Image';

      if (!imageUrl) {
        return '';
      }

      // エスケープしてインジェクション対策
      const escapedUrl = escapeHtmlAttribute(imageUrl);
      const escapedAlt = escapeHtmlAttribute(altText);
      const escapedCaption = escapeHtmlContent(caption);

      return `<figure class="my-4"><img src="${escapedUrl}" alt="${escapedAlt}" class="w-full rounded-lg" />${caption ? `<figcaption class="text-sm text-muted-foreground mt-2 text-center">${escapedCaption}</figcaption>` : ''}</figure>`;
    }
    default:
      return '';
  }
}

// キャッシュ用の全記事データ
let allNotionPostsCache: BlogPost[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1分間のキャッシュ

async function getAllNotionPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (allNotionPostsCache && now - lastFetchTime < CACHE_TTL) {
    return allNotionPostsCache;
  }

  const client = getNotionClient();
  const dsId = getDatasourceId();

  const response = await client.dataSources.query({
    data_source_id: dsId,
  });

  const blogPosts: BlogPost[] = response.results.map((page: NotionPage) => {
    const properties = page.properties || {};

    const titleProp = properties.title || properties.Title || properties.Name;
    const title = (titleProp as { title?: Array<{ plain_text?: string }> })?.title?.[0]?.plain_text || 'Untitled';

    const excerptProp = properties.excerpt || properties.Excerpt || properties.Description;
    const excerpt = (excerptProp as { rich_text?: Array<{ plain_text?: string }> })?.rich_text?.[0]?.plain_text || '';

    const dateProp = properties.date || properties.Date || properties.created_time || page.created_time;
    const date = typeof dateProp === 'string' ? dateProp : ((dateProp as { date?: { start?: string } })?.date?.start || new Date().toISOString());
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const tagsProp = properties.tags || properties.Tags || properties.Category;
    const tags = ((tagsProp as { multi_select?: NotionTag[] })?.multi_select?.map((tag: NotionTag) => tag.name) || []);

    const slugProp = properties.slug || properties.Slug;
    const slug = (slugProp as { rich_text?: Array<{ plain_text?: string }> })?.rich_text?.[0]?.plain_text || page.id;

    const href = `/posts/${slug}`;

    return {
      title,
      excerpt,
      date: formattedDate,
      tags,
      href,
      source: 'notion' as const,
      isExternal: false,
    };
  });

  // Sort by date descending
  allNotionPostsCache = blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  lastFetchTime = now;

  return allNotionPostsCache;
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
      const properties = page.properties || {};

      const titleProp = properties.title || properties.Title || properties.Name;
      const title = (titleProp as { title?: Array<{ plain_text?: string }> })?.title?.[0]?.plain_text || 'Untitled';

      const createdTime = page.created_time || new Date().toISOString();
      const lastEditedTime = page.last_edited_time || createdTime;

      const formattedCreatedTime = new Date(createdTime).toISOString().split('T')[0];
      const formattedLastEditedTime = new Date(lastEditedTime).toISOString().split('T')[0];

      const tagsProp = properties.tags || properties.Tags || properties.Category;
      const tags = ((tagsProp as { multi_select?: NotionTag[] })?.multi_select?.map((tag: NotionTag) => tag.name) || []);

      const blocks = await client.blocks.children.list({
        block_id: page.id,
      });

      let headingCounter = 0;
      const content = blocks.results.map((block) => {
        return convertBlockToHtml(block, () => {
          headingCounter++;
          return headingCounter;
        });
      }).join('\n');

      return {
        id: page.id,
        title,
        createdTime: formattedCreatedTime,
        lastEditedTime: formattedLastEditedTime,
        tags,
        content,
      };
    } catch (error) {
      console.error(`Failed to get blog post by slug ${slug}:`, error);
      throw new Error(`Failed to get blog post by slug ${slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const notionProvider = new NotionBlogProvider();
