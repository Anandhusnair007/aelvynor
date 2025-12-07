'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="left" />
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <GradientText>Documentation</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Learn how to use our platform and APIs.
          </p>
        </div>

        <SectionCard className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          <div className="space-y-4 text-white/60">
            <p>
              For complete API documentation, visit our <Link href="http://localhost:8000/docs" target="_blank" className="text-primary-400 hover:underline">API Reference</Link>.
            </p>
            <p>
              Browse <Link href="/project-templates" className="text-primary-400 hover:underline">Project Templates</Link> to see available projects and pricing.
            </p>
            <p>
              Check out our <Link href="/courses" className="text-primary-400 hover:underline">Courses</Link> for learning opportunities.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

