/**
 * Contacts Management Page
 * View and manage user contact submissions
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
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    created_at: string;
}

function ContactsManagementContent() {
    const router = useRouter();
    const toast = useToast();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchContacts();
    }, [router, statusFilter]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getContacts(statusFilter === 'all' ? undefined : statusFilter);
            setContacts(data || []);
        } catch (err) {
            if (err instanceof ApiClientError && err.status === 401) {
                router.push('/admin/login');
            } else {
                toast.error('Failed to load contacts');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await adminApi.updateContactStatus(id, status);
            toast.success('Contact status updated');
            fetchContacts();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const statusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'success' | 'warning'> = {
            new: 'warning',
            read: 'default',
            replied: 'success',
        };
        return <Badge variant={variants[status] || 'default'} size="sm">{status}</Badge>;
    };

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        {
            key: 'message',
            header: 'Message',
            render: (contact: Contact) => (
                <span className="line-clamp-2 text-sm">{contact.message}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (contact: Contact) => statusBadge(contact.status),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (contact: Contact) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        View
                    </button>
                    {contact.status === 'new' && (
                        <button
                            onClick={() => handleStatusUpdate(contact.id, 'read')}
                            className="text-green-600 hover:text-green-800 text-sm"
                        >
                            Mark Read
                        </button>
                    )}
                    {contact.status === 'read' && (
                        <button
                            onClick={() => handleStatusUpdate(contact.id, 'replied')}
                            className="text-green-600 hover:text-green-800 text-sm"
                        >
                            Mark Replied
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Contacts Management">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 bg-gray-800 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>
                </div>

                <Card padding="lg">
                    {loading ? (
                        <TableSkeleton rows={5} columns={6} />
                    ) : contacts.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No contact submissions yet.
                        </div>
                    ) : (
                        <DataTable data={contacts} columns={columns} />
                    )}
                </Card>
            </div>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Contact Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Name</label>
                                <p className="text-white">{selectedContact.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Email</label>
                                    <p className="text-white flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {selectedContact.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Phone</label>
                                    <p className="text-white flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {selectedContact.phone}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Message</label>
                                <p className="text-white bg-gray-800 p-4 rounded-lg">
                                    {selectedContact.message}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Status</label>
                                    <div className="mt-1">{statusBadge(selectedContact.status)}</div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Received</label>
                                    <p className="text-white text-sm flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {new Date(selectedContact.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            {selectedContact.status !== 'replied' && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={async () => {
                                        await handleStatusUpdate(selectedContact.id, 'replied');
                                        setSelectedContact(null);
                                    }}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark as Replied
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedContact(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default function ContactsManagementPage() {
    return (
        <ToastProvider>
            <ContactsManagementContent />
        </ToastProvider>
    );
}
