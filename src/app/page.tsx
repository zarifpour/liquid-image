'use client';

import { LiquidImage } from '@/components/LiquidImage';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          minHeight: '100dvh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ paddingBottom: '80px' }}>
          <Suspense>
            <LiquidImage
              src="/apple-touch-icon.png"
              // refraction={0.015}
              // edge={0.4}
              // patternBlur={0.005}
              // liquid={0.07}
              // speed={0.3}
              // patternScale={2}
              // showControls={true}
            />
            <LiquidImage src="/logos/apple.svg" />
            <LiquidImage src="/logos/apple.svg" height={400} width={400} showControls={true} />
            <LiquidImage src="/favicon.ico" />
            <LiquidImage src="/logos/zara.jpg" />
          </Suspense>
        </div>
      </div>
    </>
  );
}
