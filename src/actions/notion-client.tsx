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

// For debugging purposes only
export async function searchNotion() {
    const response = await notion.search({});
    return JSON.stringify(response, null, 2);
}

export async function retrieveDatasource() {
    const response = await notion.dataSources.retrieve({
        data_source_id: datasourceId,
    });
    return JSON.stringify(response, null, 2);
}

export async function retrievePage(pageId: string) {
    const response = await notion.pages.retrieve({
        page_id: pageId,
    });
    return JSON.stringify(response, null, 2);
}

export async function retrievePageProperty(pageId: string, propertyName: string) {
    const response = await notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: propertyName,
    });
    return JSON.stringify(response, null, 2);
}

export async function queryDatasource() {
    const response = await notion.dataSources.query({
        data_source_id: datasourceId,
    });
    return JSON.stringify(response, null, 2);
}
