/**
 * Settings Page
 * Change admin password
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { adminApi, ApiClientError } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Key } from 'lucide-react';

function SettingsContent() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthenticated()) {
    router.push('/admin/login');
    return null;
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!values.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    if (!values.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (values.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    if (values.new_password !== values.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      await adminApi.changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      toast.success('Password updated successfully');
      setValues({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 400) {
        toast.error(err.detail || 'Current password is incorrect');
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to update password');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-white/80 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="current_password"
              value={values.current_password}
              onChange={(e) => setValues({ ...values, current_password: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-400">{errors.current_password}</p>
            )}
          </div>

          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-white/80 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="new_password"
              value={values.new_password}
              onChange={(e) => setValues({ ...values, new_password: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-400">{errors.new_password}</p>
            )}
            <p className="mt-1 text-xs text-white/60">Must be at least 8 characters</p>
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-white/80 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm_password"
              value={values.confirm_password}
              onChange={(e) => setValues({ ...values, confirm_password: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-400">{errors.confirm_password}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Card>
    </AdminLayout>
  );
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsContent />
    </ToastProvider>
  );
}

