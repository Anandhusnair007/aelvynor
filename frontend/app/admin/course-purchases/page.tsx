/**
 * Course Purchases Management Page
 * View and manage course purchase requests
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
import Button from '@/components/ui/Button';

interface CoursePurchase {
    id: number;
    name: string;
    email: string;
    phone: string;
    course_id: number;
    status: string;
    payment_status: string;
    created_at: string;
}

function CoursePurchasesContent() {
    const router = useRouter();
    const toast = useToast();
    const [purchases, setPurchases] = useState<CoursePurchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchPurchases();
    }, [router, statusFilter]);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getCoursePurchases(statusFilter === 'all' ? undefined : statusFilter);
            setPurchases(data || []);
        } catch (err) {
            if (err instanceof ApiClientError && err.status === 401) {
                router.push('/admin/login');
            } else {
                toast.error('Failed to load course purchases');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string, paymentStatus?: string) => {
        try {
            const updateData: any = { status };
            if (paymentStatus) updateData.payment_status = paymentStatus;
            await adminApi.updateCoursePurchase(id, updateData);
            toast.success('Purchase status updated');
            fetchPurchases();
        } catch (err) {
            toast.error('Failed to update purchase');
        }
    };

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'course_id', header: 'Course ID' },
        {
            key: 'status',
            header: 'Status',
            render: (purchase: CoursePurchase) => (
                <Badge
                    variant={
                        purchase.status === 'completed' ? 'success' :
                            purchase.status === 'confirmed' ? 'default' : 'warning'
                    }
                    size="sm"
                >
                    {purchase.status}
                </Badge>
            ),
        },
        {
            key: 'payment_status',
            header: 'Payment',
            render: (purchase: CoursePurchase) => (
                <Badge
                    variant={purchase.payment_status === 'pending' ? 'warning' : 'success'}
                    size="sm"
                >
                    {purchase.payment_status}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            header: 'Date',
            render: (purchase: CoursePurchase) => (
                <span className="text-white/60 text-sm">
                    {new Date(purchase.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (purchase: CoursePurchase) => (
                <div className="flex gap-2">
                    {purchase.status === 'pending' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(purchase.id, 'confirmed')}
                        >
                            Confirm
                        </Button>
                    )}
                    {purchase.payment_status === 'pending' && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusUpdate(purchase.id, purchase.status, 'paid')}
                        >
                            Mark Paid
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Course Purchases">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Course Purchase Requests</h1>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 bg-gray-800 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <Card padding="lg">
                    {loading ? (
                        <TableSkeleton rows={5} columns={7} />
                    ) : purchases.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No course purchase requests yet.
                        </div>
                    ) : (
                        <DataTable data={purchases} columns={columns} />
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}

export default function CoursePurchasesPage() {
    return (
        <ToastProvider>
            <CoursePurchasesContent />
        </ToastProvider>
    );
}
