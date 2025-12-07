'use client';

import Link from 'next/link';
import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';

export default function PricingPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="center" />
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <GradientText>Pricing</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Flexible pricing options for courses and projects.
          </p>
        </div>

        <SectionCard className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Project Pricing</h2>
          <p className="text-white/60 mb-6">
            Our project pricing varies by complexity and requirements. Browse our <Link href="/project-templates" className="text-primary-400 hover:underline">Project Templates</Link> to see individual pricing, or request a custom quote.
          </p>
          <p className="text-white/60">
            Many projects offer negotiable pricing based on your specific needs.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

