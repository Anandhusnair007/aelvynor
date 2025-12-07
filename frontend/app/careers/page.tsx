'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="left" />
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <GradientText>Careers</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Join our team and build the future with us.
          </p>
        </div>

        <SectionCard className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
          <p className="text-white/60 mb-6">
            Start your career journey with our internship program. Top performers have the opportunity to join our full-time team.
          </p>
          <Link
            href="/internships"
            className="inline-block px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105"
          >
            Apply for Internship
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}

