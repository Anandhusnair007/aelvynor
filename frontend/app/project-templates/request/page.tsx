'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import { submitProjectRequest, getProjectTemplate, getProjectCategories } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ProjectRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college_company: '',
    custom_description: '',
    custom_category: '',
    deadline: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Load categories
      try {
        const catsData = await getProjectCategories();
        setCategories(catsData.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }

      // Load template if templateId provided
      if (templateId) {
        try {
          const templateData = await getProjectTemplate(parseInt(templateId));
          setTemplate(templateData);
          setFormData(prev => ({
            ...prev,
            custom_category: templateData.category || '',
            custom_description: `I would like to request the "${templateData.title}" project.`,
          }));
        } catch (err) {
          console.error('Failed to load template:', err);
        }
      }
    };
    loadData();
  }, [templateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('college_company', formData.college_company);
      formDataToSend.append('custom_description', formData.custom_description);
      
      if (templateId) {
        formDataToSend.append('project_template_id', templateId);
      }
      
      if (formData.custom_category) {
        formDataToSend.append('custom_category', formData.custom_category);
      }
      
      if (formData.deadline) {
        formDataToSend.append('deadline', formData.deadline);
      }

      // Append documents
      documents.forEach((doc) => {
        formDataToSend.append('documents', doc);
      });

      const result = await submitProjectRequest(formDataToSend);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/my-projects?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(files);
  };

  if (success) {
    return (
      <div className="min-h-screen relative pb-20 flex items-center justify-center">
        <FloatingBoxes anchor="center" />
        <SectionCard className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Request Submitted Successfully!</h2>
            <p className="text-white/60">
              Your project request has been received. We'll review it and get back to you soon.
            </p>
            <p className="text-white/40 text-sm">Redirecting to your projects...</p>
          </motion.div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="left" />

      <div className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Request a <GradientText>Project</GradientText>
          </h1>
          <p className="text-white/60 text-lg">
            Fill out the form below to submit your project request.
          </p>
        </div>

        <SectionCard>
          {template && (
            <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <p className="text-sm text-white/60 mb-1">Requesting:</p>
              <p className="font-bold text-primary-300">{template.title}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  College/Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.college_company}
                  onChange={(e) => setFormData({ ...formData, college_company: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
                  placeholder="Your college or company name"
                />
              </div>
            </div>

            {!templateId && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Project Category
                </label>
                <select
                  value={formData.custom_category}
                  onChange={(e) => setFormData({ ...formData, custom_category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-black">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Project Description *
              </label>
              <textarea
                required
                rows={6}
                value={formData.custom_description}
                onChange={(e) => setFormData({ ...formData, custom_description: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white resize-none"
                placeholder="Describe your project requirements in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Deadline (Optional)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Upload Documents (Optional)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.zip,.rar"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary-500/20 file:text-primary-300 file:font-medium hover:file:bg-primary-500/30 file:cursor-pointer"
              />
              {documents.length > 0 && (
                <div className="mt-2 space-y-1">
                  {documents.map((doc, index) => (
                    <p key={index} className="text-sm text-white/60">
                      • {doc.name} ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-white/90 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

