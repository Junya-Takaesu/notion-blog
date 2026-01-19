'use server';

import { cache } from 'react';
import { BlogPost, FetchResult, TagWithCount, BlogPostDetail } from "@/lib/types/blog";
import {
  fetchPostsFromMonth,
  getPreviousMonth,
  getAllPosts,
  getBlogTags as getAggregatedBlogTags,
} from "@/providers/aggregate-provider";
import { notionProvider } from "@/providers/notion-provider";

/**
 * 現在の年月から記事を取得
 */
export async function getInitialPosts(): Promise<FetchResult> {
  const now = new Date();
  return fetchPostsFromMonth(now.getFullYear(), now.getMonth() + 1);
}

/**
 * 指定年月の前月から記事を取得
 */
export async function getMorePosts(lastYearMonth: string): Promise<FetchResult> {
  const { year, month } = getPreviousMonth(lastYearMonth);
  return fetchPostsFromMonth(year, month);
}

/**
 * 全記事を取得
 */
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return getAllPosts();
});

/**
 * 全タグとその記事数を取得
 */
export async function getBlogTags(): Promise<TagWithCount[]> {
  return getAggregatedBlogTags();
}

/**
 * スラッグから記事詳細を取得（Notion のみ）
 */
export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDetail | null> => {
  return notionProvider.getPostBySlug(slug);
});
