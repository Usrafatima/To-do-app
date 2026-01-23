// frontend/src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, FiClock, FiCheckCircle, FiCircle, FiCalendar, FiEdit2, FiTrash2, FiSearch, 
  FiFilter, FiMoreHorizontal, FiRepeat, FiBell, FiChevronDown, FiZap, FiTarget, FiX 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast'; 
import Link from 'next/link';

// Import API functions and Task interface from apiClient
import { 
  getTasks,
  Task, 
} from '../../lib/apiClient';
import Chatbot from '../../components/chatbot/Chatbot';

// Theme Imports
import { ThemeProvider } from '@/contexts/ThemeContext';
import BackgroundLayer from '@/components/dashboard/BackgroundLayer';
import Sidebar from '@/components/dashboard/Sidebar';
import AudioLayer from '@/components/dashboard/AudioLayer';
import { useAuth } from '@/contexts/AuthContext'; 
import { useTasks } from '@/contexts/TaskContext';

// --- Components ---

// 1. Task Card Component
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onTriggerReminder: (id: string) => void;
  isFocusMode?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete, onTriggerReminder, isFocusMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);

  return (
    <div 
      className={`group relative bg-gray-800/40 border border-gray-700/30 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-600 hover:-translate-y-0.5 ${task.is_completed ? 'opacity-50' : ''} ${isFocusMode ? 'scale-105 border-blue-500/30 shadow-blue-500/10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Status Circle */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0 text-gray-500 hover:text-green-400 transition-colors duration-200 focus:outline-none"
          aria-label={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.is_completed ? (
            <FiCheckCircle size={22} className="text-green-500" />
          ) : (
            <FiCircle size={22} />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={`font-inter text-lg font-medium text-gray-100 truncate pr-2 ${task.is_completed ? 'line-through text-gray-500' : ''} ${isFocusMode ? 'text-2xl' : ''}`}>
              {task.text}
            </h3>
            {/* Actions (Only on hover) */}
            <div className={`flex items-center space-x-1 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
               <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-blue-400 rounded-md hover:bg-gray-700 transition-colors">
                <FiEdit2 size={16} />
              </button>
              <button onClick={() => onDelete(task.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-md hover:bg-gray-700 transition-colors">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={`font-inter text-gray-400 mt-1 line-clamp-2 ${isFocusMode ? 'text-base' : 'text-sm'}`}>{task.description}</p>
          )}

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyle}`}>
              {task.priority}
            </span>

            {task.dueDate && (
              <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${new Date(task.dueDate) < new Date() && !task.is_completed ? 'text-red-400 border-red-400/20 bg-red-400/5' : 'text-gray-400 border-gray-700 bg-gray-800/50'}`}>
                <FiCalendar className="mr-1.5" size={12} />
                {task.dueDate}
              </span>
            )}

            {task.isRecurring && (
               <span className="flex items-center text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20" title="Recurring Task">
                 <FiRepeat size={12} className="mr-1" /> Recurring
               </span>
            )}

            <button 
              onClick={() => onTriggerReminder(task.id)}
              className="text-gray-500 hover:text-yellow-400 transition-colors p-0.5"
              title="Trigger Reminder"
            >
              <FiBell size={14} />
            </button>

            {task.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-md text-xs bg-gray-700/50 text-gray-400 border border-gray-600/30">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Add Task Section Component
interface AddTaskProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  editingTask: Task | null;
  onUpdateTask: (task: Task) => void;
  onCancelEdit: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(editingTask?.text || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(editingTask?.priority || 'Medium');
  const [category, setCategory] = useState<Task['category']>(editingTask?.category || 'Work');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [tags, setTags] = useState(editingTask?.tags.join(', ') || '');
  const [isRecurring, setIsRecurring] = useState(editingTask?.isRecurring || false);

  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate);
      setTags(editingTask.tags.join(', '));
      setIsRecurring(editingTask.isRecurring || false);
      setIsFocused(true); 
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setText('');
    setDescription('');
    setPriority('Medium');
    setCategory('Work');
    setDueDate('');
    setTags('');
    setIsRecurring(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && !text && !editingTask) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [text, editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const taskData: Omit<Task, 'id'> = {
        text,
        description: description || undefined,
        priority,
        category,
        dueDate,
        isRecurring,
        is_completed: false,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      };

      if (editingTask) {
        onUpdateTask({ ...editingTask, ...taskData, id: editingTask.id, is_completed: editingTask.is_completed });
      } else {
        onAddTask(taskData);
      }
      resetForm();
      if (!editingTask) setIsFocused(false); 
      if (editingTask) onCancelEdit();
    }
  };

  return (
    <form 
      ref={containerRef}
      onSubmit={handleSubmit} 
      className={`bg-gray-800/60 rounded-2xl border border-gray-700/50 shadow-lg transition-all duration-300 overflow-hidden ${isFocused ? 'ring-2 ring-blue-500/50' : 'hover:border-gray-600'}`}
    >
      <div className="p-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="What do you want to get done today?"
          className="w-full p-4 bg-transparent text-lg font-medium text-white placeholder-gray-500 focus:outline-none"
          required
        />
      </div>

      <div className={`px-4 pb-4 space-y-4 transition-all duration-300 ease-in-out ${isFocused ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description..."
          rows={2}
          className="w-full p-2 bg-gray-900/50 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none border border-transparent focus:border-gray-700 resize-none"
        ></textarea>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="appearance-none bg-gray-700 text-xs font-medium text-gray-300 py-1.5 pl-3 pr-8 rounded-full focus:outline-none cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Task['category'])}
              className="appearance-none bg-gray-700 text-xs font-medium text-gray-300 py-1.5 pl-3 pr-8 rounded-full focus:outline-none cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>

          <div className="relative flex items-center">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-700 text-xs font-medium text-gray-300 py-1.5 px-3 rounded-full focus:outline-none cursor-pointer hover:bg-gray-600 transition-colors"
            />
          </div>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags"
            className="bg-gray-700 text-xs font-medium text-gray-300 py-1.5 px-3 rounded-full focus:outline-none placeholder-gray-500 min-w-[100px]"
          />

          <button
            type="button"
            onClick={() => setIsRecurring(!isRecurring)}
            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isRecurring ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          >
            <FiRepeat className="mr-1.5" size={12} /> Repeat
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
          {editingTask ? (
             <button
              type="button"
              onClick={onCancelEdit}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          ) : <span></span>}
          
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            {editingTask ? 'Save Changes' : 'Add Task'} <FiPlus className="ml-2" />
          </button>
        </div>
      </div>
    </form>
  );
};


// 3. Main Dashboard Content
function DashboardContent() {
  const { user } = useAuth();
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskCompletion, refreshTasks } = useTasks();

  // UI State
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showEmptyDetails, setShowEmptyDetails] = useState(false);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Task['priority']>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'text'>('dueDate');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (searchTerm && !task.text.toLowerCase().includes(searchTerm.toLowerCase()) && !task.description?.toLowerCase().includes(searchTerm.toLowerCase()) && !task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      if (filterStatus !== 'all' && (filterStatus === 'completed' !== task.is_completed)) {
        return false;
      }
      if (filterPriority !== 'all' && filterPriority !== task.priority) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'text') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updatedTask = await toggleTaskCompletion(id, !task.is_completed);
    if (updatedTask) {
        toast.success(updatedTask.is_completed ? 'Task completed!' : 'Task active again');
    }
  };

  const handleEditTask = (taskToEdit: Task) => {
    setEditingTask(taskToEdit);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleUpdateTask = async (updatedTaskData: Task) => {
    const updatedTask = await updateTask(updatedTaskData);
    if (updatedTask) {
        toast.success('Task updated!');
        setEditingTask(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTask(id);
    if (success) {
        toast.success('Task deleted successfully.');
    }
  };

  const handleAddTask = async (newTaskData: Omit<Task, 'id'>) => {
    const createdTask = await addTask(newTaskData);
    if (createdTask) {
        toast.success('Task created!');
    }
  };

  const handleTriggerReminder = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast(`Reminder set for: ${task.text}`);
      if (Notification.permission === "granted") {
        const n = new Notification("TaskPilot", { body: `Reminder: ${task.text}` });
        n.onclick = () => { window.focus(); n.close(); };
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
             const n = new Notification("TaskPilot", { body: `Reminder: ${task.text}` });
             n.onclick = () => { window.focus(); n.close(); };
          }
        });
      }
    }
  };

  const pendingCount = filteredAndSortedTasks.filter(t => !t.is_completed).length;
  const highPriorityCount = filteredAndSortedTasks.filter(t => t.priority === 'High' && !t.is_completed).length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen text-gray-100 font-inter relative flex items-center justify-center p-4 z-10">
      <main className="w-full max-w-5xl flex justify-center">
        
      {/* BIG GLASS BOX CONTAINER */}
      <div className={`w-full max-w-4xl bg-gray-900/40 backdrop-blur-2xl border border-gray-700/50 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out ${isFocusMode ? 'scale-105' : ''}`}>
          
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />

          {/* Dynamic Greeting Header (Hidden in Focus Mode) */}
          {!isFocusMode && (
            <div className="mb-8 pl-2 relative z-10">
              <h1 className="text-3xl font-bold font-space-grotesk text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {getGreeting()}, {user ? user.name.split(' ')[0] : 'Guest'} ☀️
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                You have <span className="text-white font-semibold">{highPriorityCount} high-priority</span> tasks remaining.
              </p>
            </div>
          )}

          {/* Focus Mode Toggle */}
          <div className="absolute top-6 right-6 z-20">
            <button 
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`p-2 rounded-full transition-all ${isFocusMode ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : 'bg-gray-800/50 text-gray-400 hover:text-white'}`}
              title="Toggle Focus Mode"
            >
              {isFocusMode ? <FiX size={20} /> : <FiTarget size={20} />}
            </button>
          </div>

          {/* Add Task Section */}
          {!isFocusMode && (
            <section className="mb-10 relative z-10">
              <AddTask
                onAddTask={handleAddTask}
                editingTask={editingTask}
                onUpdateTask={handleUpdateTask}
                onCancelEdit={handleCancelEdit}
              />
            </section>
          )}

          {/* Control Bar */}
          {!isFocusMode && (
            <section className="mb-8 relative z-10 flex flex-col md:flex-row gap-4 items-center justify-start">
              <div className="relative w-full md:w-80 group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/60 backdrop-blur-sm text-sm border border-gray-700/50 text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar ml-0 md:ml-2">
                <div className="relative flex-shrink-0">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="appearance-none bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-xs font-medium py-2 pl-3 pr-8 rounded-full hover:bg-gray-700/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
                </div>

                <div className="relative flex-shrink-0">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    className="appearance-none bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-xs font-medium py-2 pl-3 pr-8 rounded-full hover:bg-gray-700/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
                </div>

                <div className="relative flex-shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-xs font-medium py-2 pl-3 pr-8 rounded-full hover:bg-gray-700/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="dueDate">Sort: Date</option>
                    <option value="priority">Sort: Priority</option>
                    <option value="text">Sort: A-Z</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
                </div>

                <span className="text-gray-200 text-xs font-medium whitespace-nowrap ml-2">
                  {pendingCount} {pendingCount === 1 ? 'task' : 'tasks'} remaining
                </span>
              </div>
            </section>
          )}

          {/* Task List Section */}
          <section className="relative z-10">
            {loading && (
              <div className="flex justify-end mb-4 px-1">
                <span className="text-xs text-blue-400 animate-pulse font-medium uppercase tracking-widest">Syncing</span>
              </div>
            )}

            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
              {(isFocusMode ? filteredAndSortedTasks.filter(t => !t.is_completed).slice(0, 1) : filteredAndSortedTasks).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onTriggerReminder={handleTriggerReminder}
                  isFocusMode={isFocusMode}
                />
              ))}
              {filteredAndSortedTasks.length === 0 && !loading && (
                <div className="w-full flex flex-col items-center justify-center py-10 transition-all duration-500">
                  {!showEmptyDetails ? (
                    <button 
                      onClick={() => setShowEmptyDetails(true)}
                      className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                    >
                      <span className="text-blue-400 animate-pulse">✨</span>
                      <span className="text-gray-200 text-sm font-medium tracking-wide">All tasks caught up.</span>
                      <span className="text-xs text-gray-500 group-hover:text-blue-400 flex items-center gap-1 ml-2 transition-colors">
                        View Details <FiChevronDown />
                      </span>
                    </button>
                  ) : (
                    <div className="animate-scale-in flex flex-col items-center justify-center p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] text-center w-full relative">
                      <button 
                        onClick={() => setShowEmptyDetails(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                      >
                        <FiX size={18} />
                      </button>
                      <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <FiCheckCircle size={32} className="text-green-500/50" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">You're all caught up!</h3>
                      <p className="text-gray-300 text-sm mt-1 max-w-xs leading-relaxed">
                        No tasks found matching your criteria. Take a break or add a new task above.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Chatbot onTaskActionCompleted={refreshTasks} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <BackgroundLayer />
      <AudioLayer />
      <Sidebar />
      <DashboardContent />
    </ThemeProvider>
  );
}