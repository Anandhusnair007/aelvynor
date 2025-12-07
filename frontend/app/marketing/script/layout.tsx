import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing Script - From Campus to Career',
  description: 'Production-grade 2-minute promotional script for Aelvynor. Discover how we transform engineering education and agricultural technology in Kerala through projects, courses, and internships.',
  keywords: ['marketing script', 'promotional video', 'aelvynor', 'engineering education', 'kerala startup', 'ksum'],
  openGraph: {
    title: 'From Campus to Career – Innovate with Us | Aelvynor',
    description: 'Production-grade 2-minute promotional script for Aelvynor. Discover how we transform engineering education and agricultural technology in Kerala.',
    type: 'website',
    url: 'https://aelvynor.com/marketing/script',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'From Campus to Career – Innovate with Us',
    description: 'Production-grade 2-minute promotional script for Aelvynor.',
  },
};

export default function MarketingScriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

