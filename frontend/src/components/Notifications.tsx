
"use client";

import { useEffect } from 'react';
import { Task } from '@/lib/apiClient';

interface NotificationsProps {
  tasks: Task[];
}

export default function Notifications({ tasks }: NotificationsProps) {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const timeDiff = dueDate.getTime() - now.getTime();
        return timeDiff > 0 && timeDiff < 5 * 60 * 1000; // 5 minutes
      });

      upcomingTasks.forEach(task => {
        const notification = new Notification('Upcoming Task', {
          body: task.text,
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      });
    }
  }, [tasks]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return null;
}
