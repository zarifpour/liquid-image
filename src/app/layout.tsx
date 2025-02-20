import type { Viewport } from 'next/types';
import '@/css/styles.css';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>Liquid Metal • Paper</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  themeColor: '#000',
};
