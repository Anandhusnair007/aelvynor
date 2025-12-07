/**
 * Project Delivery Panel
 * Upload final project files and mark as delivered
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
import { Upload, File, X, CheckCircle2, Download } from 'lucide-react';

interface ProjectRequest {
  id: number;
  name: string;
  email: string;
  status: string;
  progress: number;
  assigned_to: string | null;
  created_at: string;
}

interface ProjectFile {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

function ProjectDeliveryContent() {
  const router = useRouter();
  const toast = useToast();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileData, setFileData] = useState({
    file: null as File | null,
    file_type: 'source_code',
    description: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchRequests();
  }, [router]);

  useEffect(() => {
    if (selectedRequest) {
      fetchFiles(selectedRequest.id);
    }
  }, [selectedRequest]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProjectRequests('in_progress');
      setRequests(data.filter((r: ProjectRequest) => 
        r.status === 'In Progress' || r.status === 'in_progress'
      ));
    } catch (err) {
      toast.error('Failed to load project requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (requestId: number) => {
    try {
      const data = await adminApi.getProjectRequestFiles(requestId);
      setFiles(data);
    } catch (err) {
      toast.error('Failed to load files');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileData({ ...fileData, file: e.dataTransfer.files[0] });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileData({ ...fileData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !fileData.file) return;

    try {
      setUploading(true);
      await adminApi.uploadProjectFile(
        selectedRequest.id,
        fileData.file,
        fileData.file_type,
        fileData.description || undefined
      );
      toast.success('File uploaded successfully');
      setFileData({ file: null, file_type: 'source_code', description: '' });
      fetchFiles(selectedRequest.id);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!selectedRequest) return;
    
    try {
      await adminApi.updateProjectRequest(selectedRequest.id, {
        status: 'Delivered',
        progress: 100,
      });
      toast.success('Project marked as delivered');
      fetchRequests();
      setSelectedRequest(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const url = fileUrl.startsWith('http') ? fileUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${fileUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return (
    <AdminLayout title="Project Delivery">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">In Progress Projects</h2>
            <div className="space-y-2">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : requests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No projects in progress</p>
              ) : (
                requests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                      selectedRequest?.id === request.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{request.name}</h3>
                      <Badge variant={request.status === 'In Progress' ? 'warning' : 'default'}>
                        {request.progress}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    {request.assigned_to && (
                      <p className="text-xs text-gray-500 mt-1">Assigned: {request.assigned_to}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Delivery Panel */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <div className="space-y-6">
              {/* Project Info */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedRequest.name}</h2>
                    <p className="text-gray-600">{selectedRequest.email}</p>
                  </div>
                  <Button
                    onClick={handleMarkDelivered}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Delivered
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedRequest.progress}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedRequest.progress}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant="warning" className="mt-2">{selectedRequest.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      {selectedRequest.assigned_to || 'Unassigned'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Upload Zone */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
                <form onSubmit={handleUpload}>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-150 ${
                      dragActive
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".zip,.pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Click to upload or drag and drop
                    </label>
                    {fileData.file && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <File className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">{fileData.file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFileData({ ...fileData, file: null })}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Type
                      </label>
                      <select
                        value={fileData.file_type}
                        onChange={(e) => setFileData({ ...fileData, file_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-input focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="source_code">Source Code</option>
                        <option value="documentation">Documentation</option>
                        <option value="report">Report</option>
                        <option value="demo">Demo</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={fileData.description}
                      onChange={(e) => setFileData({ ...fileData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-input focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add file description..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!fileData.file || uploading}
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </form>
              </Card>

              {/* Files List */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                {files.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No files uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">{file.file_name}</p>
                            <p className="text-sm text-gray-500">
                              {file.file_type} • {new Date(file.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(file.file_url, file.file_name)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Project</h3>
              <p className="text-gray-600">Choose a project from the list to upload delivery files</p>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function ProjectDeliveryPage() {
  return (
    <ToastProvider>
      <ProjectDeliveryContent />
    </ToastProvider>
  );
}

