import { Hero } from './hero/hero';
import { Suspense } from 'react';

type MainContentProps = {
  initialImageId?: string;
};

export function MainContent({ initialImageId }: MainContentProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Liquid Logo</h1>
        <p>Happy Apple event day</p>

        <Suspense fallback={<div>Loading...</div>}>
          <Hero initialImageId={initialImageId} />
        </Suspense>

        <p>
          Tips: white or transparent background, any color or black will count as the shape shapes work better than
          detail or text, SVG or high res PNG/JPG, 4.5MB or smaller
        </p>
        <p>
          Presets todo: Nike, Apple, Vercel, Supabase, Paper, Discord, Slack, T3, Starbucks (SVG that verekia sent me),
          cloudflare, fly.io if I can separate the balloon, React, Chrome, Radix, base ui, figma, adobe's A, sketch
          (wireframe one), macrumors, the verge, techcrunch, wired, Framer, WorkOS, basement
        </p>

        <p>
          Paper is on a mission to bring creativity back into design tools
          <br />
          designers: <a href="https://paper.design">paper.design</a>
          <br />
          developers: <a href="https://github.com/paper-design/paper">paper shaders</a>
        </p>
      </div>
    </div>
  );
}
