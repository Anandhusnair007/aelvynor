'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import SectionCard from '@/components/ui/SectionCard';
import GradientText from '@/components/ui/GradientText';
import { getMission } from '@/lib/api';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Mission {
  short: string;
  long: string;
}

export default function AboutPage() {
  const [mission, setMission] = useState<Mission | null>(null);

  useEffect(() => {
    const loadMission = async () => {
      try {
        const data = await getMission();
        setMission(data);
      } catch (error) {
        console.error('Failed to load mission:', error);
      }
    };
    loadMission();
  }, []);

  return (
    <div className="min-h-screen relative pb-20 bg-black">
      {/* Render.com-style background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      <FloatingBoxes anchor="center" intensity={0.5} />

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        {/* Mission Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            Our <GradientText>Mission</GradientText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/60 text-xl max-w-2xl mx-auto"
          >
            {mission ? mission.short : "Loading..."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          <SectionCard>
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-white/80 leading-relaxed text-lg">
              Aelyvnor LLP is an innovation-driven company redefining the boundaries of agriculture, automation, and technology. We develop intelligent robotic systems and smart solutions that empower industries, enhance productivity, and create sustainable futures.
            </p>
          </SectionCard>

          <div className="grid grid-cols-2 gap-4">
            <SectionCard delay={0.1} className="flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">10+</div>
              <div className="text-white/60 text-sm">Projects Delivered</div>
            </SectionCard>
            <SectionCard delay={0.2} className="flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">500+</div>
              <div className="text-white/60 text-sm">Students Trained</div>
            </SectionCard>
            <SectionCard delay={0.3} className="flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">3</div>
              <div className="text-white/60 text-sm">Core Products</div>
            </SectionCard>
            <SectionCard delay={0.4} className="flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">KSUM</div>
              <div className="text-white/60 text-sm">Backed Startup</div>
            </SectionCard>
          </div>
        </div>

        {/* Team Section - Tessat Style */}
        <div className="mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
          >
            Our <GradientText>Team</GradientText>
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { name: 'Dhanush G', role: 'CEO & Founder', initials: 'DG', color: 'from-purple-500 to-blue-500', image: '/team/dhanush.png' },
              { name: 'Priya Menon', role: 'CTO', initials: 'PM', color: 'from-blue-500 to-cyan-500' },
              { name: 'Arun Krishnan', role: 'Head of Engineering', initials: 'AK', color: 'from-cyan-500 to-teal-500' },
              { name: 'Sneha Nair', role: 'Product Manager', initials: 'SN', color: 'from-teal-500 to-green-500' },
              { name: 'Vivek Sharma', role: 'Lead Trainer', initials: 'VS', color: 'from-green-500 to-emerald-500' }
            ].map((member, i) => (
              <SectionCard key={i} delay={i * 0.1} className="text-center">
                <div className="mb-4">
                  {member.image ? (
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/10 mb-4 shadow-lg">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg`}>
                      {member.initials}
                    </div>
                  )}
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-white/60 text-sm">{member.role}</p>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>

        {/* Marketing Script CTA Section */}
        <div className="relative py-16 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Discover Our <GradientText>Full Story</GradientText>
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Explore our production-grade promotional script covering projects, courses, internships, and more.
              </p>
            </div>

            <Link
              href="/marketing/script"
              className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
            >
              Read Full Marketing Script
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
