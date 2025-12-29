import { ImageResponse } from 'next/og'
import { getBlogPostBySlug } from '@/actions/blog'
import { SITE_CONFIG } from '@/lib/utils'

export const runtime = 'edge'
export const alt = 'ブログ記事のOG画像'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a2e',
            position: 'relative',
          }}
        >
          {/* 光るバックスラッシュ */}
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 300,
              fontWeight: 'bold',
              color: '#00d9ff',
              opacity: 0.1,
              textShadow: '0 0 60px #00d9ff, 0 0 120px #00d9ff',
              fontFamily: 'monospace',
              display: 'flex',
            }}
          >
            \
          </span>
          <h1
            style={{
              fontSize: 60,
              color: '#ffffff',
              position: 'relative',
              zIndex: 1,
            }}
          >
            記事が見つかりません
          </h1>
        </div>
      ),
      { ...size }
    )
  }

  // タイトルを適切な長さに調整
  const title = post.title.length > 60 
    ? post.title.substring(0, 57) + '...'
    : post.title

  // タグを最大4つまで表示
  const displayTags = post.tags.slice(0, 4)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#1a1a2e',
          backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '40px 80px',
          position: 'relative',
        }}
      >
        {/* 光るバックスラッシュ - 右側に大きく配置 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '60px',
            transform: 'translateY(-50%)',
            fontSize: 350,
            fontWeight: 'bold',
            color: '#00d9ff',
            opacity: 0.12,
            textShadow: '0 0 60px #00d9ff, 0 0 120px #00d9ff, 0 0 180px #00d9ff',
            fontFamily: 'monospace',
            display: 'flex',
          }}
        >
          \
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '900px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.3,
              marginBottom: 24,
              wordBreak: 'break-word',
            }}
          >
            {title}
          </h1>
          
          {displayTags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: 24,
              }}
            >
              {displayTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#e94560',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: 22,
                    fontWeight: '500',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
              paddingTop: 32,
              gap: '12px',
            }}
          >
            {/* サイト名横の小さな光るバックスラッシュ */}
            <span
              style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: '#00d9ff',
                textShadow: '0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff',
                fontFamily: 'monospace',
              }}
            >
              \
            </span>
            <p
              style={{
                fontSize: 26,
                color: '#a0a0a0',
              }}
            >
              {SITE_CONFIG.description}
            </p>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
