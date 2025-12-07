/**
 * Root Layout
 * App Router root layout with metadata and global styles
 */

import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import ConditionalLayout from './ConditionalLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: {
    default: 'Aelvynor - Build the Impossible',
    template: '%s | Aelvynor',
  },
  description: 'Aelvynor is a Kerala Startup Mission Seed Fund supported company developing automation technologies for rubber tapping farmers in Kerala. We provide courses, live projects, internships, and career pathways for engineering students.',
  keywords: ['aelvynor', 'projects', 'courses', 'internships', 'products', 'education', 'technology', 'ksum', 'kerala startup', 'rubber tapping', 'engineering', 'ai', 'iot'],
  authors: [{ name: 'Aelvynor Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aelvynor.com',
    siteName: 'Aelvynor',
    title: 'Aelvynor - Engineered for the Future. Designed for Innovators.',
    description: 'Aelvynor is a Kerala Startup Mission Seed Fund supported company developing automation technologies for rubber tapping farmers in Kerala. We provide courses, live projects, internships, and career pathways for engineering students.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aelvynor - Engineered for the Future',
    description: 'Aelvynor is a Kerala Startup Mission Seed Fund supported company developing automation technologies for rubber tapping farmers in Kerala.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground antialiased font-sans">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
