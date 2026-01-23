"use client";

import { Task } from "@/lib/apiClient";
import { useState } from "react";
import { FiX } from "react-icons/fi";

interface EditTaskModalProps {
  task: Task;
  onUpdateTask: (id: any, updates: Partial<Task>) => void;
  onClose: () => void;
}

export default function EditTaskModal({ task, onUpdateTask, onClose }: EditTaskModalProps) {
  const [text, setText] = useState(task.text);
  const [priority, setPriority] = useState<Task['priority']>(task.priority);
  const [tags, setTags] = useState(task.tags?.join(", ") || "");
  const [recurrence, setRecurrence] = useState<'daily' | 'weekly' | 'monthly' | ''>(task.recurrence?.type || '');
  const [due_date, setDueDate] = useState(task.due_date || task.dueDate || "");
  const [isClosing, setIsClosing] = useState(false);

  const handleSave = () => {
    const updatedTags = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
    const updatedRecurrence = recurrence ? { type: recurrence as 'daily' | 'weekly' | 'monthly' | '' } : undefined;
    
    onUpdateTask(task.id, { 
      text, 
      priority, 
      tags: updatedTags, 
      recurrence: updatedRecurrence, 
      due_date: due_date || undefined,
      dueDate: due_date
    });
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the duration of the closing animation
  };
  
  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isClosing ? 'bg-opacity-0' : 'bg-opacity-50'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div className={`bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 id="edit-task-title" className="text-2xl font-bold text-white">Edit Task</h2>
          <button onClick={handleClose} aria-label="Close" className="text-gray-400 hover:text-white">
            <FiX size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="task-text" className="block text-sm font-medium text-gray-400 mb-1">Task</label>
            <input
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="due-date" className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
            <input
              id="due-date"
              type="datetime-local"
              value={due_date}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-1">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="recurrence" className="block text-sm font-medium text-gray-400 mb-1">Recurrence</label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as 'daily' | 'weekly' | 'monthly' | '')}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}