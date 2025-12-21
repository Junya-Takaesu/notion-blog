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
