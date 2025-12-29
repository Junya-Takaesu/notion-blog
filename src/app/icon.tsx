// app/icon.js (or icon.tsx)

import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png'; // Use PNG for broader support

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24, // Adjust size as needed
          background: 'transparent', // Set background color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* バックスラッシュがアイコン/ロゴ/favicon */}
        \
      </div>
    ),
    {
      ...size,
    }
  );
}
