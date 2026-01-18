import { Client } from "@notionhq/client";

export function validateEnvVar(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`${name} is required but not defined in environment variables`);
  }
  return value;
}

let notion: Client | null = null;
let datasourceId: string | null = null;

export function getNotionClient(): Client {
  if (!notion) {
    const notionToken = validateEnvVar(process.env.NOTION_TOKEN, 'NOTION_TOKEN');
    notion = new Client({
      auth: notionToken,
    });
  }
  return notion;
}

export function getDatasourceId(): string {
  if (!datasourceId) {
    datasourceId = validateEnvVar(process.env.NOTION_DATASOURCE_ID, 'NOTION_DATASOURCE_ID');
  }
  return datasourceId;
}
