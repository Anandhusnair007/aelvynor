'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi, ApiClientError } from '@/lib/api';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { isAuthenticated } from '@/lib/auth';
import DataTable from '@/components/admin/DataTable';
import FormBuilder, { FormField } from '@/components/admin/FormBuilder';
import DeleteModal from '@/components/admin/DeleteModal';
import { Edit, Trash2, Upload, Eye, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import EmptyState from '@/components/admin/EmptyState';

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
  notes: string;
  created_at: string;
  updated_at: string;
}

function ProjectRequestsContent() {
  const router = useRouter();
  const toast = useToast();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ProjectRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<ProjectRequest | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [values, setValues] = useState({
    status: '',
    assigned_to: '',
    progress: 0,
    price: '',
    payment_status: 'pending',
    notes: '',
  });
  const [fileData, setFileData] = useState({
    file: null as File | null,
    file_type: 'source_code',
    description: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchRequests();
  }, [router, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProjectRequests(statusFilter || undefined);
      setRequests(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load project requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request: ProjectRequest) => {
    setEditingRequest(request);
    setValues({
      status: request.status,
      assigned_to: request.assigned_to || '',
      progress: request.progress,
      price: request.price?.toString() || '',
      payment_status: request.payment_status,
      notes: request.notes || '',
    });
    setShowModal(true);
  };

  const handleViewFiles = (request: ProjectRequest) => {
    setSelectedRequest(request);
    setShowFileModal(true);
  };

  const handleDelete = (request: ProjectRequest) => {
    setDeletingRequest(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingRequest) return;
    try {
      await adminApi.deleteProjectRequest(deletingRequest.id);
      toast.success('Request deleted successfully');
      fetchRequests();
      setShowDeleteModal(false);
      setDeletingRequest(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete request');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    try {
      setSaving(true);
      const submitData: any = {
        status: values.status,
        assigned_to: values.assigned_to || null,
        progress: parseInt(values.progress.toString()),
        price: values.price ? parseFloat(values.price) : null,
        payment_status: values.payment_status,
        notes: values.notes,
      };

      await adminApi.updateProjectRequest(editingRequest.id, submitData);
      toast.success('Request updated successfully');
      fetchRequests();
      setShowModal(false);
      setEditingRequest(null);
    } catch (err: any) {
      const errorMsg = err?.detail || err?.message || 'Failed to update request';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !fileData.file) return;

    try {
      setUploading(true);
      await adminApi.uploadProjectFile(
        selectedRequest.id,
        fileData.file,
        fileData.file_type,
        fileData.description || undefined
      );
      toast.success('File uploaded successfully');
      setFileData({ file: null, file_type: 'source_code', description: '' });
      setShowFileModal(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
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

  const fields: FormField[] = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'assigned_to', label: 'Assigned To', type: 'text', placeholder: 'Developer name' },
    { name: 'progress', label: 'Progress (%)', type: 'number', required: true },
    { name: 'price', label: 'Price', type: 'number' },
    {
      name: 'payment_status',
      label: 'Payment Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    { name: 'notes', label: 'Notes', type: 'textarea', rows: 4 },
  ];

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'college_company', header: 'College/Company' },
    {
      key: 'status',
      header: 'Status',
      render: (request: ProjectRequest) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(request.status)}`}>
          {request.status.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (request: ProjectRequest) => (
        <span>{request.progress}%</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (request: ProjectRequest) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(request)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewFiles(request)}
            className="text-green-600 hover:text-green-800"
            title="View/Upload Files"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(request)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Project Requests">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Project Requests</h1>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <Card padding="lg">
          {loading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : requests.length === 0 ? (
            <EmptyState
              title="No requests yet"
              description="Project requests from users will appear here."
            />
          ) : (
            <DataTable data={requests} columns={columns} />
          )}
        </Card>
      </div>

      {/* Edit Modal */}
      {showModal && editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Edit Request #{editingRequest.id}</h2>
            <div className="mb-4 p-4 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm mb-1">Request Details</p>
              <p className="text-white font-medium">{editingRequest.custom_description}</p>
              <p className="text-white/60 text-sm mt-2">
                From: {editingRequest.name} ({editingRequest.email})
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <FormBuilder
                fields={fields}
                values={values}
                onChange={(name, value) => setValues({ ...values, [name]: value })}
              />
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRequest(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Manage Files - Request #{selectedRequest.id}</h2>
              <button
                onClick={() => {
                  setShowFileModal(false);
                  setSelectedRequest(null);
                  setFileData({ file: null, file_type: 'source_code', description: '' });
                }}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  File Type
                </label>
                <select
                  value={fileData.file_type}
                  onChange={(e) => setFileData({ ...fileData, file_type: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                >
                  <option value="source_code">Source Code</option>
                  <option value="documentation">Documentation</option>
                  <option value="report">Report</option>
                  <option value="demo">Demo</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFileData({ ...fileData, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={fileData.description}
                  onChange={(e) => setFileData({ ...fileData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowFileModal(false);
                    setSelectedRequest(null);
                    setFileData({ file: null, file_type: 'source_code', description: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={uploading || !fileData.file}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingRequest(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Request"
        message="Are you sure you want to delete this request? This action cannot be undone."
        itemName={deletingRequest ? `Request #${deletingRequest.id}` : undefined}
        loading={saving}
      />
    </AdminLayout>
  );
}

export default function ProjectRequestsPage() {
  return (
    <ToastProvider>
      <ProjectRequestsContent />
    </ToastProvider>
  );
}
