'use client';

import Link from 'next/link';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import { getInternships } from '@/lib/api';
import { useEffect, useState } from 'react';

interface Internship {
  id: number;
  role: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInternships();
        setInternships(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Failed to load internships:', error);
        setError(error?.message || 'Failed to load internships. Please try again later.');
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };
    loadInternships();
  }, []);

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="left" />

      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Aelyvnor <GradientText>Connect</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Aelyvnor Connect — Where technology meets meaningful collaboration.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-white/5 rounded-full text-white/80 text-sm">Collaboration requests</span>
            <span className="px-4 py-2 bg-white/5 rounded-full text-white/80 text-sm">Industry partnerships</span>
            <span className="px-4 py-2 bg-white/5 rounded-full text-white/80 text-sm">Student/Institution requests</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white/40">Loading internships...</div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : internships.length === 0 ? (
          <div className="text-center text-white/60">
            <p className="text-xl mb-4">No internships available at the moment.</p>
            <p className="text-sm">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {internships.map((job, index) => (
              <SectionCard key={job.id} delay={index * 0.1} className="flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary-500/30">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary-400 transition-colors">{job.role}</h3>
                    <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/60">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/40 mb-3">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="text-white/60 text-sm">
                    {job.description}
                  </p>
                </div>

                <Link
                  href={`/internships/apply?role=${encodeURIComponent(job.role)}`}
                  className="px-6 py-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-lg font-bold text-sm transition-all whitespace-nowrap"
                >
                  Apply Now
                </Link>
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
