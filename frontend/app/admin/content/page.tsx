/**
 * Content Editor Page
 * Edit website content (hero, footer, contact)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { adminApi, ApiClientError } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import FormBuilder, { FormField } from '@/components/admin/FormBuilder';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/admin/LoadingSkeleton';

function ContentEditorContent() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    hero_title: '',
    hero_subtitle: '',
    footer_text: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchContent();
  }, [router]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const content = await adminApi.getContent();
      setValues({
        hero_title: content.hero_title || '',
        hero_subtitle: content.hero_subtitle || '',
        footer_text: content.footer_text || '',
        contact_email: content.contact_email || '',
        contact_phone: content.contact_phone || '',
        contact_address: content.contact_address || '',
      });
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load content');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.updateContent(values);
      toast.success('Content updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const fields: FormField[] = [
    {
      name: 'hero_title',
      label: 'Hero Title',
      type: 'text',
      placeholder: 'Main heading for homepage',
    },
    {
      name: 'hero_subtitle',
      label: 'Hero Subtitle',
      type: 'textarea',
      placeholder: 'Subheading for homepage',
      rows: 3,
    },
    {
      name: 'footer_text',
      label: 'Footer Text',
      type: 'textarea',
      placeholder: 'Footer copyright or description',
      rows: 3,
    },
    {
      name: 'contact_email',
      label: 'Contact Email',
      type: 'email',
      placeholder: 'contact@example.com',
    },
    {
      name: 'contact_phone',
      label: 'Contact Phone',
      type: 'text',
      placeholder: '+1 (555) 123-4567',
    },
    {
      name: 'contact_address',
      label: 'Contact Address',
      type: 'textarea',
      placeholder: 'Street address, City, State, ZIP',
      rows: 3,
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Content Editor">
        <Card padding="lg">
          <LoadingSkeleton lines={10} />
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Content Editor">
      <Card padding="lg">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Website Content</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Hero Section</h2>
              <FormBuilder
                fields={fields.filter((f) => f.name.startsWith('hero_'))}
                values={values}
                onChange={(name, value) => setValues({ ...values, [name]: value })}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Footer</h2>
              <FormBuilder
                fields={fields.filter((f) => f.name === 'footer_text')}
                values={values}
                onChange={(name, value) => setValues({ ...values, [name]: value })}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <FormBuilder
                fields={fields.filter((f) => f.name.startsWith('contact_'))}
                values={values}
                onChange={(name, value) => setValues({ ...values, [name]: value })}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </AdminLayout>
  );
}

export default function ContentEditorPage() {
  return (
    <ToastProvider>
      <ContentEditorContent />
    </ToastProvider>
  );
}

