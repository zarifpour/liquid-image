'use client';

import { LiquidImage } from '@/components/LiquidImage';
import { Fragment, Suspense, useState } from 'react';

const APPLE_LOGO_ID = '01JMFPY99JXXKRQWDAHBY0ARQH';

export default function Home() {
  const [currentId, setCurrentId] = useState(APPLE_LOGO_ID);

  return (
    <>
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <div className="pb-80">
          <Suspense>
            <LiquidImage
              src={`https://p1ljtcp1ptfohfxm.public.blob.vercel-storage.com/${currentId}.png`}
              // refraction={0.015}
              // edge={0.4}
              // patternBlur={0.005}
              // liquid={0.07}
              // speed={0.3}
              // patternScale={2}
              showControls={false}
            />
          </Suspense>
        </div>

        <div className="mb-16 flex w-full gap-24 overflow-scroll p-16 text-sm select-none *:first:ml-auto *:last:mr-auto">
          {logos.map((group, groupIndex) => (
            <Fragment key={group[0].name}>
              <div key={`${group[0].name}-group`} className="flex">
                {group.map(({ name, id, src }) => (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setCurrentId(id)}
                    className="group flex flex-col gap-8 text-center"
                  >
                    <div className="flex h-100 w-160 items-center justify-center rounded-8 p-24 opacity-40 outline -outline-offset-1 outline-transparent transition-[opacity,outline] duration-150 group-hover:opacity-100 group-hover:outline-white/40 hover:duration-0">
                      <img alt={`${name} Logo`} src={src} className="h-52 w-152 object-contain" />
                    </div>
                    <span className="text-white/70">{name}</span>
                  </button>
                ))}
              </div>

              {groupIndex !== logos.length - 1 && <div className="h-100 w-1 shrink-0 bg-white/20" />}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

const logos = [
  [
    {
      name: 'Apple',
      id: '01JMFPY99JXXKRQWDAHBY0ARQH',
      src: '/logos/apple.svg',
    },
    {
      name: 'Nike',
      id: '01JMFN4FHEYQY3CBR7B4YBZFK9',
      src: '/logos/nike.svg',
    },
    {
      name: 'NASA',
      id: '01JMFN7R2E6WV297MM6EHBCAW6',
      src: '/logos/nasa.svg',
    },
    {
      name: 'Chanel',
      id: '01JMFNF83EX5DAVWF1TP1469BW',
      src: '/logos/chanel.svg',
    },
    {
      name: 'Volkswagen',
      id: '01JMFPD47QAN0FXMWWQC8YG8SY',
      src: '/logos/volkswagen.svg',
    },
  ],
  [
    {
      name: 'Vercel',
      id: '01JMFQ1ESB52205RRGSHCXHCZG',
      src: '/logos/vercel.svg',
    },
    {
      name: 'Discord',
      id: '01JMFQS93Q6R2VRQ62HTAA2AKG',
      src: '/logos/discord.svg',
    },
    {
      name: 'Remix',
      id: '01JMFQ533G3TVC21E96RSAG4KF',
      src: '/logos/remix.svg',
    },
    {
      name: 'Cloudflare',
      id: '01JMFQZ01HE5Q0TR647QV5W6YW',
      src: '/logos/cloudflare.svg',
    },
  ],
];
