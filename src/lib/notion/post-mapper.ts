import { BlogPost, BlogPostDetail } from "@/lib/types/blog";
import { NotionPage, NotionTag } from "./types";

/**
 * Notion APIレスポンスをBlogPostにマッピング
 */
export function mapNotionPageToBlogPost(page: NotionPage): BlogPost {
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
}

/**
 * Notion APIレスポンスをBlogPostDetailにマッピング
 */
export function mapNotionPageToBlogPostDetail(
  page: NotionPage,
  content: string
): BlogPostDetail {
  const properties = page.properties || {};

  const titleProp = properties.title || properties.Title || properties.Name;
  const title = (titleProp as { title?: Array<{ plain_text?: string }> })?.title?.[0]?.plain_text || 'Untitled';

  const createdTime = page.created_time || new Date().toISOString();
  const lastEditedTime = page.last_edited_time || createdTime;

  const formattedCreatedTime = new Date(createdTime).toISOString().split('T')[0];
  const formattedLastEditedTime = new Date(lastEditedTime).toISOString().split('T')[0];

  const tagsProp = properties.tags || properties.Tags || properties.Category;
  const tags = ((tagsProp as { multi_select?: NotionTag[] })?.multi_select?.map((tag: NotionTag) => tag.name) || []);

  return {
    id: page.id,
    title,
    createdTime: formattedCreatedTime,
    lastEditedTime: formattedLastEditedTime,
    tags,
    content,
  };
}
