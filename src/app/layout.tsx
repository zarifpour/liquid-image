'use client'

import { LiquidImage } from '../components/LiquidImage'
import type { Viewport } from 'next/types'
import { Suspense } from 'react'

export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>Liquid Metal • Zarifpour</title>
        <meta name="description" content="Transform your logo into liquid metal" />
      </head>
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100dvh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ paddingBottom: '80px' }}>
            <Suspense>
              <LiquidImage src="/logos/apple.png" height={200} width={200} />
              <LiquidImage src="/logos/apple.png" height={200} width={200} invert showControls />
              <LiquidImage src="/droplet.png" height={500} />
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  width: 'device-width',
  themeColor: '#000'
}
