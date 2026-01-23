"use client";

import { useEffect, useState, useCallback } from "react";
import { Task, getTasks, addTask, updateTask, deleteTask } from "@/lib/apiClient";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import FilterControls from "./FilterControls";
import Notifications from "../Notifications";

interface TaskContainerProps {
  refetchTrigger: number;
}

export default function TaskContainer({ refetchTrigger }: TaskContainerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'alphabetical'>('dueDate');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchTasks();
  }, [refetchTrigger, fetchTasks]); // Re-fetch when refetchTrigger or fetchTasks changes

  const handleAddTask = async (text: string) => {
    try {
      const newTask = await addTask({
        text: text,
        is_completed: false,
        priority: 'Medium',
        category: 'Work',
        dueDate: '',
        isRecurring: false,
        tags: []
      });
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleUpdateTask = async (id: any, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(prevTasks => prevTasks.map(task => (task.id === id ? updatedTask : task)));

      if (updatedTask.is_completed && updatedTask.recurrence) {
        const { recurrence, id: _, ...originalTask } = updatedTask;
        const new_due_date = new Date(originalTask.due_date || new Date());
        if (recurrence.type === 'daily') {
          new_due_date.setDate(new_due_date.getDate() + 1);
        } else if (recurrence.type === 'weekly') {
          new_due_date.setDate(new_due_date.getDate() + 7);
        } else if (recurrence.type === 'monthly') {
          new_due_date.setMonth(new_due_date.getMonth() + 1);
        }

        const newTask = await addTask({
          ...originalTask,
          is_completed: false,
          due_date: new_due_date.toISOString(),
          dueDate: new_due_date.toISOString()
        });
        setTasks(prevTasks => [...prevTasks, newTask]);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (id: any) => {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(task => {
      if (statusFilter === 'all') return true;
      return statusFilter === 'completed' ? task.is_completed : !task.is_completed;
    })
    .filter(task => {
      if (priorityFilter === 'all') return true;
      return task.priority === priorityFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return (priorityOrder[a.priority!] || 4) - (priorityOrder[b.priority!] || 4);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  if (loading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  return (
    <div className="bg-transparent rounded-lg p-4 sm:p-6">
      <Notifications tasks={tasks} />
      <AddTask onAddTask={handleAddTask} />
      <FilterControls
        onSearch={setSearchQuery}
        onFilterByStatus={setStatusFilter}
        onFilterByPriority={setPriorityFilter}
        onSort={setSortBy}
      />
      <TaskList
        tasks={filteredAndSortedTasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
