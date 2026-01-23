import React, { useEffect, useRef } from 'react';
import { Task } from '../../lib/apiClient';
import { FiCheckCircle, FiClock, FiAlertCircle, FiActivity, FiLayers } from 'react-icons/fi';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose, tasks }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => !t.is_completed).length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const highPriority = tasks.filter(t => t.priority === 'High' && !t.is_completed).length;
  const mediumPriority = tasks.filter(t => t.priority === 'Medium' && !t.is_completed).length;
  const lowPriority = tasks.filter(t => t.priority === 'Low' && !t.is_completed).length;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-16 right-4 sm:right-20 w-80 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in"
    >
      <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FiActivity className="text-blue-400" /> Task Activity
        </h3>
      </div>

      <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {totalTasks === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
             <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
               <FiLayers className="text-gray-500" size={24} />
             </div>
             <p className="text-gray-300 font-medium">No tasks yet.</p>
             <p className="text-xs text-gray-500 mt-1">You're all clear ✨</p>
          </div>
        ) : (
          <div className="space-y-2">
             {/* Summary Card */}
             <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30">
               <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Overview</div>
               <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Total
                  </span>
                  <span className="font-bold text-white">{totalTasks}</span>
               </div>
               <div className="flex items-center justify-between text-sm mt-1">
                  <span className="flex items-center gap-2 text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Completed
                  </span>
                  <span className="font-bold text-green-400">{completedTasks}</span>
               </div>
             </div>

             {/* Pending Tasks */}
             {pendingTasks > 0 && (
               <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                 <p className="text-sm text-blue-200 flex items-center gap-2">
                   <FiClock /> 
                   <span className="font-bold">{pendingTasks}</span> tasks are still pending
                 </p>
               </div>
             )}

             {/* Priorities */}
             <div className="space-y-1 pt-1">
               {highPriority > 0 && (
                 <div className="flex items-center gap-3 p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-colors">
                   <div className="p-2 bg-red-500/20 rounded-full text-red-400">
                     <FiAlertCircle size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-200">High Priority</p>
                     <p className="text-xs text-red-300">🔥 {highPriority} tasks need attention</p>
                   </div>
                 </div>
               )}

               {mediumPriority > 0 && (
                 <div className="flex items-center gap-3 p-3 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/10 rounded-xl transition-colors">
                   <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-400">
                     <FiActivity size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-200">Medium Priority</p>
                     <p className="text-xs text-yellow-300">⚖️ {mediumPriority} tasks in progress</p>
                   </div>
                 </div>
               )}

               {lowPriority > 0 && (
                 <div className="flex items-center gap-3 p-3 bg-green-500/5 hover:bg-green-500/10 border border-green-500/10 rounded-xl transition-colors">
                   <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                     <FiCheckCircle size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-200">Low Priority</p>
                     <p className="text-xs text-green-300">🌱 {lowPriority} tasks on the list</p>
                   </div>
                 </div>
               )}
             </div>
          </div>
        )}
      </div>
      
      {totalTasks > 0 && (
        <div className="p-3 bg-gray-800/50 border-t border-gray-700/50 text-center">
          <p className="text-[10px] text-gray-500">Updates in real-time</p>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
