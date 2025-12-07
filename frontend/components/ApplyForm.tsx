'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

export default function ApplyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    applied_for: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResume(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('applied_for', formData.applied_for);
      if (resume) {
        formDataToSend.append('resume', resume);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/apply`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();
      setSuccess(`Application submitted successfully! ID: ${data.id}`);
      setFormData({ name: '', email: '', phone: '', message: '', applied_for: '' });
      setResume(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder:text-white/40"
              required
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder:text-white/40"
              required
              placeholder="your.email@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder:text-white/40"
              required
              placeholder="+91 1234567890"
            />
          </div>

          {/* Applied For */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Applying For *
            </label>
            <input
              type="text"
              name="applied_for"
              value={formData.applied_for}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder:text-white/40"
              required
              placeholder="e.g., Hardware Engineering Intern"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Cover Letter / Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white placeholder:text-white/40 resize-none"
              placeholder="Tell us why you're interested..."
            />
          </div>

          {/* Resume */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Resume/CV (Optional - PDF, DOC, DOCX - Max 5MB)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary-500/20 file:text-primary-300 file:font-medium hover:file:bg-primary-500/30 file:cursor-pointer"
            />
            {resume && (
              <p className="mt-2 text-sm text-white/60">
                Selected: {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
