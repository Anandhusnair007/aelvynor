'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="center" />
      <div className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Privacy <GradientText>Policy</GradientText>
          </h1>
        </div>

        <SectionCard>
          <div className="space-y-6 text-white/80">
            <p className="text-white/60">Last updated: December 2025</p>
            <h2 className="text-xl font-bold">Data Collection</h2>
            <p>We collect information you provide when using our services, including course purchases, project requests, and contact forms.</p>
            <h2 className="text-xl font-bold">Data Usage</h2>
            <p>Your data is used to provide and improve our services, process requests, and communicate with you.</p>
            <h2 className="text-xl font-bold">Data Protection</h2>
            <p>We implement security measures to protect your personal information.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

