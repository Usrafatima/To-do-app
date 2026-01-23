// Define an interface for the Task as returned/expected by the backend API
export interface BackendTask {
  id: number; // Backend expects number for ID
  text: string;
  description?: string;
  is_completed: boolean;
  priority?: string; // Backend stores as string
  due_date?: string; // Backend uses due_date
  tags?: string[]; // Backend expects string array
  recurrence?: { [key: string]: any } | null; // Backend expects dict
}

// Frontend-specific Task interface (kept for dashboard usage)
export interface Task {
  id: string; // Frontend uses string for ID
  text: string;
  description?: string;
  is_completed: boolean;
  priority: 'High' | 'Medium' | 'Low'; // Frontend uses enum
  category: 'Work' | 'Personal' | 'Study' | 'Health'; // Frontend only
  dueDate: string; // Frontend uses dueDate
  due_date?: string; // Optional field for backend compatibility
  isRecurring: boolean; // Frontend only
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | '';
  };
  tags: string[];
}

export interface User {
  name: string;
  email: string;
  profile_picture_url: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// --- Token Management ---
// We will keep these functions here as they might be used later for re-enabling auth
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

// --- Authenticated Fetcher (will be used without a token for now) ---
const generalFetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };

  // Only add Authorization header if a token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    cache: 'no-store', // Ensure we always fetch fresh data
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Something went wrong', response.status);
  }

  // Handle cases where response might be empty (e.g., DELETE requests)
  if (response.status === 204) { // No Content
    return null;
  }
  return response.json();
};

const authFetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Something went wrong', response.status);
      }
    
      return response.json();
}

// --- Authentication Functions (will not be used for now but kept for later) ---
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const formBody = new URLSearchParams({ username: email, password: password });
  const data = await authFetcher("/auth/login", {
    method: "POST",
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
  // Optionally, you could make an API call to invalidate the token on the backend
};

// --- Task API Calls (now using generalFetcher) ---
export const getTasks = async (): Promise<Task[]> => {
  const backendTasks: BackendTask[] = await generalFetcher("/tasks");
  // Map backend Task to frontend Task
  return backendTasks.map(bt => ({
    id: String(bt.id),
    text: bt.text,
    description: bt.description,
    is_completed: bt.is_completed,
    priority: (bt.priority || 'Medium') as Task['priority'], // Default or convert if needed
    category: 'Work', // Default, as backend doesn't have it
    dueDate: bt.due_date || '', // Use backend due_date
    isRecurring: bt.recurrence ? true : false, // Infer from recurrence field
    tags: bt.tags || [],
  }));
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const backendTaskPayload: Omit<BackendTask, 'id'> = {
    text: task.text,
    description: task.description,
    is_completed: task.is_completed,
    priority: task.priority,
    due_date: task.dueDate,
    tags: task.tags,
    recurrence: task.isRecurring ? { type: 'weekly' } : undefined, // Example
  };
  const addedBackendTask: BackendTask = await generalFetcher("/tasks", {
    method: "POST",
    body: JSON.stringify(backendTaskPayload),
  });
  return {
    ...task,
    id: String(addedBackendTask.id),
    is_completed: addedBackendTask.is_completed, // Use backend status
    dueDate: addedBackendTask.due_date || task.dueDate,
  };
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const backendUpdatePayload: Partial<BackendTask> = {
    text: updates.text,
    description: updates.description,
    is_completed: updates.is_completed,
    priority: updates.priority,
    due_date: updates.dueDate,
    tags: updates.tags,
    recurrence: updates.isRecurring !== undefined ? (updates.isRecurring ? { type: 'weekly' } : null) : undefined,
  };
  const updatedBackendTask: BackendTask = await generalFetcher(`/tasks/${Number(id)}`, { // Convert id to number
    method: "PUT",
    body: JSON.stringify(backendUpdatePayload),
  });
  // Map back to frontend Task
  return {
    id: String(updatedBackendTask.id),
    text: updatedBackendTask.text,
    description: updatedBackendTask.description,
    is_completed: updatedBackendTask.is_completed,
    priority: (updatedBackendTask.priority || 'Medium') as Task['priority'],
    category: updates.category || 'Work', // Retain frontend category if not updated
    dueDate: updatedBackendTask.due_date || '',
    isRecurring: updatedBackendTask.recurrence ? true : false,
    tags: updatedBackendTask.tags || [],
  };
};

export const deleteTask = async (id: string): Promise<void> => {
  return generalFetcher(`/tasks/${Number(id)}`, { // Convert id to number
    method: "DELETE",
  });
};

export const completeTask = async (id: string, is_completed: boolean): Promise<Task> => {
  return updateTask(id, { is_completed });
};

// --- Chat API Calls ---
export interface ChatMessage {
    message: string;
    conversation_id?: string;
}

export interface ChatResponse {
    conversation_id: string;
    response: string;
}

export const sendChatMessage = async (data: ChatMessage): Promise<ChatResponse> => {
    return generalFetcher("/api/v1/chat/", {
        method: "POST",
        body: JSON.stringify(data),
    });
};