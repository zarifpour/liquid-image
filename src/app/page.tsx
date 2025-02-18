import { Hero } from './hero/hero';

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Liquid Logo</h1>
        <p>Happy Apple event day</p>
        <p>
          designers: <a href="https://paper.design">paper.design</a>
        </p>
        <p>
          developers: <a href="https://github.com/paper-design/paper">paper shaders</a>
        </p>
        <Hero />

        <p>Tips: white or transparent background, shapes work better than detail or text, SVG or high res PNG/JPG</p>
        <p>
          Presets todo: Nike, Apple, Vercel, Supabase, Paper, Discord, Slack, T3, Starbucks (SVG that verekia sent me),
          cloudflare, fly.io if I can separate the balloon, React, Chrome, Radix, base ui, figma, adobe's A, sketch
          (wireframe one), macrumors, the verge, techcrunch, wired,
        </p>
        <p>TODO: have a default shader running when you land (pre-parse the image)</p>
        <p>TODO: sliders for params</p>
      </div>
    </div>
  );
}
