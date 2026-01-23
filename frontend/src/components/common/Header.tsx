"use client";

import Link from 'next/link';
import { useState } from 'react';
import { IoSparklesOutline } from 'react-icons/io5';
import { FiBell, FiMenu, FiClock } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import FocusTimerModal from '../dashboard/FocusTimerModal';
import NotificationDropdown from './NotificationDropdown';

export default function Header() {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isTimerOpen, setTimerOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const pendingCount = tasks.filter(t => !t.is_completed).length;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <FocusTimerModal isOpen={isTimerOpen} onClose={() => setTimerOpen(false)} />
      
      <header className="sticky top-0 z-50 w-full bg-gray-900/40 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          
          {/* Left side: Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <IoSparklesOutline size={20} className="text-white" />
            </div>
            <span className="font-inter text-xl font-bold tracking-tight text-white">TaskPilot</span>
          </Link>

          {/* Right side: Navigation */}
          <nav className="flex items-center space-x-2 md:space-x-6">
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/about" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                About
              </Link>
              {user && (
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                  Dashboard
                </Link>
              )}
            </div>

            {/* Visual Separator */}
            <div className="h-4 w-px bg-gray-700 hidden md:block"></div>

            {/* Focus Timer Icon */}
            <button 
              onClick={() => setTimerOpen(true)}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors relative group"
              title="Focus Timer"
            >
              <FiClock size={20} />
            </button>

            {/* Notification Icon & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationOpen(!isNotificationOpen)}
                className={`p-2 transition-colors relative ${isNotificationOpen ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <FiBell size={20} />
                {pendingCount > 0 && (
                  <div className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center bg-blue-500 rounded-full text-[10px] font-bold text-white px-1 shadow-sm border border-gray-900">
                    {pendingCount}
                  </div>
                )}
              </button>
              <NotificationDropdown 
                isOpen={isNotificationOpen} 
                onClose={() => setNotificationOpen(false)} 
                tasks={tasks} 
              />
            </div>

            {/* Profile Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
                    <img
                      src={user.profile_picture_url || '/default-avatar.svg'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.svg';
                      }}
                    />
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-gray-200">{user.name.split(' ')[0]}</span>
                </button>
                {isDropdownOpen && (
                  <ProfileDropdown
                    user={user}
                    isOpen={isDropdownOpen}
                    onClose={() => setDropdownOpen(false)}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
