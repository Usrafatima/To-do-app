"use client";

import { useState } from "react";

interface AddTaskProps {
  onAddTask: (text: string) => void;
}

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
