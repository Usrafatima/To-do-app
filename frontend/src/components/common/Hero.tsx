"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiCheckCircle } from 'react-icons/fi';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-900 text-white px-4 py-16 overflow-hidden">
      
      {/* Dynamic Background Blobs with Mouse Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none text-white">
        <div 
          className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
        <div 
          className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"
          style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
        />
        <div 
          className="absolute top-[40%] left-[50%] w-[25rem] h-[25rem] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000"
          style={{ transform: `translate(${mousePos.y}px, ${mousePos.x}px)` }}
        />
      </div>

      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left: Content - Original Settings Restored */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-space-grotesk font-bold leading-tight mb-6 animate-fade-in-up">
            Organize Your Chaos. Master Your Day. TaskPilot.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg animate-fade-in-up animation-delay-500">
            TaskPilot is your AI-powered companion designed to streamline your workflow and boost productivity. Focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-1000">
            <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-inter font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center">
              Get Started
            </Link>
            <Link href="/login" className="px-8 py-3 border border-gray-600 text-gray-200 rounded-full text-lg font-inter font-medium hover:bg-gray-700/30 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
              Login
            </Link>
          </div>
        </div>

        {/* Right: Visual Experience - Enhanced Orbital Mockup Kept */}
        <div className="lg:w-1/2 flex items-center justify-center animate-fade-in-up animation-delay-1500 perspective-1000">
          <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 rounded-full filter blur-[60px] animate-pulse" />
            
            {/* Task Card: Discovery */}
            <div 
              className="absolute w-36 h-20 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl flex flex-col p-4 animate-orbital-card"
              style={{ 
                '--initial-x': '-150%', '--initial-y': '-100%', '--initial-rotate': '-15deg',
                '--mid-x': '-120%', '--mid-y': '-20%', '--mid-rotate': '5deg',
                '--target-x': '-80%', '--target-y': '20%', '--target-rotate': '-10deg'
              } as any}
            >
              <div className="w-8 h-2 bg-blue-500/40 rounded-full mb-3" />
              <div className="w-16 h-2 bg-gray-700 rounded-full" />
            </div>

            {/* Task Card: Plan */}
            <div 
              className="absolute w-36 h-20 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl flex flex-col p-4 animate-orbital-card animation-delay-1500"
              style={{ 
                '--initial-x': '150%', '--initial-y': '-80%', '--initial-rotate': '15deg',
                '--mid-x': '120%', '--mid-y': '10%', '--mid-rotate': '-5deg',
                '--target-x': '80%', '--target-y': '-20%', '--target-rotate': '10deg'
              } as any}
            >
              <div className="w-8 h-2 bg-purple-500/40 rounded-full mb-3" />
              <div className="w-16 h-2 bg-gray-700 rounded-full" />
            </div>

            {/* Task Card: Do */}
            <div 
              className="absolute w-36 h-20 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl flex flex-col p-4 animate-orbital-card animation-delay-3000"
              style={{ 
                '--initial-x': '-100%', '--initial-y': '150%', '--initial-rotate': '10deg',
                '--mid-x': '-20%', '--mid-y': '120%', '--mid-rotate': '-5deg',
                '--target-x': '20%', '--target-y': '80%', '--target-rotate': '5deg'
              } as any}
            >
              <div className="w-8 h-2 bg-cyan-500/40 rounded-full mb-3" />
              <div className="w-16 h-2 bg-gray-700 rounded-full" />
            </div>

            {/* Success Card: Done */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col items-center justify-center p-6 animate-orbital-done animation-delay-4500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent" />
              <FiCheckCircle size={40} className="text-green-400 mb-3 drop-shadow-glow" />
              <span className="font-space-grotesk text-xl font-bold text-white tracking-tight">Mission Accomplished</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}