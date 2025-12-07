/**
 * Notifications Manager
 * Configure notification triggers and templates
 */

'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Bell, Mail, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

function NotificationsContent() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'project_approval',
      name: 'Project Approval',
      description: 'Notify when a project request is approved',
      enabled: true,
      channels: { email: true, sms: false, push: true },
    },
    {
      id: 'developer_assignment',
      name: 'Developer Assignment',
      description: 'Notify when a developer is assigned to a project',
      enabled: true,
      channels: { email: true, sms: false, push: true },
    },
    {
      id: 'progress_update',
      name: 'Progress Update',
      description: 'Notify when project progress is updated',
      enabled: false,
      channels: { email: false, sms: false, push: true },
    },
    {
      id: 'file_upload',
      name: 'File Upload',
      description: 'Notify when admin uploads project files',
      enabled: true,
      channels: { email: true, sms: false, push: true },
    },
    {
      id: 'project_delivery',
      name: 'Project Delivery',
      description: 'Notify when project is marked as delivered',
      enabled: true,
      channels: { email: true, sms: true, push: true },
    },
    {
      id: 'deadline_change',
      name: 'Deadline Change',
      description: 'Notify when project deadline is changed',
      enabled: true,
      channels: { email: true, sms: false, push: false },
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map((s) => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const toggleChannel = (id: string, channel: 'email' | 'sms' | 'push') => {
    setSettings(settings.map((s) =>
      s.id === id
        ? {
            ...s,
            channels: { ...s.channels, [channel]: !s.channels[channel] },
          }
        : s
    ));
  };

  return (
    <AdminLayout title="Notifications Manager">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-all duration-150"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{setting.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-150',
                      setting.enabled
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {setting.enabled ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {setting.enabled && (
                  <div className="flex gap-6 mt-4 pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setting.channels.email}
                        onChange={() => toggleChannel(setting.id, 'email')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setting.channels.sms}
                        onChange={() => toggleChannel(setting.id, 'sms')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">SMS</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setting.channels.push}
                        onChange={() => toggleChannel(setting.id, 'push')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <Bell className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Push</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Save Settings
            </Button>
          </div>
        </Card>

        {/* Email Templates Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Templates</h2>
          <p className="text-gray-600 mb-4">
            Customize email notification templates for different events.
          </p>
          <Button variant="outline">Edit Templates</Button>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function NotificationsPage() {
  return <NotificationsContent />;
}

