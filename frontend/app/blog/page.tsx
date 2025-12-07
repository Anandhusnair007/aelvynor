'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';

export default function BlogPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="right" />
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <GradientText>Blog</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Stay updated with the latest news and insights.
          </p>
        </div>

        <SectionCard className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-white/60">
            Our blog is coming soon. Check back for updates on technology, education, and industry insights.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

