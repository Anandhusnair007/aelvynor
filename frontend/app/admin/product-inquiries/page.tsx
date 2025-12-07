/**
 * Product Inquiries Management Page
 * View and manage product inquiry submissions
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { adminApi, ApiClientError } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import DataTable from '@/components/admin/DataTable';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ProductInquiry {
    id: number;
    name: string;
    email: string;
    company: string;
    message: string;
    status: string;
    created_at: string;
}

function ProductInquiriesContent() {
    const router = useRouter();
    const toast = useToast();
    const [inquiries, setInquiries] = useState<ProductInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedInquiry, setSelectedInquiry] = useState<ProductInquiry | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchInquiries();
    }, [router, statusFilter]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getProductInquiries(statusFilter === 'all' ? undefined : statusFilter);
            setInquiries(data || []);
        } catch (err) {
            if (err instanceof ApiClientError && err.status === 401) {
                router.push('/admin/login');
            } else {
                toast.error('Failed to load product inquiries');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await adminApi.updateProductInquiry(id, { status });
            toast.success('Inquiry status updated');
            fetchInquiries();
        } catch (err) {
            toast.error('Failed to update inquiry');
        }
    };

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'company', header: 'Company' },
        {
            key: 'message',
            header: 'Message',
            render: (inquiry: ProductInquiry) => (
                <span className="line-clamp-2 text-sm">{inquiry.message}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (inquiry: ProductInquiry) => (
                <Badge
                    variant={
                        inquiry.status === 'closed' ? 'default' :
                            inquiry.status === 'quoted' ? 'success' :
                                inquiry.status === 'contacted' ? 'default' : 'warning'
                    }
                    size="sm"
                >
                    {inquiry.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (inquiry: ProductInquiry) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        View
                    </button>
                    {inquiry.status === 'new' && (
                        <button
                            onClick={() => handleStatusUpdate(inquiry.id, 'contacted')}
                            className="text-green-600 hover:text-green-800 text-sm"
                        >
                            Contact
                        </button>
                    )}
                    {inquiry.status === 'contacted' && (
                        <button
                            onClick={() => handleStatusUpdate(inquiry.id, 'quoted')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Quote Sent
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Product Inquiries">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Product Inquiry Submissions</h1>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 bg-gray-800 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <Card padding="lg">
                    {loading ? (
                        <TableSkeleton rows={5} columns={6} />
                    ) : inquiries.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No product inquiries yet.
                        </div>
                    ) : (
                        <DataTable data={inquiries} columns={columns} />
                    )}
                </Card>
            </div>

            {/* Inquiry Detail Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Inquiry Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Name</label>
                                <p className="text-white">{selectedInquiry.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Email</label>
                                    <p className="text-white">{selectedInquiry.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Company</label>
                                    <p className="text-white">{selectedInquiry.company}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Message</label>
                                <p className="text-white bg-gray-800 p-4 rounded-lg">
                                    {selectedInquiry.message}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Status</label>
                                <div className="mt-1">
                                    <Badge
                                        variant={selectedInquiry.status === 'new' ? 'warning' : 'success'}
                                        size="sm"
                                    >
                                        {selectedInquiry.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default function ProductInquiriesPage() {
    return (
        <ToastProvider>
            <ProductInquiriesContent />
        </ToastProvider>
    );
}
