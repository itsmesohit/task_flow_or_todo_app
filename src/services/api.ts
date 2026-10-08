import { Task, User, TaskStats, Priority, StatusFilter, SortOption } from '../types';

const API_BASE = '/api';

const getToken = (): string | null => {
  return localStorage.getItem('taskflow_token');
};

export const setToken = (token: string) => {
  localStorage.setItem('taskflow_token', token);
};

export const clearToken = () => {
  localStorage.removeItem('taskflow_token');
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// Authentication API
export const authApi = {
  register: async (name: string, email: string, password: string): Promise<{ success: boolean; token: string; user: User }> => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string): Promise<{ success: boolean; token: string; user: User }> => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  demoLogin: async (): Promise<{ success: boolean; token: string; user: User }> => {
    return request('/auth/demo', {
      method: 'POST',
    });
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    return request('/auth/me', {
      method: 'GET',
    });
  },
};

export interface TaskQueryParams {
  status?: StatusFilter;
  priority?: 'all' | Priority;
  category?: 'all' | string;
  search?: string;
  sortBy?: SortOption;
}

// Tasks API
export const tasksApi = {
  getTasks: async (params?: TaskQueryParams): Promise<{ success: boolean; count: number; tasks: Task[] }> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.search && params.search.trim()) query.append('search', params.search.trim());
    if (params?.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return request(endpoint, { method: 'GET' });
  },

  createTask: async (
    taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>
  ): Promise<{ success: boolean; task: Task }> => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTask: async (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
  ): Promise<{ success: boolean; task: Task }> => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  toggleTask: async (id: string): Promise<{ success: boolean; task: Task }> => {
    return request(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  deleteTask: async (id: string): Promise<{ success: boolean; message: string; id: string }> => {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (): Promise<{ success: boolean; stats: TaskStats }> => {
    return request('/tasks/stats', {
      method: 'GET',
    });
  },
};

// Health Check API
export const healthApi = {
  checkHealth: async () => {
    return request<{ status: string; database: { connected: boolean; host: string } }>('/health', {
      method: 'GET',
    });
  },
};
