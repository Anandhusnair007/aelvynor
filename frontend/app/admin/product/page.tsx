/**
 * Product Editor Page
 * Edit product information with image and brochure uploads
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { adminApi, ApiClientError } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import FormBuilder, { FormField } from '@/components/admin/FormBuilder';
import FileUpload from '@/components/admin/FileUpload';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/admin/LoadingSkeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function ProductEditorContent() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    name: '',
    description: '',
    features: [] as string[],
    specs: {} as Record<string, any>,
    image: '',
    brochure: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchProduct();
  }, [router]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await adminApi.getProduct();
      setValues({
        name: product.name || '',
        description: product.description || '',
        features: Array.isArray(product.features) ? product.features : [],
        specs: product.specs || {},
        image: product.image || '',
        brochure: product.brochure || '',
      });
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 404) {
        // Product doesn't exist yet, start with empty form
        setLoading(false);
      } else if (err instanceof ApiClientError && err.status === 401) {
        router.push('/admin/login');
      } else {
        toast.error('Failed to load product');
        setLoading(false);
      }
    } finally {
      if (loading) setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await adminApi.uploadProductImage(file);
      return result.url;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Image upload failed');
    }
  };

  const handleBrochureUpload = async (file: File) => {
    try {
      const result = await adminApi.uploadProductBrochure(file);
      return result.url;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Brochure upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.updateProduct(values);
      toast.success('Product updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const fields: FormField[] = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter product description',
      required: true,
      rows: 6,
    },
    {
      name: 'features',
      label: 'Features',
      type: 'json',
      placeholder: '["Feature 1", "Feature 2"]',
      helpText: 'Enter as JSON array of strings',
    },
    {
      name: 'specs',
      label: 'Specifications',
      type: 'json',
      placeholder: '{"key": "value"}',
      helpText: 'Enter as JSON object',
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Product Editor">
        <Card padding="lg">
          <LoadingSkeleton lines={10} />
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Product Editor">
      <Card padding="lg">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit}>
          <FormBuilder
            fields={fields}
            values={values}
            onChange={(name, value) => setValues({ ...values, [name]: value })}
          />
          
          <div className="mt-6 space-y-6">
            <FileUpload
              label="Product Image"
              accept="image/*"
              maxSize={10}
              value={values.image}
              onChange={(url) => setValues({ ...values, image: url })}
              onUpload={handleImageUpload}
              onError={(msg) => toast.error(msg)}
              preview
            />
            
            <FileUpload
              label="Product Brochure (PDF)"
              accept=".pdf"
              maxSize={20}
              value={values.brochure}
              onChange={(url) => setValues({ ...values, brochure: url })}
              onUpload={handleBrochureUpload}
              onError={(msg) => toast.error(msg)}
              preview={false}
            />
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

export default function ProductEditorPage() {
  return (
    <ToastProvider>
      <ProductEditorContent />
    </ToastProvider>
  );
}

