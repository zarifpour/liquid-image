import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Turn your logo into liquid metal | Paper',
  description: 'Liquid metal for your logo by paper.design',
  openGraph: {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
