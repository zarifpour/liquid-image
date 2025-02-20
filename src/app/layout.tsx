import type { Metadata, Viewport } from 'next/types';
import './styles.css';

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

export const metadata: Metadata = {
  title: 'Turn your logo into liquid metal | Paper',
  description: 'Liquid metal for your logo by paper.design',
  icons: {
    icon: process.env.NODE_ENV === 'production' ? '/favicon.ico' : '/favicon-dev.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    url: 'https://liquid.paper.design',
    type: 'website',
    locale: 'en_US',
    siteName: 'Liquid logo by Paper',
    title: 'Turn your logo into liquid metal | Paper',
    description: 'Liquid metal for your logo by paper.design',
    images: [
      {
        url: 'https://liquid.paper.design/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Turn your logo into liquid metal | Paper',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turn your logo into liquid metal | Paper',
    description: 'Liquid metal for your logo by paper.design',
    creator: '@paper',
    images: ['https://liquid.paper.design/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  themeColor: '#000',
};
