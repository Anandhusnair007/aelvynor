'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';

export default function ChangelogPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="right" />
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <GradientText>Changelog</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Recent updates and improvements to our platform.
          </p>
        </div>

        <SectionCard className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Version 2.0 - December 2025</h3>
              <ul className="text-white/60 space-y-2 list-disc list-inside">
                <li>Added Projects Management System (PMS)</li>
                <li>Enhanced admin panel with new features</li>
                <li>Improved file upload system</li>
                <li>Added project request tracking</li>
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

