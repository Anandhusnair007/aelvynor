'use client';

import Link from 'next/link';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import { getCourses } from '@/lib/api';
import { useEffect, useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  students_count: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Failed to load courses:', error);
        setError(error?.message || 'Failed to load courses. Please try again later.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="center" />

      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Aelyvnor <GradientText>Academy</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Aelyvnor Academy — Where learning meets innovation.
          </p>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mt-3">
            Inspiring learners through technology, creativity, and innovation.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white/40">Loading courses...</div>
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
        ) : courses.length === 0 ? (
          <div className="text-center text-white/60">
            <p className="text-xl mb-4">No courses available at the moment.</p>
            <p className="text-sm">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <SectionCard key={course.id} delay={index * 0.1} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-primary-300">
                    {course.level}
                  </span>
                  <span className="text-white/40 text-sm">{course.duration}</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-400 transition-colors">
                  {course.title}
                </h3>

                <p className="text-white/60 mb-6">
                  {course.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-black" />
                      ))}
                    </div>
                    <span className="text-sm text-white/40">+{course.students_count} students</span>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-sm font font-bold text-white hover:text-primary-400 transition-colors"
                  >
                    View Course →
                  </Link>
                </div>
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
