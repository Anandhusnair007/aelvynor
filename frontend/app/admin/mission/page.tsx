/**
 * Mission Editor Page
 * Edit mission statement (short and long)
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

function MissionEditorContent() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    short: '',
    long: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchMission();
  }, [router]);

  const fetchMission = async () => {
    try {
      setLoading(true);
      const mission = await adminApi.getMission();
      setValues({
        short: mission.short || '',
        long: mission.long || '',
      });
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load mission');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.updateMission(values);
      toast.success('Mission updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update mission');
    } finally {
      setSaving(false);
    }
  };

  const fields: FormField[] = [
    {
      name: 'short',
      label: 'Short Mission',
      type: 'textarea',
      placeholder: 'Enter short mission statement',
      required: true,
      rows: 3,
    },
    {
      name: 'long',
      label: 'Long Mission',
      type: 'textarea',
      placeholder: 'Enter detailed mission statement',
      required: true,
      rows: 6,
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Mission Editor">
        <Card padding="lg">
          <LoadingSkeleton lines={8} />
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Mission Editor">
      <Card padding="lg">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Mission</h1>
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

export default function MissionEditorPage() {
  return (
    <ToastProvider>
      <MissionEditorContent />
    </ToastProvider>
  );
}

