export interface NotionPage {
  id: string;
  properties?: Record<string, unknown>;
  created_time?: string;
  last_edited_time?: string;
}

export interface NotionTag {
  name: string;
}
