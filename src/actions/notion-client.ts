import { Client } from "@notionhq/client";

// Type-safe environment variable validation
function validateEnvVar(value: string | undefined, name: string): string {
    if (!value || value.trim() === '') {
        throw new Error(`${name} is required but not defined in environment variables`);
    }
    return value;
}

// Lazy initialization of client and datasource ID
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

export async function searchNotion() {
    try {
        const client = getNotionClient();
        const response = await client.search({});
        return response;
    } catch (error) {
        console.error('Failed to search Notion:', error);
        throw new Error(`Notion search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function retrieveDatasource() {
    try {
        const client = getNotionClient();
        const dsId = getDatasourceId();
        const response = await client.dataSources.retrieve({
            data_source_id: dsId,
        });
        return response;
    } catch (error) {
        console.error('Failed to retrieve datasource:', error);
        throw new Error(`Failed to retrieve datasource ${getDatasourceId()}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function retrievePage(pageId: string) {
    try {
        const client = getNotionClient();
        const response = await client.pages.retrieve({
            page_id: pageId,
        });
        return response;
    } catch (error) {
        console.error(`Failed to retrieve page ${pageId}:`, error);
        throw new Error(`Failed to retrieve page ${pageId}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function retrievePageProperty(pageId: string, propertyName: string) {
    try {
        const client = getNotionClient();
        const response = await client.pages.properties.retrieve({
            page_id: pageId,
            property_id: propertyName,
        });
        return response;
    } catch (error) {
        console.error(`Failed to retrieve property ${propertyName} from page ${pageId}:`, error);
        throw new Error(`Failed to retrieve property ${propertyName} from page ${pageId}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function queryDatasource() {
    try {
        const client = getNotionClient();
        const dsId = getDatasourceId();
        const response = await client.dataSources.query({
            data_source_id: dsId,
        });
        return response;
    } catch (error) {
        console.error('Failed to query datasource:', error);
        throw new Error(`Failed to query datasource ${getDatasourceId()}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export interface BlogPost {
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
    href: string;
}

interface NotionPage {
    id: string;
    properties?: Record<string, unknown>;
    created_time?: string;
}

interface NotionTag {
    name: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const response = await queryDatasource();

        // Extract blog posts from the response
        const blogPosts: BlogPost[] = response.results.map((page: NotionPage) => {
            const properties = page.properties || {};

            // Extract title
            const titleProp = properties.title || properties.Title || properties.Name;
            const title = (titleProp as { title?: Array<{ plain_text?: string }> })?.title?.[0]?.plain_text || 'Untitled';

            // Extract excerpt
            const excerptProp = properties.excerpt || properties.Excerpt || properties.Description;
            const excerpt = (excerptProp as { rich_text?: Array<{ plain_text?: string }> })?.rich_text?.[0]?.plain_text || '';

            // Extract date
            const dateProp = properties.date || properties.Date || properties.created_time || page.created_time;
            const date = typeof dateProp === 'string' ? dateProp : ((dateProp as { date?: { start?: string } })?.date?.start || new Date().toISOString());
            const formattedDate = new Date(date).toISOString().split('T')[0];

            // Extract tags
            const tagsProp = properties.tags || properties.Tags || properties.Category;
            const tags = ((tagsProp as { multi_select?: NotionTag[] })?.multi_select?.map((tag: NotionTag) => tag.name) || []);

            // Extract slug
            const slugProp = properties.slug || properties.Slug;
            const slug = (slugProp as { rich_text?: Array<{ plain_text?: string }> })?.rich_text?.[0]?.plain_text || page.id;

            // Generate href from slug
            const href = `/posts/${slug}`;

            return {
                title,
                excerpt,
                date: formattedDate,
                tags,
                href,
            };
        });

        // Sort by date descending
        return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('Failed to get blog posts:', error);
        throw new Error(`Failed to get blog posts: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export interface BlogPostDetail {
    id: string;
    title: string;
    createdTime: string;
    lastEditedTime: string;
    tags: string[];
    content: string;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
    try {
        const client = getNotionClient();
        const dsId = getDatasourceId();

        // Query database with slug and published filters
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

        // 0件の場合は404エラー
        if (response.results.length === 0) {
            return null;
        }

        // 2件以上の場合は500エラー
        if (response.results.length > 1) {
            throw new Error(`Multiple pages found with slug "${slug}". Expected exactly 1 page, but found ${response.results.length}.`);
        }

        const page = response.results[0] as NotionPage;

        const properties = page.properties || {};

        // Extract title
        const titleProp = properties.title || properties.Title || properties.Name;
        const title = (titleProp as { title?: Array<{ plain_text?: string }> })?.title?.[0]?.plain_text || 'Untitled';

        // Extract created_time and last_edited_time
        const createdTime = page.created_time || new Date().toISOString();
        const lastEditedTime = (page as { last_edited_time?: string }).last_edited_time || createdTime;

        const formattedCreatedTime = new Date(createdTime).toISOString().split('T')[0];
        const formattedLastEditedTime = new Date(lastEditedTime).toISOString().split('T')[0];

        // Extract tags
        const tagsProp = properties.tags || properties.Tags || properties.Category;
        const tags = ((tagsProp as { multi_select?: NotionTag[] })?.multi_select?.map((tag: NotionTag) => tag.name) || []);

        // Fetch page content blocks
        const blocks = await client.blocks.children.list({
            block_id: page.id,
        });

        // Convert blocks to HTML-like content with heading IDs
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertBlockToHtml(block: any, getHeadingId: () => number): string {
    const type = block.type;

    switch (type) {
        case 'paragraph': {
            const text = block.paragraph?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            return `<p>${text}</p>`;
        }
        case 'heading_1': {
            const text = block.heading_1?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            const id = `heading-${getHeadingId()}`;
            return `<h1 id="${id}">${text}</h1>`;
        }
        case 'heading_2': {
            const text = block.heading_2?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            const id = `heading-${getHeadingId()}`;
            return `<h2 id="${id}">${text}</h2>`;
        }
        case 'heading_3': {
            const text = block.heading_3?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            const id = `heading-${getHeadingId()}`;
            return `<h3 id="${id}">${text}</h3>`;
        }
        case 'bulleted_list_item': {
            const text = block.bulleted_list_item?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            return `<li>${text}</li>`;
        }
        case 'numbered_list_item': {
            const text = block.numbered_list_item?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            return `<li>${text}</li>`;
        }
        case 'code': {
            const text = block.code?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            return `<pre><code>${text}</code></pre>`;
        }
        case 'quote': {
            const text = block.quote?.rich_text?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            return `<blockquote>${text}</blockquote>`;
        }
        case 'image': {
            // Handle both external and file (Notion-hosted) images
            const imageData = block.image;
            let imageUrl = '';
            let altText = '';

            if (imageData?.type === 'external') {
                imageUrl = imageData.external?.url || '';
            } else if (imageData?.type === 'file') {
                imageUrl = imageData.file?.url || '';
            }

            // Extract caption as alt text
            const caption = imageData?.caption?.map((t: { plain_text?: string }) => t.plain_text).join('') || '';
            altText = caption || 'Image';

            if (!imageUrl) {
                return '';
            }

            return `<figure class="my-4"><img src="${imageUrl}" alt="${altText}" class="w-full rounded-lg" />${caption ? `<figcaption class="text-sm text-muted-foreground mt-2 text-center">${caption}</figcaption>` : ''}</figure>`;
        }
        default:
            return '';
    }
}

export interface TagWithCount {
    name: string;
    count: number;
}

export async function getBlogTags(): Promise<TagWithCount[]> {
    try {
        const blogPosts = await getBlogPosts();

        // Count tags from all blog posts
        const tagCounts = new Map<string, number>();

        blogPosts.forEach((post) => {
            post.tags.forEach((tag) => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        // Convert to array and sort by count descending
        const tags: TagWithCount[] = Array.from(tagCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return tags;
    } catch (error) {
        console.error('Failed to get blog tags:', error);
        throw new Error(`Failed to get blog tags: ${error instanceof Error ? error.message : String(error)}`);
    }
}
