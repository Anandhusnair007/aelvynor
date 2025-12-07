/**
 * Projects Management Page
 * List, create, edit, and delete projects
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
import LoadingSkeleton, { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  full_description: string;
  tags: string[];
  features: string[];
  image?: string;
  created_at: string;
}

function ProjectsManagementContent() {
  const router = useRouter();
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    title: '',
    slug: '',
    description: '',
    full_description: '',
    tags: [] as string[],
    features: [] as string[],
    image: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProjects();
      setProjects(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setValues({
      title: '',
      slug: '',
      description: '',
      full_description: '',
      tags: [],
      features: [],
      image: '',
    });
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    // Parse tags and features if they're JSON strings
    let tags = [];
    let features = [];
    try {
      tags = Array.isArray(project.tags) ? project.tags : (typeof project.tags === 'string' ? JSON.parse(project.tags) : []);
      features = Array.isArray(project.features) ? project.features : (typeof project.features === 'string' ? JSON.parse(project.features) : []);
    } catch {
      tags = [];
      features = [];
    }
    setValues({
      title: project.title,
      slug: project.slug,
      description: project.description,
      full_description: project.full_description,
      tags,
      features,
      image: project.image || '',
    });
    setShowModal(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await adminApi.deleteProject(deletingProject.id);
      toast.success('Project deleted successfully');
      fetchProjects();
      setShowDeleteModal(false);
      setDeletingProject(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Ensure tags and features are arrays
      const submitData = {
        ...values,
        tags: Array.isArray(values.tags) ? values.tags : (typeof values.tags === 'string' ? JSON.parse(values.tags) : []),
        features: Array.isArray(values.features) ? values.features : (typeof values.features === 'string' ? JSON.parse(values.features) : []),
      };
      if (editingProject) {
        await adminApi.updateProject(editingProject.id, submitData);
        toast.success('Project updated successfully');
      } else {
        await adminApi.createProject(submitData);
        toast.success('Project created successfully');
      }
      fetchProjects();
      setShowModal(false);
      setEditingProject(null);
    } catch (err: any) {
      const errorMsg = err?.detail || err?.message || 'Failed to save project';
      toast.error(errorMsg);
      console.error('Project save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const fields: FormField[] = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true, helpText: 'URL-friendly identifier' },
    { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
    { name: 'full_description', label: 'Full Description', type: 'textarea', required: true, rows: 6 },
    { name: 'tags', label: 'Tags', type: 'json', helpText: 'JSON array: ["tag1", "tag2"]' },
    { name: 'features', label: 'Features', type: 'json', helpText: 'JSON array: ["feature1", "feature2"]' },
    { name: 'image', label: 'Image URL', type: 'text' },
  ];

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug' },
    {
      key: 'actions',
      header: 'Actions',
      render: (project: Project) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(project)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(project)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Projects Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <Button variant="primary" size="sm" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <Card padding="lg">
          {loading ? (
            <TableSkeleton rows={5} columns={3} />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Get started by creating your first project."
              actionLabel="Create Project"
              onAction={handleCreate}
            />
          ) : (
            <DataTable data={projects} columns={columns} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProject ? 'Edit Project' : 'Create Project'}
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
                    setEditingProject(null);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : editingProject ? 'Update' : 'Create'}
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
          setDeletingProject(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        itemName={deletingProject?.title}
        loading={saving}
      />
    </AdminLayout>
  );
}

export default function ProjectsManagementPage() {
  return (
    <ToastProvider>
      <ProjectsManagementContent />
    </ToastProvider>
  );
}

