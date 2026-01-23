// frontend/src/contexts/TaskContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getTasks, 
  addTask as apiAddTask, 
  updateTask as apiUpdateTask, 
  deleteTask as apiDeleteTask, 
  completeTask as apiCompleteTask, 
  Task 
} from '../lib/apiClient';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<Task | null>;
  updateTask: (task: Task) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompletion: (id: string, is_completed: boolean) => Promise<Task | null>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    // Only set loading true if it's the first load or explicit refresh where we want to block UI
    // Here we might decide not to flicker loading state for background refreshes
    // For now, let's just fetch without setting loading to true if we already have tasks
    if (tasks.length === 0) setLoading(true);
    
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      // Don't toast on initial load error to avoid spam if backend is down
    } finally {
      setLoading(false);
    }
  }, [tasks.length]);

  // Initial fetch
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const addTask = async (newTaskData: Omit<Task, 'id'>) => {
    try {
      const createdTask = await apiAddTask(newTaskData);
      setTasks(prev => [...prev, createdTask]);
      return createdTask;
    } catch (err) {
      console.error("Failed to add task:", err);
      toast.error("Failed to create task.");
      return null;
    }
  };

  const updateTask = async (updatedTaskData: Task) => {
    try {
      const updatedTask = await apiUpdateTask(updatedTaskData.id, updatedTaskData);
      setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Failed to update task.");
      return null;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiDeleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task.");
      return false;
    }
  };

  const toggleTaskCompletion = async (id: string, is_completed: boolean) => {
    try {
      const updatedTask = await apiCompleteTask(id, is_completed);
      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      console.error("Failed to toggle task completion:", err);
      toast.error("Failed to update task status.");
      return null;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      refreshTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
