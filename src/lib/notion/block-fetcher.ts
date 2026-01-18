import { getNotionClient } from "./client";

/**
 * すべてのブロックを取得（ページネーション対応）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllBlocks(blockId: string): Promise<any[]> {
  const client = getNotionClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allBlocks: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await client.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    allBlocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return allBlocks;
}
