const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  async fetch(endpoint: string, options?: RequestInit) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  auth: {
    register: (data: any) => api.fetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data: any) => api.fetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    me: () => api.fetch('/api/v1/auth/me'),
  },

  families: {
    list: () => api.fetch('/api/v1/families'),
    create: (data: any) => api.fetch('/api/v1/families', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    get: (id: string) => api.fetch(`/api/v1/families/${id}`),
  },

  children: {
    listByFamily: (familyId: string) => api.fetch(`/api/v1/children/family/${familyId}`),
    create: (data: any) => api.fetch('/api/v1/children', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    get: (id: string) => api.fetch(`/api/v1/children/${id}`),
  },

  events: {
    listByFamily: (familyId: string) => api.fetch(`/api/v1/events/family/${familyId}`),
    create: (data: any) => api.fetch('/api/v1/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  expenses: {
    listByFamily: (familyId: string) => api.fetch(`/api/v1/expenses/family/${familyId}`),
    create: (data: any) => api.fetch('/api/v1/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getSummary: (familyId: string) => api.fetch(`/api/v1/expenses/family/${familyId}/summary`),
  },
};
