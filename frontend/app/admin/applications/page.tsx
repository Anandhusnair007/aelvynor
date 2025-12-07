/**
 * Applications Viewer Page
 * List and view internship applications
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { adminApi, ApiClientError } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import DataTable from '@/components/admin/DataTable';
import EmptyState from '@/components/admin/EmptyState';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Eye, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  applied_for: string;
  resume_path: string;
  status?: string;
  created_at: string;
}

function ApplicationsViewerContent() {
  const router = useRouter();
  const toast = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getApplications();
      setApplications(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      setUpdating(true);
      await adminApi.updateApplication(id, { status });
      toast.success('Status updated successfully');
      fetchApplications();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleResumeDownload = (resumePath: string) => {
    const url = resumePath.startsWith('http') ? resumePath : `${API_URL}${resumePath}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status?: string) => {
    const statusColors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      reviewing: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      accepted: 'bg-green-500/20 text-green-400 border-green-500/50',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    const color = statusColors[status as keyof typeof statusColors] || statusColors.pending;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${color}`}>
        {status || 'pending'}
      </span>
    );
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'applied_for', header: 'Applied For' },
    {
      key: 'status',
      header: 'Status',
      render: (app: Application) => getStatusBadge(app.status),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (app: Application) => new Date(app.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (app: Application) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedApplication(app)}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleResumeDownload(app.resume_path)}
            className="text-green-600 hover:text-green-800"
            title="Download Resume"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Applications">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Internship Applications</h1>

        <Card padding="lg">
          {loading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Applications will appear here when candidates apply."
            />
          ) : (
            <DataTable data={applications} columns={columns} />
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white">Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-white">
              <div>
                <label className="text-sm text-white/60">Name</label>
                <p className="font-medium">{selectedApplication.name}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Email</label>
                <p className="font-medium">{selectedApplication.email}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Phone</label>
                <p className="font-medium">{selectedApplication.phone}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Applied For</label>
                <p className="font-medium">{selectedApplication.applied_for}</p>
              </div>
              <div>
                <label className="text-sm text-white/60">Status</label>
                <div className="mt-2">{getStatusBadge(selectedApplication.status)}</div>
              </div>
              <div>
                <label className="text-sm text-white/60">Applied On</label>
                <p className="font-medium">
                  {new Date(selectedApplication.created_at).toLocaleString()}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="text-sm text-white/60 mb-2 block">Update Status</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication.id, 'pending')}
                    disabled={updating || selectedApplication.status === 'pending'}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication.id, 'reviewing')}
                    disabled={updating || selectedApplication.status === 'reviewing'}
                  >
                    Reviewing
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication.id, 'accepted')}
                    disabled={updating || selectedApplication.status === 'accepted'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                    disabled={updating || selectedApplication.status === 'rejected'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleResumeDownload(selectedApplication.resume_path)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function ApplicationsViewerPage() {
  return (
    <ToastProvider>
      <ApplicationsViewerContent />
    </ToastProvider>
  );
}

