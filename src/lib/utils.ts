import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Metadata } from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * サイトURLを環境変数から取得
 * 優先順位: NEXT_PUBLIC_SITE_URL > VERCEL_URL > デフォルト値
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  console.error('NEXT_PUBLIC_SITE_URL or VERCEL_URL is not set');
  return 'https://error.example.com';
}

// ========================================
// サイト共通設定（1箇所で管理）
// ========================================
export const SITE_CONFIG = {
  name: '＼ Rust Go Python Blog',
  description: 'Rust Go Python Blog - ITに関する様々なトピックを扱うブログ',
  locale: 'ja_JP',
} as const

/**
 * HTMLコンテンツから説明文を生成
 */
export function generateDescription(htmlContent: string, maxLength = 160): string {
  const plainText = htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength - 3) + '...'
    : plainText || '技術ブログ記事'
}

/**
 * サイト全体のベースメタデータを生成（layout.tsx 用）
 */
export function generateSiteMetadata(): Metadata {
  const siteUrl = getSiteUrl()
  // OG画像URLを明示的に指定（Next.jsの自動解決に頼らない）
  const ogImageUrl = `${siteUrl}/opengraph-image`

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    openGraph: {
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: siteUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [ogImageUrl],
    },
  }
}

/**
 * 記事用のメタデータを生成
 */
export function generateArticleMetadata(params: {
  title: string
  description: string
  slug: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}): Metadata {
  const siteUrl = getSiteUrl()
  const { title, description, slug, publishedTime, modifiedTime, tags } = params
  const pageUrl = `${siteUrl}/posts/${slug}`
  // OG画像URLを明示的に指定（Next.jsの自動解決に頼らない）
  const ogImageUrl = `${siteUrl}/posts/${slug}/opengraph-image`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: SITE_CONFIG.locale,
      publishedTime,
      modifiedTime,
      tags,
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}
