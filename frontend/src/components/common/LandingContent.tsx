import React from 'react';
import { FiCheckCircle, FiMusic, FiLayout, FiMessageSquare, FiMic } from 'react-icons/fi';

const LandingContent = () => {
  return (
    <div className="bg-gray-900 text-gray-100 font-inter selection:bg-blue-500/30">
      
      {/* SECTION 1: Problem & Reassurance */}
      <section className="pt-24 pb-12 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-gray-400 text-lg md:text-xl font-medium mb-4 italic">
          "Have you been stuck in chores and didn’t know where to start?"
        </h2>
        <p className="text-3xl md:text-5xl font-bold font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          If you are, you’re in the right place. <br />
          <span className="text-blue-400">Welcome to TaskPilot.</span>
        </p>
      </section>

      {/* SECTION 2: Introduction */}
      <section className="pt-0 pb-12 px-4 max-w-3xl mx-auto text-center border-b border-gray-800/50 pb-24">
        <h3 className="text-2xl font-semibold mb-6 font-space-grotesk text-white">Clarity for Your Daily Life</h3>
        <p className="text-gray-400 leading-relaxed text-lg">
          TaskPilot is a supportive workspace created to help you navigate your responsibilities with ease. 
          It simplifies your productivity through a calm, intentional interface that prioritizes your 
          peace of mind as much as your performance.
        </p>
      </section>

      {/* SECTION 3: Core Features (Cards) */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group p-8 bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:-translate-y-2">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <FiCheckCircle size={24} />
            </div>
            <h4 className="text-xl font-bold mb-4 text-white">Effortless Management</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Control your schedule with simple actions. TaskPilot allows you to add, update, and organize 
              your daily requirements within seconds, keeping your list accurate and your mind free from 
              unnecessary complexity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:-translate-y-2">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <FiMusic size={24} />
            </div>
            <h4 className="text-xl font-bold mb-4 text-white">Ambient Soundscapes</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enhance your concentration with integrated ambient audio. Select from natural sounds 
              designed to block out environmental distractions and foster a sense of deep focus 
              while you work on your most important tasks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:-translate-y-2">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <FiLayout size={24} />
            </div>
            <h4 className="text-xl font-bold mb-4 text-white">Minimalist Aesthetic</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Navigate a workspace built on the principles of clarity. A clean, modern layout 
              combined with smooth animations ensures that you can focus on what needs to be 
              done without the burden of digital clutter.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: Chatbot (Main Highlight) */}
      <section className="py-24 px-4 max-w-5xl mx-auto bg-blue-600/5 rounded-[3rem] border border-blue-500/10 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10"></div>
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk text-white">An Intelligent Assistant at Your Side</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            TaskPilot includes an AI-powered assistant designed to make task management feel like a conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Chat Features */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 text-blue-400"><FiMessageSquare size={24} /></div>
              <div>
                <h5 className="text-lg font-bold text-white mb-2">Conversational Control</h5>
                <p className="text-gray-400 text-sm">
                  Manage tasks through natural language. Simply ask to add, update, or delete items. 
                  Supported in <span className="text-blue-300">English, Urdu, and Roman Urdu</span>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-blue-400"><FiMic size={24} /></div>
              <div>
                <h5 className="text-lg font-bold text-white mb-2">Voice Support</h5>
                <p className="text-gray-400 text-sm">
                  Integrated speech-to-text functionality allows you to stay productive hands-free. 
                  It is a fast, natural, and human-friendly way to maintain your momentum.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Placeholder for Chatbot */}
          <div className="bg-gray-800/60 p-6 rounded-3xl border border-gray-700/50 shadow-inner relative z-10">
            <div className="space-y-4">
              <div className="bg-blue-600/20 text-blue-300 p-3 rounded-2xl rounded-bl-none max-w-[80%] text-xs">
                "Task add karo: Buy groceries today at 5pm"
              </div>
              <div className="bg-gray-700/50 text-gray-300 p-3 rounded-2xl rounded-br-none ml-auto max-w-[80%] text-xs border border-gray-600/30">
                ✅ Done! Groceries added to your list.
              </div>
              <div className="bg-blue-600/20 text-blue-300 p-3 rounded-2xl rounded-bl-none max-w-[80%] text-xs">
                "Mark it as complete"
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingContent;
