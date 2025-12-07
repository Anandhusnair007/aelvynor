'use client';

import Hero from '@/components/ui/Hero';
import SectionCard from '@/components/ui/SectionCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Features Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SectionCard delay={0.1} className="hover:border-primary-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary-500/20 flex items-center justify-center mb-6 text-2xl">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation First</h3>
              <p className="text-white/60 leading-relaxed">
                We build cutting-edge solutions that solve real-world problems, from agriculture to education.
              </p>
            </SectionCard>

            <SectionCard delay={0.2} className="hover:border-render-purple/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-render-purple/20 flex items-center justify-center mb-6 text-2xl">
                🎓
              </div>
              <h3 className="text-xl font-bold mb-3">Student Focused</h3>
              <p className="text-white/60 leading-relaxed">
                Our internship and training programs are designed to bridge the gap between academia and industry.
              </p>
            </SectionCard>

            <SectionCard delay={0.3} className="hover:border-render-blue/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-render-blue/20 flex items-center justify-center mb-6 text-2xl">
                🌱
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainable Growth</h3>
              <p className="text-white/60 leading-relaxed">
                Empowering local communities and farmers with technology that is accessible and effective.
              </p>
            </SectionCard>
          </div>
        </div>
      </section>

      {/* Marketing Script Section */}
      <section className="py-24 px-6 relative border-t border-white/5 bg-black/50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Script content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  From Campus to <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">Career</span>
                </h2>
                <p className="text-xl text-white/60 mb-2">Innovate with Us</p>
                <p className="text-sm font-mono text-white/40 uppercase tracking-widest">
                  Production-Grade 2-Minute Promotional Script
                </p>
              </div>

              <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                <p>
                  Innovation is not a word we use lightly — it's the foundation of everything we build.
                </p>
                <p>
                  Welcome to Aelvynor, a proud beneficiary of the Kerala Startup Mission (KSUM) Seed Fund.
                </p>
                <p>
                  From developing breakthrough agricultural technologies like our Automated Rubber Tapping System, to training the next generation of engineers, we are shaping the future — right here in Kerala.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="text-sm font-bold mb-1">10-Tier Projects</div>
                  <div className="text-xs text-white/60">Custom-built solutions</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-sm font-bold mb-1">KSUM Backed</div>
                  <div className="text-xs text-white/60">Seed Fund supported</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="text-sm font-bold mb-1">Free Internships</div>
                  <div className="text-xs text-white/60">Talent without price tag</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm font-bold mb-1">Industry Courses</div>
                  <div className="text-xs text-white/60">Real-world skills</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/marketing/script"
                  className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105 active:scale-95 text-center"
                >
                  Read Full Script
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-transform hover:scale-105 active:scale-95 text-center"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right side: Visual/Video placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/50 group cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Link href="/marketing/script" className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </Link>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              <div className="absolute bottom-8 left-8 z-20 text-left">
                <div className="text-sm font-bold text-primary-400 mb-1">WATCH THE STORY</div>
                <div className="text-2xl font-bold">Innovate with Us</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deployment Demo Section (Visual Filler) */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent" />
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Built for Scale</h2>
          <div className="relative mx-auto max-w-4xl aspect-[16/9] rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="p-8 pt-16 text-left font-mono text-sm text-white/60">
              <div className="mb-2">$ aelvynor deploy --prod</div>
              <div className="text-green-400 mb-2">✓ Building frontend... Done (1.2s)</div>
              <div className="text-green-400 mb-2">✓ Building backend... Done (0.8s)</div>
              <div className="text-green-400 mb-2">✓ Optimizing assets... Done</div>
              <div className="text-white mb-2">→ Deploying to edge network...</div>
              <div className="animate-pulse text-primary-400">...</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
