import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@smatrx/ui';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'SMATRX - AI-Powered Career Transformation',
    template: '%s | SMATRX'
  },
  description: 'Transform your career with AI-powered skill mapping, real job market insights, and personalized learning paths.',
  keywords: [
    'career development',
    'skill mapping',
    'AI career coach',
    'job market analysis',
    'learning paths',
    'professional growth',
    'skill gap analysis'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smatrx.com',
    title: 'SMATRX - AI-Powered Career Transformation',
    description: 'Transform your career with data-driven insights',
    siteName: 'SMATRX'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMATRX - AI-Powered Career Transformation',
    description: 'Transform your career with data-driven insights',
    creator: '@smatrx'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
