'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';

export default function TermsPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="right" />
      <div className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Terms of <GradientText>Service</GradientText>
          </h1>
        </div>

        <SectionCard>
          <div className="space-y-6 text-white/80">
            <p className="text-white/60">Last updated: December 2025</p>
            <h2 className="text-xl font-bold">Service Agreement</h2>
            <p>By using our services, you agree to these terms and conditions.</p>
            <h2 className="text-xl font-bold">User Responsibilities</h2>
            <p>Users are responsible for providing accurate information and maintaining account security.</p>
            <h2 className="text-xl font-bold">Payment Terms</h2>
            <p>Payment terms are specified for each course or project. Refund policies apply as stated.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

