import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Our Mission',
  description: 'Aelvynor is a Kerala Startup Mission Seed Fund supported company developing automation technologies for rubber tapping farmers in Kerala. We empower plantation workers through engineering, skill development, and next-generation machinery.',
  keywords: ['aelvynor', 'about', 'mission', 'ksum', 'kerala startup', 'rubber tapping', 'automation', 'engineering'],
  openGraph: {
    title: 'About Aelvynor - Our Mission',
    description: 'Aelvynor modernizes rubber tapping with engineering, training, and market-ready machines. KSUM-backed startup transforming agricultural technology in Kerala.',
    type: 'website',
    url: 'https://aelvynor.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Aelvynor - Our Mission',
    description: 'Aelvynor modernizes rubber tapping with engineering, training, and market-ready machines.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

