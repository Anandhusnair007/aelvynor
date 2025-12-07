'use client';

import FloatingBoxes from '@/components/backgrounds/FloatingBoxes';
import GradientText from '@/components/ui/GradientText';
import SectionCard from '@/components/ui/SectionCard';
import { getUserProjectRequests, getProjectRequestFiles } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProjectRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  college_company: string;
  project_template_id: number | null;
  custom_category: string | null;
  custom_description: string;
  deadline: string | null;
  status: string;
  assigned_to: string | null;
  progress: number;
  price: number | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export default function MyProjectsPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (email) {
      loadRequests();
    }
  }, [email]);

  const loadRequests = async () => {
    if (!email) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProjectRequests(email);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to load requests:', error);
      setError(error?.message || 'Failed to load your projects.');
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (requestId: number) => {
    try {
      setLoadingFiles(true);
      const data = await getProjectRequestFiles(requestId);
      setFiles(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to load files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      approved: 'bg-blue-500/20 text-blue-300',
      in_progress: 'bg-primary-500/20 text-primary-300',
      completed: 'bg-green-500/20 text-green-300',
      delivered: 'bg-green-600/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-300',
    };
    return colors[status] || 'bg-white/10 text-white/60';
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingBoxes anchor="right" />

      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            My <GradientText>Projects</GradientText>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Track the status of your project requests and download completed files.
          </p>
        </div>

        {/* Email Input */}
        {!email && (
          <SectionCard className="max-w-2xl mx-auto mb-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80">
                Enter Your Email
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
                />
                <button
                  onClick={loadRequests}
                  className="px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-colors"
                >
                  Load Projects
                </button>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-white/40">Loading your projects...</div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p className="mb-4">{error}</p>
            <button
              onClick={() => {
                setEmail('');
                setRequests([]);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center text-white/60">
            <p className="text-xl mb-4">No projects found.</p>
            <p className="text-sm mb-6">Submit a project request to get started.</p>
            <Link
              href="/project-templates/request"
              className="inline-block px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-colors"
            >
              Request a Project
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SectionCard>
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                            {getStatusLabel(request.status)}
                          </span>
                          {request.price !== null && (
                            <span className="text-white/60 text-sm">
                              Price: ₹{request.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">Project Request #{request.id}</h3>
                        <p className="text-white/60 text-sm mb-1">
                          {request.custom_category || 'Custom Project'}
                        </p>
                        <p className="text-white/80">{request.custom_description}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (selectedRequest?.id === request.id) {
                            setSelectedRequest(null);
                            setFiles([]);
                          } else {
                            setSelectedRequest(request);
                            loadFiles(request.id);
                          }
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        {selectedRequest?.id === request.id ? 'Hide' : 'View'} Details
                      </button>
                    </div>

                    {/* Progress Bar */}
                    {request.status === 'in_progress' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/60">Progress</span>
                          <span className="text-sm font-bold text-primary-300">{request.progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-primary-500 transition-all duration-300"
                            style={{ width: `${request.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Details Panel */}
                    {selectedRequest?.id === request.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-6 border-t border-white/10 space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/40">College/Company:</span>
                            <p className="text-white/80 font-medium">{request.college_company}</p>
                          </div>
                          <div>
                            <span className="text-white/40">Assigned To:</span>
                            <p className="text-white/80 font-medium">
                              {request.assigned_to || 'Not assigned yet'}
                            </p>
                          </div>
                          {request.deadline && (
                            <div>
                              <span className="text-white/40">Deadline:</span>
                              <p className="text-white/80 font-medium">
                                {new Date(request.deadline).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-white/40">Payment Status:</span>
                            <p className="text-white/80 font-medium capitalize">
                              {request.payment_status}
                            </p>
                          </div>
                        </div>

                        {/* Files Section */}
                        <div>
                          <h4 className="text-lg font-bold mb-3">Project Files</h4>
                          {loadingFiles ? (
                            <p className="text-white/40 text-sm">Loading files...</p>
                          ) : files.length === 0 ? (
                            <p className="text-white/40 text-sm">No files uploaded yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {files.map((file) => (
                                <a
                                  key={file.id}
                                  href={file.file_url.startsWith('/') 
                                    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${file.file_url}`
                                    : file.file_url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex-1">
                                    <p className="text-white/80 font-medium">{file.file_type}</p>
                                    {file.description && (
                                      <p className="text-white/40 text-xs">{file.description}</p>
                                    )}
                                  </div>
                                  <span className="text-primary-400 text-sm">Download</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </SectionCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

