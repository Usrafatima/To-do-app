// frontend/src/app/settings/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { 
  FiUser, FiShield, FiInfo, FiLogOut, FiRefreshCw, FiChevronRight, 
  FiBell, FiMoon, FiGlobe, FiGithub 
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

// Theme Imports (To keep background consistent)
import { ThemeProvider } from '@/contexts/ThemeContext';
import BackgroundLayer from '@/components/dashboard/BackgroundLayer';

function SettingsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'about'>('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Load preferences
  useEffect(() => {
    const saved = localStorage.getItem('email_notifications');
    if (saved !== null) {
      setEmailNotifications(saved === 'true');
    }
  }, []);

  const toggleNotifications = () => {
    const newVal = !emailNotifications;
    setEmailNotifications(newVal);
    localStorage.setItem('email_notifications', String(newVal));
    toast.success(`Email notifications ${newVal ? 'enabled' : 'disabled'}`);
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  const handleReSyncGoogle = () => {
    toast('Re-syncing Google account data (feature not yet implemented).');
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'account', label: 'Account', icon: FiShield },
    { id: 'about', label: 'About', icon: FiInfo },
  ];

  return (
    <div className="min-h-screen text-gray-100 font-inter py-12 px-4 relative flex items-center justify-center">
      
      {/* BIG GLASS BOX CONTAINER */}
      <div className="w-full max-w-4xl bg-gray-900/40 backdrop-blur-2xl border border-gray-700/50 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />

        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-700/50 p-6 relative z-10 bg-gray-900/20">
          <h1 className="text-2xl font-bold font-space-grotesk text-white mb-8 ml-2">Settings</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {activeTab === item.id && <FiChevronRight size={16} />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-10 md:pt-40">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <FiLogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 md:p-12 relative z-10 overflow-y-auto">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-8 font-space-grotesk">Profile Settings</h2>
              <div className="flex flex-col items-center md:items-start md:flex-row gap-8 mb-10">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 shadow-xl">
                    <Image
                      src={user.profile_picture_url || '/default-avatar.svg'}
                      alt="Profile"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.svg';
                      }}
                    />
                  </div>
                </div>
                <div className="text-center md:text-left pt-2">
                  <p className="text-2xl font-bold text-white mb-1">{user.name}</p>
                  <p className="text-gray-400 mb-4">{user.email}</p>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">
                    Free Member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg text-gray-300"><FiBell size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-white">Email Notifications</p>
                      <p className="text-xs text-gray-500">Stay updated on your task progress.</p>
                    </div>
                  </div>
                  <div 
                    onClick={toggleNotifications}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${emailNotifications ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${emailNotifications ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-8 font-space-grotesk">Account Security</h2>
              <p className="text-gray-400 text-sm mb-8">Manage your linked accounts and authentication settings.</p>
              
              <div className="space-y-4">
                <div className="p-6 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-700/50 rounded-lg text-gray-300"><FiGlobe size={18} /></div>
                      <p className="text-sm font-bold text-white">Google Authentication</p>
                    </div>
                    <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20 uppercase">Linked</span>
                  </div>
                  <button
                    onClick={handleReSyncGoogle}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-200 text-sm font-bold rounded-xl transition-all"
                  >
                    <FiRefreshCw size={16} /> Re-sync Account Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-8 font-space-grotesk">About TaskPilot</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-800/30 border border-gray-700/50 rounded-2xl space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Version</span>
                    <span className="text-gray-300 font-bold">v1.0.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Developer</span>
                    <span className="text-gray-300 font-bold">Yusra Fatima</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Architecture</span>
                    <span className="text-gray-300 font-bold">Next.js + FastAPI</span>
                  </div>
                </div>

                <a
                  href="https://github.com/Usrafatima"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl group transition-all hover:bg-blue-600/20"
                >
                  <div className="flex items-center gap-3">
                    <FiGithub className="text-blue-400" size={24} />
                    <div>
                      <p className="text-sm font-bold text-white">View Project on GitHub</p>
                      <p className="text-xs text-blue-400/70 italic">Check out the documentation and source code.</p>
                    </div>
                  </div>
                  <FiChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ThemeProvider>
      <BackgroundLayer />
      <SettingsContent />
    </ThemeProvider>
  );
}