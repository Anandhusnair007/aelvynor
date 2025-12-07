'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import { getProjectTemplates, getProjectCategories } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProjectTemplate {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  price: number | null;
  time_duration: string;
  demo_images: string[];
}

export default function ProjectTemplatesPage() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load categories
        const catsData = await getProjectCategories();
        setCategories(catsData.categories || []);
        
        // Load templates with category filter
        const templatesData = await getProjectTemplates(selectedCategory || undefined);
        setTemplates(Array.isArray(templatesData) ? templatesData : []);
      } catch (error: any) {
        console.error('Failed to load data:', error);
        setError(error?.message || 'Failed to load project templates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory]);

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="right" />

      <div className="max-w-7xl mx-auto px-6 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Project <GradientText>Templates</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-6">
            Browse our collection of project templates and request the one that fits your needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/project-templates/request"
              className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
            >
              Request Custom Project
            </Link>
            <Link
              href="/my-projects"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-transform hover:scale-105 active:scale-95"
            >
              View My Projects
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === null
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-white/40">Loading project templates...</div>
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
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center text-white/60">
            <p className="text-xl mb-4">No project templates found.</p>
            <p className="text-sm">Try selecting a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/project-templates/${template.id}`}>
                  <SectionCard delay={0} className="h-full hover:border-primary-500/50 transition-all cursor-pointer group">
                    <div className="flex flex-col h-full">
                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-bold">
                          {template.category}
                        </span>
                        {template.price !== null ? (
                          <span className="text-white/80 font-bold">
                            ₹{template.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-white/60 text-sm">Negotiable</span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary-400 transition-colors">
                        {template.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/60 text-sm mb-4 flex-grow line-clamp-3">
                        {template.description}
                      </p>

                      {/* Tech Stack */}
                      {template.tech_stack && template.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tech_stack.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white/5 rounded text-xs text-white/60"
                            >
                              {tech}
                            </span>
                          ))}
                          {template.tech_stack.length > 3 && (
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                              +{template.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Duration */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-white/40 text-sm">⏱ {template.time_duration}</span>
                        <span className="text-primary-400 text-sm font-medium group-hover:text-primary-300">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </SectionCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

