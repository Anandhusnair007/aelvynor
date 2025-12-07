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
import { Plus, Edit, Trash2, X, Image as ImageIcon, Video, FileArchive } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import EmptyState from '@/components/admin/EmptyState';
import FileUpload from '@/components/admin/FileUpload';

interface ProjectTemplate {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string[] | string;
  price: number | null;
  time_duration: string;
  requirements: string;
  demo_images: string[] | string;
  demo_video: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function ProjectTemplatesContent() {
  const router = useRouter();
  const toast = useToast();
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProjectTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<ProjectTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    title: '',
    category: '',
    description: '',
    tech_stack: [] as string[],
    price: '',
    time_duration: '',
    requirements: '',
    demo_images: [] as string[],
    demo_video: '',
    source_code_url: '',
    is_active: true,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchTemplates();
  }, [router]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProjectTemplates();
      setTemplates(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load project templates');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setValues({
      title: '',
      category: '',
      description: '',
      tech_stack: [],
      price: '',
      time_duration: '',
      requirements: '',
      demo_images: [],
      demo_video: '',
      source_code_url: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const handleEdit = (template: ProjectTemplate) => {
    setEditingTemplate(template);
    let techStack = [];
    let demoImages = [];
    
    try {
      techStack = Array.isArray(template.tech_stack) 
        ? template.tech_stack 
        : (typeof template.tech_stack === 'string' ? JSON.parse(template.tech_stack) : []);
      demoImages = Array.isArray(template.demo_images)
        ? template.demo_images
        : (typeof template.demo_images === 'string' ? JSON.parse(template.demo_images) : []);
    } catch {
      techStack = [];
      demoImages = [];
    }
    
    setValues({
      title: template.title,
      category: template.category,
      description: template.description,
      tech_stack: techStack,
      price: template.price?.toString() || '',
      time_duration: template.time_duration,
      requirements: template.requirements || '',
      demo_images: demoImages,
      demo_video: template.demo_video || '',
      source_code_url: '',
      is_active: template.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = (template: ProjectTemplate) => {
    setDeletingTemplate(template);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingTemplate) return;
    try {
      await adminApi.deleteProjectTemplate(deletingTemplate.id);
      toast.success('Project template deleted successfully');
      fetchTemplates();
      setShowDeleteModal(false);
      setDeletingTemplate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!editingTemplate) {
      throw new Error('Please save the template first before uploading images');
    }
    try {
      const result = await adminApi.uploadTemplateImage(editingTemplate.id, file);
      const newImages = [...(values.demo_images || []), result.url];
      setValues({ ...values, demo_images: newImages });
      return result.url;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Image upload failed');
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!editingTemplate) {
      throw new Error('Please save the template first before uploading video');
    }
    try {
      const result = await adminApi.uploadTemplateVideo(editingTemplate.id, file);
      setValues({ ...values, demo_video: result.url });
      return result.url;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Video upload failed');
    }
  };

  const handleSourceUpload = async (file: File) => {
    if (!editingTemplate) {
      throw new Error('Please save the template first before uploading source code');
    }
    try {
      const result = await adminApi.uploadTemplateSource(editingTemplate.id, file);
      setValues({ ...values, source_code_url: result.url });
      return result.url;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Source code upload failed');
    }
  };

  const removeImage = (index: number) => {
    const newImages = values.demo_images.filter((_, i) => i !== index);
    setValues({ ...values, demo_images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const submitData: any = {
        ...values,
        tech_stack: Array.isArray(values.tech_stack) ? values.tech_stack : [],
        demo_images: Array.isArray(values.demo_images) ? values.demo_images : [],
        price: values.price ? parseFloat(values.price) : null,
        demo_video: values.demo_video || null,
        requirements: values.requirements || '',
        is_active: values.is_active,
      };

      if (editingTemplate) {
        await adminApi.updateProjectTemplate(editingTemplate.id, submitData);
        toast.success('Template updated successfully');
      } else {
        const newTemplate = await adminApi.createProjectTemplate(submitData);
        toast.success('Template created successfully');
        // Set as editing template so user can now upload files
        setEditingTemplate({ ...newTemplate, id: newTemplate.id });
      }
      fetchTemplates();
      if (!editingTemplate) {
        // Don't close modal if it's a new template (allow file uploads)
        toast.info('Template created! You can now upload images, video, and source code.');
      } else {
        setShowModal(false);
        setEditingTemplate(null);
      }
    } catch (err: any) {
      const errorMsg = err?.detail || err?.message || 'Failed to save template';
      toast.error(errorMsg);
      console.error('Template save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const fields: FormField[] = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { label: 'BCA / MCA', value: 'BCA / MCA' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'School', value: 'School' },
        { label: 'Company', value: 'Company' },
        { label: 'IoT', value: 'IoT' },
        { label: 'AI/ML', value: 'AI/ML' },
        { label: 'Robotics', value: 'Robotics' },
        { label: 'Web/Mobile', value: 'Web/Mobile' },
        { label: 'Custom', value: 'Custom' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 4 },
    { name: 'tech_stack', label: 'Tech Stack (JSON array)', type: 'json', helpText: 'JSON array: ["React", "Node.js"]' },
    { name: 'price', label: 'Price (leave empty for negotiable)', type: 'number' },
    { name: 'time_duration', label: 'Time Duration', type: 'text', required: true, placeholder: 'e.g., 2 weeks' },
    { name: 'requirements', label: 'Requirements', type: 'textarea', rows: 4 },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    { key: 'time_duration', header: 'Duration' },
    {
      key: 'price',
      header: 'Price',
      render: (template: ProjectTemplate) => (
        template.price !== null ? `₹${template.price.toLocaleString()}` : 'Negotiable'
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (template: ProjectTemplate) => (
        <span className={template.is_active ? 'text-green-400' : 'text-red-400'}>
          {template.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (template: ProjectTemplate) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(template)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(template)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Project Templates">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Project Templates</h1>
          <Button variant="primary" size="sm" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>

        <Card padding="lg">
          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : templates.length === 0 ? (
            <EmptyState
              title="No templates yet"
              description="Get started by creating your first project template."
              actionLabel="Create Template"
              onAction={handleCreate}
            />
          ) : (
            <DataTable data={templates} columns={columns} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-3xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </h2>
            <form onSubmit={handleSubmit}>
              <FormBuilder
                fields={fields}
                values={values}
                onChange={(name, value) => setValues({ ...values, [name]: value })}
              />

              {/* File Upload Section - Only show for existing templates */}
              {editingTemplate && (
                <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Media & Files</h3>
                  
                  {/* Demo Images Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white/90">
                      <ImageIcon className="w-4 h-4 inline mr-2" />
                      Demo Images
                    </label>
                    <FileUpload
                      label="Upload Demo Image"
                      accept="image/*"
                      maxSize={10}
                      onChange={(url) => {
                        if (url) {
                          const newImages = [...(values.demo_images || []), url];
                          setValues({ ...values, demo_images: newImages });
                        }
                      }}
                      onUpload={handleImageUpload}
                      onError={(msg) => toast.error(msg)}
                      preview={true}
                    />
                    
                    {/* Display uploaded images */}
                    {values.demo_images && values.demo_images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {values.demo_images.map((imgUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imgUrl}
                              alt={`Demo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-white/10"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Demo Video Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white/90">
                      <Video className="w-4 h-4 inline mr-2" />
                      Demo Video
                    </label>
                    <FileUpload
                      label="Upload Demo Video"
                      accept="video/*"
                      maxSize={100}
                      value={values.demo_video}
                      onChange={(url) => setValues({ ...values, demo_video: url })}
                      onUpload={handleVideoUpload}
                      onError={(msg) => toast.error(msg)}
                      preview={false}
                    />
                    {values.demo_video && (
                      <div className="mt-2">
                        <video
                          src={values.demo_video}
                          controls
                          className="w-full max-w-md rounded-lg border border-white/10"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>

                  {/* Source Code Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white/90">
                      <FileArchive className="w-4 h-4 inline mr-2" />
                      Source Code
                    </label>
                    <FileUpload
                      label="Upload Source Code (ZIP, RAR, etc.)"
                      accept=".zip,.rar,.7z,.tar,.gz"
                      maxSize={50}
                      value={values.source_code_url}
                      onChange={(url) => setValues({ ...values, source_code_url: url })}
                      onUpload={handleSourceUpload}
                      onError={(msg) => toast.error(msg)}
                      preview={false}
                    />
                    {values.source_code_url && (
                      <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-white/70">
                          Source code uploaded: <span className="text-primary-400">{values.source_code_url.split('/').pop()}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTemplate(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
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
          setDeletingTemplate(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        itemName={deletingTemplate?.title}
        loading={saving}
      />
    </AdminLayout>
  );
}

export default function ProjectTemplatesPage() {
  return (
    <ToastProvider>
      <ProjectTemplatesContent />
    </ToastProvider>
  );
}
