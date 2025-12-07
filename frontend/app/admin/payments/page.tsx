/**
 * Payment & Pricing Section
 * Manage pricing and payment history
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi, ApiClientError } from '@/lib/api';
import { ToastProvider, useToast } from '@/components/admin/ToastProvider';
import { isAuthenticated } from '@/lib/auth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { DollarSign, CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';

interface Payment {
  id: number;
  request_id: number;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
}

interface ProjectRequest {
  id: number;
  name: string;
  email: string;
  price: number | null;
  payment_status: string;
}

function PaymentsContent() {
  const router = useRouter();
  const toast = useToast();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [router, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsData, paymentsData] = await Promise.all([
        adminApi.getProjectRequests().catch(() => []),
        fetchPayments(),
      ]);
      setRequests(requestsData);
      setPayments(paymentsData);
    } catch (err) {
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (): Promise<Payment[]> => {
    // Mock payment data - replace with actual API call when backend is ready
    return [];
  };

  const handleMarkPaid = async (requestId: number) => {
    try {
      await adminApi.updateProjectRequest(requestId, {
        payment_status: 'paid',
      });
      toast.success('Payment marked as paid');
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update payment status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; icon: any }> = {
      paid: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle2,
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: Clock,
      },
      failed: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: XCircle,
      },
    };
    return colors[status.toLowerCase()] || colors.pending;
  };

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((r) => r.payment_status?.toLowerCase() === statusFilter.toLowerCase());

  const totalRevenue = requests
    .filter((r) => r.payment_status === 'paid' && r.price)
    .reduce((sum, r) => sum + (r.price || 0), 0);

  const pendingAmount = requests
    .filter((r) => r.payment_status === 'pending' && r.price)
    .reduce((sum, r) => sum + (r.price || 0), 0);

  return (
    <AdminLayout title="Payment & Pricing">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {requests.filter((r) => r.price).length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Payment History */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-input text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No payments found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests
                    .filter((r) => r.price)
                    .map((request) => {
                      const statusInfo = getStatusColor(request.payment_status || 'pending');
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">#{request.id}</td>
                          <td className="px-4 py-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">{request.name}</p>
                              <p className="text-gray-600 text-xs">{request.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            ₹{request.price?.toLocaleString() || '0'}
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant={request.payment_status === 'paid' ? 'success' : 'warning'}
                              className="flex items-center gap-1 w-fit"
                            >
                              <StatusIcon className="w-3 h-3" />
                              {request.payment_status || 'pending'}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            {request.payment_status !== 'paid' && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkPaid(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Mark as Paid
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function PaymentsPage() {
  return (
    <ToastProvider>
      <PaymentsContent />
    </ToastProvider>
  );
}

