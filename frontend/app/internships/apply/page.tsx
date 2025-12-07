'use client';

import { useSearchParams } from 'next/navigation';
import ApplyForm from '@/components/ApplyForm';
import GradientText from '@/components/ui/GradientText';
import { motion } from 'framer-motion';

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'Internship Position';

  return (
    <div className="min-h-screen relative pb-20 bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Apply for <GradientText>Internship</GradientText>
          </h1>
          <p className="text-xl text-white/60 mb-2">
            {role}
          </p>
          <p className="text-white/60">
            Fill out the form below to submit your application. We'll review your submission and get back to you soon.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ApplyForm />
        </motion.div>
      </div>
    </div>
  );
}
