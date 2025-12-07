/**
 * Courses Management Page
 * List, create, edit, and delete courses
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

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  students_count: number;
  created_at: string;
}

function CoursesManagementContent() {
  const router = useRouter();
  const toast = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    title: '',
    description: '',
    level: '',
    duration: '',
    students_count: 0,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchCourses();
  }, [router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCourses();
      setCourses(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load courses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setValues({
      title: '',
      description: '',
      level: '',
      duration: '',
      students_count: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setValues({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      students_count: course.students_count,
    });
    setShowModal(true);
  };

  const handleDelete = (course: Course) => {
    setDeletingCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingCourse) return;
    try {
      await adminApi.deleteCourse(deletingCourse.id);
      toast.success('Course deleted successfully');
      fetchCourses();
      setShowDeleteModal(false);
      setDeletingCourse(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete course');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCourse) {
        await adminApi.updateCourse(editingCourse.id, values);
        toast.success('Course updated successfully');
      } else {
        await adminApi.createCourse(values);
        toast.success('Course created successfully');
      }
      fetchCourses();
      setShowModal(false);
      setEditingCourse(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const fields: FormField[] = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 4 },
    {
      name: 'level',
      label: 'Level',
      type: 'select',
      required: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    { name: 'duration', label: 'Duration', type: 'text', required: true, placeholder: 'e.g., 4 weeks' },
    { name: 'students_count', label: 'Students Count', type: 'number', required: true },
  ];

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'level', header: 'Level' },
    { key: 'duration', header: 'Duration' },
    { key: 'students_count', header: 'Students' },
    {
      key: 'actions',
      header: 'Actions',
      render: (course: Course) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(course)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(course)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Courses Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <Button variant="primary" size="sm" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>

        <Card padding="lg">
          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : courses.length === 0 ? (
            <EmptyState
              title="No courses yet"
              description="Get started by creating your first course."
              actionLabel="Create Course"
              onAction={handleCreate}
            />
          ) : (
            <DataTable data={courses} columns={columns} />
          )}
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingCourse ? 'Edit Course' : 'Create Course'}
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
                    setEditingCourse(null);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
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
          setDeletingCourse(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        itemName={deletingCourse?.title}
        loading={saving}
      />
    </AdminLayout>
  );
}

export default function CoursesManagementPage() {
  return (
    <ToastProvider>
      <CoursesManagementContent />
    </ToastProvider>
  );
}

