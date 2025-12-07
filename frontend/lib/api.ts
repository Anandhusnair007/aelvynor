/**
 * API Client Library
 * Handles all API calls with authentication and error handling
 */

import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Custom API Error Class
 */
export class ApiClientError extends Error {
  status: number;
  detail: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.detail = detail || message;
  }
}

/**
 * Generic fetch wrapper with error handling
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'An error occurred' }));
      throw new ApiClientError(
        error.detail || res.statusText,
        res.status,
        error.detail
      );
    }

    return res.json();
  } catch (err) {
    if (err instanceof ApiClientError) {
      throw err;
    }
    throw new ApiClientError('Network error', 500, String(err));
  }
}

/**
 * Fetch with admin authentication
 */
export async function fetchAdmin<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    throw new ApiClientError('Not authenticated', 401, 'No auth token found');
  }

  return fetchAPI(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}

/**
 * Upload file helper
 */
export async function uploadFile(endpoint: string, formData: FormData) {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'An error occurred' }));
    throw new ApiClientError(error.detail || res.statusText, res.status, error.detail);
  }

  return res.json();
}

/**
 * Admin API Methods
 */
export const adminApi = {
  // Applications
  getApplications: () => fetchAdmin<any[]>('/api/admin/applications'),
  getApplication: (id: number) => fetchAdmin<any>(`/api/admin/applications/${id}`),
  updateApplication: (id: number, data: any) =>
    fetchAdmin(`/api/admin/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Mission
  getMission: () => fetchAdmin<any>('/api/admin/mission'),
  updateMission: (data: any) =>
    fetchAdmin('/api/admin/mission', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Product
  getProduct: () => fetchAdmin<any>('/api/admin/product'),
  updateProduct: (data: any) =>
    fetchAdmin('/api/admin/product', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadProductImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    if (!token) throw new ApiClientError('Not authenticated', 401);

    const url = `${API_URL}/api/admin/product/upload-image`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiClientError(error.detail || res.statusText, res.status);
    }

    return res.json();
  },
  uploadProductBrochure: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    if (!token) throw new ApiClientError('Not authenticated', 401);

    const url = `${API_URL}/api/admin/product/upload-brochure`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiClientError(error.detail || res.statusText, res.status);
    }

    return res.json();
  },

  // Projects
  getProjects: () => fetchAdmin<any[]>('/api/admin/projects'),
  createProject: (data: any) =>
    fetchAdmin('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: number, data: any) =>
    fetchAdmin(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    fetchAdmin(`/api/admin/projects/${id}`, {
      method: 'DELETE',
    }),

  // Courses
  getCourses: () => fetchAdmin<any[]>('/api/admin/courses'),
  createCourse: (data: any) =>
    fetchAdmin('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCourse: (id: number, data: any) =>
    fetchAdmin(`/api/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCourse: (id: number) =>
    fetchAdmin(`/api/admin/courses/${id}`, {
      method: 'DELETE',
    }),

  // Internships
  getInternships: () => fetchAdmin<any[]>('/api/admin/internships'),
  createInternship: (data: any) =>
    fetchAdmin('/api/admin/internships', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateInternship: (id: number, data: any) =>
    fetchAdmin(`/api/admin/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteInternship: (id: number) =>
    fetchAdmin(`/api/admin/internships/${id}`, {
      method: 'DELETE',
    }),

  // Content
  getContent: () => fetchAdmin<any>('/api/admin/content'),
  updateContent: (data: any) =>
    fetchAdmin('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Logs
  getLogs: () => fetchAdmin<any>('/api/admin/logs'),

  // Settings
  changePassword: (data: { current_password: string; new_password: string }) =>
    fetchAdmin('/api/admin/settings/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Project Templates (PMS)
  getProjectTemplates: (category?: string) => {
    const url = category
      ? `/api/admin/project-templates?category=${encodeURIComponent(category)}`
      : '/api/admin/project-templates';
    return fetchAdmin<any[]>(url);
  },
  getProjectTemplate: (id: number) => fetchAdmin<any>(`/api/admin/project-templates/${id}`),
  createProjectTemplate: (data: any) =>
    fetchAdmin('/api/admin/project-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProjectTemplate: (id: number, data: any) =>
    fetchAdmin(`/api/admin/project-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProjectTemplate: (id: number) =>
    fetchAdmin(`/api/admin/project-templates/${id}`, {
      method: 'DELETE',
    }),

  // Project Requests (PMS)
  getProjectRequests: (status?: string) => {
    const url = status
      ? `/api/admin/project-requests?status=${encodeURIComponent(status)}`
      : '/api/admin/project-requests';
    return fetchAdmin<any[]>(url);
  },
  getProjectRequest: (id: number) => fetchAdmin<any>(`/api/admin/project-requests/${id}`),
  updateProjectRequest: (id: number, data: any) =>
    fetchAdmin(`/api/admin/project-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProjectRequest: (id: number) =>
    fetchAdmin(`/api/admin/project-requests/${id}`, {
      method: 'DELETE',
    }),
  getProjectRequestFiles: (requestId: number) =>
    fetchAdmin<any[]>(`/api/admin/project-requests/${requestId}/files`),
  uploadProjectFile: async (requestId: number, file: File, fileType: string, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    if (description) formData.append('description', description);
    const token = getAuthToken();
    if (!token) throw new ApiClientError('Not authenticated', 401);

    const url = `${API_URL}/api/admin/project-requests/${requestId}/files`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiClientError(error.detail || res.statusText, res.status);
    }

    return res.json();
  },
  deleteProjectFile: (fileId: number) =>
    fetchAdmin(`/api/admin/project-files/${fileId}`, {
      method: 'DELETE',
    }),

  // Project Template File Uploads
  uploadTemplateImage: async (templateId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    if (!token) throw new ApiClientError('Not authenticated', 401);

    const url = `${API_URL}/api/admin/project-templates/${templateId}/upload-image`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiClientError(error.detail || res.statusText, res.status);
    }

    return res.json();
  },

  uploadTemplateVideo: async (templateId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    if (!token) throw new ApiClientError('Not authenticated', 401);

    const url = `${API_URL}/api/admin/project-templates/${templateId}/upload-video`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiClientError(error.detail || res.statusText, res.status);
    }

    return res.json();
  },

  uploadTemplateSource: async (templateId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    if (!token) throw new ApiClientError('Not authenticated', 401);

    const url = `${API_URL}/api/admin/project-templates/${templateId}/upload-source`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiClientError(error.detail || res.statusText, res.status);
    }

    return res.json();
  },

  // Contacts
  getContacts: (status?: string) => {
    const url = status
      ? `/api/admin/contacts?status=${encodeURIComponent(status)}`
      : '/api/admin/contacts';
    return fetchAdmin<any[]>(url);
  },
  getContact: (id: number) => fetchAdmin<any>(`/api/admin/contacts/${id}`),
  updateContactStatus: async (id: number, status: string) => {
    const formData = new FormData();
    formData.append('status', status);
    const token = getAuthToken();
    if (!token) throw new ApiClientError('Not authenticated', 401);

    const url = `${API_URL}/api/admin/contacts/${id}/status`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Update failed' }));
      throw new ApiClientError(error.detail || res.statusText, res.status);
    }

    return res.json();
  },

  // Course Purchases
  getCoursePurchases: (status?: string) => {
    const url = status
      ? `/api/admin/course-purchases?status=${encodeURIComponent(status)}`
      : '/api/admin/course-purchases';
    return fetchAdmin<any[]>(url);
  },
  getCoursePurchase: (id: number) => fetchAdmin<any>(`/api/admin/course-purchases/${id}`),
  updateCoursePurchase: (id: number, data: any) =>
    fetchAdmin(`/api/admin/course-purchases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Product Inquiries
  getProductInquiries: (status?: string) => {
    const url = status
      ? `/api/admin/product-inquiries?status=${encodeURIComponent(status)}`
      : '/api/admin/product-inquiries';
    return fetchAdmin<any[]>(url);
  },
  getProductInquiry: (id: number) => fetchAdmin<any>(`/api/admin/product-inquiries/${id}`),
  updateProductInquiry: (id: number, data: any) =>
    fetchAdmin(`/api/admin/product-inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Payments
  getPayments: (userEmail?: string, status?: string) => {
    let url = '/api/admin/payments?';
    const params = new URLSearchParams();
    if (userEmail) params.append('user_email', userEmail);
    if (status) params.append('status', status);
    url += params.toString();
    return fetchAdmin<any[]>(url);
  },
  getPayment: (id: number) => fetchAdmin<any>(`/api/admin/payments/${id}`),
  updatePayment: (id: number, data: any) =>
    fetchAdmin(`/api/admin/payments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Notifications
  sendNotification: (data: { recipient_email: string; subject: string; message: string }) =>
    fetchAdmin('/api/admin/notifications/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getNotifications: (recipientEmail?: string, isSent?: boolean) => {
    let url = '/api/admin/notifications?';
    const params = new URLSearchParams();
    if (recipientEmail) params.append('recipient_email', recipientEmail);
    if (isSent !== undefined) params.append('is_sent', String(isSent));
    url += params.toString();
    return fetchAdmin<any[]>(url);
  },
  markNotificationSent: (id: number) =>
    fetchAdmin(`/api/admin/notifications/${id}/mark-sent`, {
      method: 'PATCH',
    }),
};

/**
 * Public API Methods
 */
export async function getMission() {
  return fetchAPI('/api/mission');
}

export async function getProjects() {
  return fetchAPI('/api/projects');
}

export async function getProject(slug: string) {
  return fetchAPI(`/api/projects/${slug}`);
}

export async function getCourses() {
  return fetchAPI('/api/courses');
}

export async function getInternships() {
  return fetchAPI('/api/internships');
}

export async function getProduct() {
  return fetchAPI('/api/product');
}

export async function applyForPosition(formData: FormData) {
  return uploadFile('/api/apply', formData);
}

// Projects Management System (PMS) - Public API
export async function getProjectTemplates(category?: string) {
  const url = category
    ? `/api/project-templates?category=${encodeURIComponent(category)}`
    : '/api/project-templates';
  return fetchAPI(url);
}

export async function getProjectTemplate(id: number) {
  return fetchAPI(`/api/project-templates/${id}`);
}

export async function getProjectCategories() {
  return fetchAPI('/api/project-templates/categories/list');
}

export async function submitProjectRequest(formData: FormData) {
  return uploadFile('/api/project-request', formData);
}

export async function getUserProjectRequests(email: string) {
  return fetchAPI(`/api/project-requests/${encodeURIComponent(email)}`);
}

export async function getProjectRequestFiles(requestId: number) {
  return fetchAPI(`/api/project-requests/${requestId}/files`);
}

// Contact Form
export async function submitContact(formData: FormData) {
  return uploadFile('/api/contact', formData);
}

// Course Purchase
export async function purchaseCourse(formData: FormData) {
  return uploadFile('/api/courses/purchase', formData);
}

// Product Inquiry
export async function submitProductInquiry(formData: FormData) {
  return uploadFile('/api/product/inquiry', formData);
}

// Payment
export async function createPayment(formData: FormData) {
  return uploadFile('/api/payment/create', formData);
}

export async function getPaymentHistory(email: string) {
  return fetchAPI(`/api/payment/history/${encodeURIComponent(email)}`);
}
