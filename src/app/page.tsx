import { Hero } from './hero/hero';

export default function Home() {
  return (
    <div className="flex items-center justify-items-center">
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Sup</h1>
        <Hero />
      </div>
    </div>
  );
}
