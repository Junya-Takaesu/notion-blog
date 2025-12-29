import { ImageResponse } from 'next/og'
import { SITE_CONFIG } from '@/lib/utils'

export const runtime = 'edge'
export const alt = SITE_CONFIG.name
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '40px 80px',
          position: 'relative',
        }}
      >
        {/* 光るバックスラッシュ - 背景に大きく配置 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 400,
            fontWeight: 'bold',
            color: '#00d9ff',
            opacity: 0.15,
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
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '1000px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* タイトル横の光るバックスラッシュ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontWeight: 'bold',
                color: '#00d9ff',
                textShadow: '0 0 20px #00d9ff, 0 0 40px #00d9ff, 0 0 60px #00d9ff, 0 0 80px #00d9ff',
                fontFamily: 'monospace',
              }}
            >
              \
            </span>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {SITE_CONFIG.name}
            </h1>
          </div>
          <p
            style={{
              fontSize: 32,
              color: '#a0a0a0',
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            ${SITE_CONFIG.description}
          </p>
        </div>
      </div>
    ),
    { ...size }
  )
}
