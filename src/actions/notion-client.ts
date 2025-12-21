import { Client } from "@notionhq/client";

// Type-safe environment variable validation
function validateEnvVar(value: string | undefined, name: string): string {
    if (!value || value.trim() === '') {
        throw new Error(`${name} is required but not defined in environment variables`);
    }
    return value;
}

// Validate required environment variables
const notionToken = validateEnvVar(process.env.NOTION_TOKEN, 'NOTION_TOKEN');
const datasourceId = validateEnvVar(process.env.NOTION_DATASOURCE_ID, 'NOTION_DATASOURCE_ID');

// Initialize client only after validation
const notion = new Client({
    auth: notionToken,
});

export async function searchNotion() {
    try {
        const response = await notion.search({});
        return response;
    } catch (error) {
        console.error('Failed to search Notion:', error);
        throw new Error(`Notion search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function retrieveDatasource() {
    try {
        const response = await notion.dataSources.retrieve({
            data_source_id: datasourceId,
        });
        return response;
    } catch (error) {
        console.error('Failed to retrieve datasource:', error);
        throw new Error(`Failed to retrieve datasource ${datasourceId}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function retrievePage(pageId: string) {
    try {
        const response = await notion.pages.retrieve({
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
        const response = await notion.pages.properties.retrieve({
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
        const response = await notion.dataSources.query({
            data_source_id: datasourceId,
        });
        return response;
    } catch (error) {
        console.error('Failed to query datasource:', error);
        throw new Error(`Failed to query datasource ${datasourceId}: ${error instanceof Error ? error.message : String(error)}`);
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

            // Generate href from page id
            const href = `/posts/${page.id}`;

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
