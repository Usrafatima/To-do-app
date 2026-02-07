// Define an interface for the Task as returned/expected by the backend API
export interface BackendTask {
  id: string; // Updated to string for UUID
  text: string;
  description?: string;
  is_completed: boolean;
  priority: string;
  category: string;
  due_date?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Frontend-specific Task interface
export interface Task {
  id: string;
  text: string;
  description?: string;
  is_completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  dueDate: string;
  isRecurring: boolean;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | '';
  };
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile_picture_url: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const API_BASE_URL = "/api/proxy";

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const generalFetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(errorData.detail || 'Something went wrong', response.status);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const authFetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(errorData.detail || 'Something went wrong', response.status);
  }

  return response.json();
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const formBody = new URLSearchParams({ username: email, password: password });
  const data = await authFetcher("/auth/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody.toString(),
  });
  if (data.access_token) {
    setToken(data.access_token);
  }
  return data;
};

export const signupUser = async (email: string, password: string): Promise<any> => {
  const formBody = new URLSearchParams({ username: email, password: password });
  const data = await authFetcher("/auth/signup", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody.toString(),
  });
  return data;
};

export const googleLogin = async (idToken: string): Promise<AuthResponse> => {
  const data = await generalFetcher("/auth/google", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
  if (data.access_token) {
    setToken(data.access_token);
  }
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  return generalFetcher("/auth/me");
};

export const logoutUser = (): void => {
  removeToken();
};

export const getTasks = async (): Promise<Task[]> => {
  const backendTasks: BackendTask[] = await generalFetcher("/tasks");
  return backendTasks.map(bt => ({
    id: bt.id,
    text: bt.text,
    description: bt.description,
    is_completed: bt.is_completed,
    priority: (bt.priority || 'Medium') as Task['priority'],
    category: bt.category || 'Work',
    dueDate: bt.due_date || '',
    isRecurring: false,
    tags: bt.tags || [],
  }));
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const backendTaskPayload = {
    text: task.text,
    description: task.description,
    is_completed: task.is_completed,
    priority: task.priority,
    category: task.category,
    due_date: task.dueDate,
    tags: task.tags,
  };
  const addedBackendTask: BackendTask = await generalFetcher("/tasks", {
    method: "POST",
    body: JSON.stringify(backendTaskPayload),
  });
  return {
    ...task,
    id: addedBackendTask.id,
    dueDate: addedBackendTask.due_date || task.dueDate,
    category: addedBackendTask.category,
  };
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const backendUpdatePayload = {
    text: updates.text,
    description: updates.description,
    is_completed: updates.is_completed,
    priority: updates.priority,
    category: updates.category,
    due_date: updates.dueDate,
    tags: updates.tags,
  };
  const updatedBackendTask: BackendTask = await generalFetcher(`/tasks/${id}`, { 
    method: "PUT",
    body: JSON.stringify(backendUpdatePayload),
  });
  return {
    id: updatedBackendTask.id,
    text: updatedBackendTask.text,
    description: updatedBackendTask.description,
    is_completed: updatedBackendTask.is_completed,
    priority: (updatedBackendTask.priority || 'Medium') as Task['priority'],
    category: updatedBackendTask.category,
    dueDate: updatedBackendTask.due_date || '',
    isRecurring: false,
    tags: updatedBackendTask.tags || [],
  };
};

export const deleteTask = async (id: string): Promise<void> => {
  return generalFetcher(`/tasks/${id}`, { 
    method: "DELETE",
  });
};

export const completeTask = async (id: string, is_completed: boolean): Promise<Task> => {
  return updateTask(id, { is_completed });
};

export interface ChatMessage {
    message: string;
    conversation_id?: string;
}

export interface ChatResponse {
    conversation_id: string;
    response: string;
}

export const sendChatMessage = async (data: ChatMessage): Promise<ChatResponse> => {
    return generalFetcher("/api/v1/chat", {
        method: "POST",
        body: JSON.stringify(data),
    });
};