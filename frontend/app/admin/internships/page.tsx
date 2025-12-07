/**
 * Internships Management Page
 * List, create, edit, and delete internships
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { adminApi, ApiClientError } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import DataTable from '@/components/admin/DataTable';
import DeleteModal from '@/components/admin/DeleteModal';
import FormBuilder, { FormField } from '@/components/admin/FormBuilder';
import EmptyState from '@/components/admin/EmptyState';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Internship {
  id: number;
  role: string;
  department: string;
  location: string;
  type: string;
  description: string;
  created_at: string;
}

function InternshipsManagementContent() {
  const router = useRouter();
  const toast = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [deletingInternship, setDeletingInternship] = useState<Internship | null>(null);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    role: '',
    department: '',
    location: '',
    type: '',
    description: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchInternships();
  }, [router]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getInternships();
      setInternships(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load internships');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingInternship(null);
    setValues({
      role: '',
      department: '',
      location: '',
      type: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleEdit = (internship: Internship) => {
    setEditingInternship(internship);
    setValues({
      role: internship.role,
      department: internship.department,
      location: internship.location,
      type: internship.type,
      description: internship.description,
    });
    setShowModal(true);
  };

  const handleDelete = (internship: Internship) => {
    setDeletingInternship(internship);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingInternship) return;
    try {
      await adminApi.deleteInternship(deletingInternship.id);
      toast.success('Internship deleted successfully');
      fetchInternships();
      setShowDeleteModal(false);
      setDeletingInternship(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete internship');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingInternship) {
        await adminApi.updateInternship(editingInternship.id, values);
        toast.success('Internship updated successfully');
      } else {
        await adminApi.createInternship(values);
        toast.success('Internship created successfully');
      }
      fetchInternships();
      setShowModal(false);
      setEditingInternship(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save internship');
    } finally {
      setSaving(false);
    }
  };

  const fields: FormField[] = [
    { name: 'role', label: 'Role', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Remote', value: 'remote' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 6 },
  ];

  const columns = [
    { key: 'role', header: 'Role' },
    { key: 'department', header: 'Department' },
    { key: 'location', header: 'Location' },
    { key: 'type', header: 'Type' },
    {
      key: 'actions',
      header: 'Actions',
      render: (internship: Internship) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(internship)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(internship)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Internships Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Internships</h1>
          <Button variant="primary" size="sm" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New Internship
          </Button>
        </div>

        <Card padding="lg">
          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : internships.length === 0 ? (
            <EmptyState
              title="No internships yet"
              description="Get started by creating your first internship."
              actionLabel="Create Internship"
              onAction={handleCreate}
            />
          ) : (
            <DataTable data={internships} columns={columns} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingInternship ? 'Edit Internship' : 'Create Internship'}
            </h2>
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
                    setEditingInternship(null);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : editingInternship ? 'Update' : 'Create'}
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
          setDeletingInternship(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Internship"
        message="Are you sure you want to delete this internship? This action cannot be undone."
        itemName={deletingInternship?.role}
        loading={saving}
      />
    </AdminLayout>
  );
}

export default function InternshipsManagementPage() {
  return (
    <ToastProvider>
      <InternshipsManagementContent />
    </ToastProvider>
  );
}

