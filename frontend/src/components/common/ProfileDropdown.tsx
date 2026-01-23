// frontend/src/components/common/ProfileDropdown.tsx

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiLogOut, FiSettings } from 'react-icons/fi';

interface User {
  name?: string;
  email?: string;
  profile_picture_url?: string;
}

interface ProfileDropdownProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, isOpen, onClose, onLogout }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-12 right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 origin-top-right transition-transform transform scale-95 opacity-0 animate-scale-in"
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <img
            src={user.profile_picture_url || '/default-avatar.svg'} // Use the new SVG avatar
            alt="Profile"
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.svg';
            }}
          />
          <div className="ml-4">
            <p className="font-semibold text-white">{user.name || 'User'}</p>
            <p className="text-sm text-gray-400">{user.email || 'username'}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
        >
          <FiSettings className="mr-3" />
          Settings
        </Link>
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
        >
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;