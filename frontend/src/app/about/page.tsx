// frontend/src/app/about/page.tsx
"use client";

import { FiGithub, FiLinkedin, FiMail, FiCode, FiAward, FiStar } from 'react-icons/fi';
import { ThemeProvider } from '@/contexts/ThemeContext';
import BackgroundLayer from '@/components/dashboard/BackgroundLayer';

function AboutContent() {
  return (
    <div className="min-h-screen text-gray-100 font-inter py-12 px-4 relative flex items-center justify-center">
      
      {/* BIG GLASS BOX CONTAINER */}
      <div className="w-full max-w-3xl bg-gray-900/40 backdrop-blur-2xl border border-gray-700/50 rounded-[2.5rem] shadow-2xl relative overflow-hidden p-8 md:p-12">
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 space-y-10">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold font-inter text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 mb-4">
              About TaskPilot
            </h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full opacity-50"></div>
          </div>

          {/* Intro Section */}
          <div className="space-y-6 text-center">
            <div className="text-gray-200 leading-relaxed max-w-2xl mx-auto space-y-4">
              <p>
                TaskPilot is engineered around a <span className="text-blue-400 font-semibold">modular multi-agent architecture</span>. This system distributes complex workflows across specialized AI agents, ensuring each operation—from language detection to intent extraction—is handled with precision and speed.
              </p>
              <p className="text-sm text-gray-400">
                By decoupling logic into Input, Intent, and execution layers, the platform achieves high reliability and a truly natural conversational interface.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
              <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl flex gap-4">
                <div className="mt-1 text-blue-400"><FiCode size={20} /></div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Modern Stack</h3>
                  <p className="text-xs text-gray-400">Built with Next.js, FastAPI, and SQLModel for speed and stability.</p>
                </div>
              </div>
              <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl flex gap-4">
                <div className="mt-1 text-blue-400"><FiAward size={20} /></div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Agent Architecture</h3>
                  <p className="text-xs text-gray-400">Uses sophisticated AI agents to manage your workflows naturally.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Creator Section */}
          <div className="pt-8 border-t border-gray-700/50">
            <div className="flex flex-col items-center gap-4 text-center">
              <div>
                <h2 className="text-xl font-bold text-white font-space-grotesk">Yusra Fatima</h2>
                <p className="text-blue-400 text-sm font-medium italic">Creator & Lead Developer</p>
              </div>
              <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
                TaskPilot was born from a vision to simplify daily chores through intelligent automation. 
                Focusing on clean UX and practical AI, this project demonstrates the power of modern web technologies.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="https://github.com/Usrafatima"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all group"
            >
              <FiGithub size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-gray-300 group-hover:text-white">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/yusra-fatima-245967366/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all group"
            >
              <FiLinkedin size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-gray-300 group-hover:text-white">LinkedIn</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <ThemeProvider>
      <BackgroundLayer />
      <AboutContent />
    </ThemeProvider>
  );
}