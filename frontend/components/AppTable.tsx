/**
 * Applications Table Component
 * Displays applications in a clean table format with actions
 */

'use client';

import { useState } from 'react';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  cover_letter?: string;
  position_type: string;
  position_id?: number;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  created_at: string;
}

interface AppTableProps {
  applications: Application[];
  onStatusChange: (id: number, status: Application['status']) => Promise<void>;
  onResumeDownload: (resumeUrl: string) => void;
  loading?: boolean;
}

export default function AppTable({
  applications,
  onStatusChange,
  onResumeDownload,
  loading = false,
}: AppTableProps) {
  const [changingStatus, setChangingStatus] = useState<number | null>(null);

  const handleStatusChange = async (id: number, newStatus: Application['status']) => {
    setChangingStatus(id);
    try {
      await onStatusChange(id, newStatus);
    } finally {
      setChangingStatus(null);
    }
  };

  const getStatusVariant = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'reviewing':
        return 'warning';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No applications found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resume
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{app.full_name}</div>
                {app.phone && (
                  <div className="text-sm text-gray-500">{app.phone}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{app.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize">{app.position_type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(app.created_at)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusVariant(app.status)} size="sm">
                  {app.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {app.resume_url ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResumeDownload(app.resume_url!)}
                  >
                    Download
                  </Button>
                ) : (
                  <span className="text-sm text-gray-400">No resume</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={app.status}
                  onChange={(e) =>
                    handleStatusChange(app.id, e.target.value as Application['status'])
                  }
                  disabled={changingStatus === app.id}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

