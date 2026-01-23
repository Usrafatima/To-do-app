
"use client";

import { FiSearch } from "react-icons/fi";

interface FilterControlsProps {
  onSearch: (query: string) => void;
  onFilterByStatus: (status: 'all' | 'completed' | 'incomplete') => void;
  onFilterByPriority: (priority: 'all' | 'High' | 'Medium' | 'Low') => void;
  onSort: (sortBy: 'dueDate' | 'priority' | 'alphabetical') => void;
}

export default function FilterControls({ onSearch, onFilterByStatus, onFilterByPriority, onSort }: FilterControlsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
      <div className="relative flex-grow">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <select
          onChange={(e) => onFilterByStatus(e.target.value as 'all' | 'completed' | 'incomplete')}
          className="bg-gray-800 border border-gray-700 rounded-md pl-3 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <select
          onChange={(e) => onFilterByPriority(e.target.value as 'all' | 'High' | 'Medium' | 'Low')}
          className="bg-gray-800 border border-gray-700 rounded-md pl-3 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          onChange={(e) => onSort(e.target.value as 'dueDate' | 'priority' | 'alphabetical')}
          className="bg-gray-800 border border-gray-700 rounded-md pl-3 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="alphabetical">Sort Alphabetically</option>
        </select>
      </div>
    </div>
  );
}
