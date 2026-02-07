
"use client";

import { Task } from "@/lib/apiClient";
import { useState } from "react";
import { FiEdit, FiTrash2, FiCheck, FiTag, FiFlag } from "react-icons/fi";
import EditTaskModal from "./EditTaskModal";

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: any, updates: Partial<Task>) => void;
  onDeleteTask: (id: any) => void;
}

export default function TaskItem({ task, onUpdateTask, onDeleteTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityTextColorClass = (priority?: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <article className={`bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 hover:bg-gray-700/80 transform hover:-translate-y-1`}>
        <div className="flex flex-col sm:flex-row items-start">
          <button
            onClick={() => onUpdateTask(task.id, { is_completed: !task.is_completed })}
            aria-label={task.is_completed ? "Mark task as incomplete" : "Mark task as complete"}
            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0 sm:mr-4 mb-2 sm:mb-0 mt-1 ${task.is_completed ? 'border-green-500 bg-green-500' : 'border-gray-600 hover:border-green-500'}`}
          >
            {task.is_completed && <FiCheck className="w-4 h-4 text-white mx-auto" aria-hidden="true" />}
          </button>

          <div className="flex-grow w-full">
            <h3 className={`text-lg transition-all duration-200 ${task.is_completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {task.text}
            </h3>

            <div className="text-sm text-gray-400 mt-1">
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-auto sm:ml-4 mt-2 sm:mt-0">
            <button onClick={() => setIsEditing(true)} aria-label="Edit task" className="text-gray-400 hover:text-blue-400 transition-colors">
              <FiEdit size={20} />
            </button>
            <button onClick={() => onDeleteTask(task.id)} aria-label="Delete task" className="text-gray-400 hover:text-red-400 transition-colors">
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4 flex-wrap">
            {task.tags?.map(tag => (
              <div key={tag} className="flex items-center bg-gray-700 px-2 py-1 rounded-md mb-2 sm:mb-0">
                <FiTag className="mr-2 text-gray-400" size={12} aria-hidden="true" />
                <span className="text-xs text-gray-300">{tag}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            {task.priority && (
              <div className="flex items-center">
                <FiFlag className={`mr-2 ${getPriorityTextColorClass(task.priority)}`} aria-hidden="true" />
                <span className="text-sm font-medium">{task.priority}</span>
              </div>
            )}
          </div>
        </div>
      </article>
      {isEditing && (
        <EditTaskModal
          task={task}
          onUpdateTask={onUpdateTask}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
