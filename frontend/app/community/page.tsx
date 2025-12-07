'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="center" />
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <GradientText>Community</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Join our growing community of learners and innovators.
          </p>
        </div>

        <SectionCard className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
          <p className="text-white/60 mb-6">
            Connect with fellow students, developers, and industry professionals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/internships"
              className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105"
            >
              Join Internship Program
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

