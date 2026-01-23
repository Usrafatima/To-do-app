"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function BackgroundLayer() {
  const { settings } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  interface ThemeConfigItem {
    image: string;
    overlay: string;
    animation?: string;
  }

  const THEME_CONFIG: Record<string, ThemeConfigItem> = {
    gradient: { image: "", overlay: "gradient" },
    particles: { image: "", overlay: "particles" },
    rain: {
      image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      overlay: "rain",
      animation: "none"
    },
    anime: {
      image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      overlay: "particles",
      animation: "pan"
    },
    forest: {
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      overlay: "mist",
      animation: "zoom"
    },
    city: {
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      overlay: "neon",
      animation: "pan"
    },
    clouds: {
      image: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      overlay: "clouds",
      animation: "float"
    }
  };

  const config = THEME_CONFIG[settings.animationType];

  return (
    <>
      <style jsx global>{`
        @keyframes rotate3D {
          from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        
        .prism-container { perspective: 1200px; }
        .prism {
          width: 260px;
          height: 260px;
          position: absolute;
          transform-style: preserve-3d;
          animation: rotate3D 30s linear infinite;
        }
        .prism div {
          position: absolute;
          width: 260px;
          height: 260px;
          border: 2px solid var(--p-color);
          background: var(--p-bg);
          backdrop-filter: blur(4px);
          box-shadow: 0 0 20px var(--p-glow), inset 0 0 15px var(--p-glow);
          filter: drop-shadow(0 0 10px var(--p-glow));
        }
        .p-cyan { --p-color: rgba(6, 182, 212, 0.5); --p-bg: rgba(6, 182, 212, 0.03); --p-glow: rgba(6, 182, 212, 0.3); }
        .p-purple { --p-color: rgba(168, 85, 247, 0.5); --p-bg: rgba(168, 85, 247, 0.03); --p-glow: rgba(168, 85, 247, 0.3); }
        .p-blue { --p-color: rgba(59, 130, 246, 0.5); --p-bg: rgba(59, 130, 246, 0.03); --p-glow: rgba(59, 130, 246, 0.3); }

        .front  { transform: translateZ(130px); }
        .back   { transform: rotateY(180deg) translateZ(130px); }
        .right  { transform: rotateY(90deg) translateZ(130px); }
        .left   { transform: rotateY(-90deg) translateZ(130px); }
        .top    { transform: rotateX(90deg) translateZ(130px); }
        .bottom { transform: rotateX(-90deg) translateZ(130px); }
      `}</style>

      <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
        
        {/* NEON PRISM FRAME (Default State) */}
        {settings.bgType === 'none' && (
          <div className="absolute inset-0 prism-container overflow-hidden pointer-events-none">
            
            {/* Top Left - Cyan */}
            <div className="prism p-cyan scale-125 transition-transform duration-700 ease-out opacity-70"
              style={{ top: '5%', left: '5%', transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotateX(${mousePos.y * 0.1}deg)` }}>
              <div className="front"></div><div className="back"></div><div className="right"></div><div className="left"></div><div className="top"></div><div className="bottom"></div>
            </div>

            {/* Bottom Right - Purple */}
            <div className="prism p-purple scale-[1.8] transition-transform duration-1000 ease-out opacity-50"
              style={{ bottom: '5%', right: '5%', transform: `translate(${-mousePos.x}px, ${-mousePos.y}px) rotateY(${mousePos.x * 0.1}deg)` }}>
              <div className="front"></div><div className="back"></div><div className="right"></div><div className="left"></div><div className="top"></div><div className="bottom"></div>
            </div>

            {/* Top Right - Blue */}
            <div className="prism p-blue scale-90 transition-transform duration-500 ease-out opacity-60"
              style={{ top: '10%', right: '10%', transform: `translate(${mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)` }}>
              <div className="front"></div><div className="back"></div><div className="right"></div><div className="left"></div><div className="top"></div><div className="bottom"></div>
            </div>

            {/* Bottom Left - Cyan (Smaller) */}
            <div className="prism p-cyan scale-75 transition-transform duration-1000 ease-out opacity-40"
              style={{ bottom: '15%', left: '15%', transform: `translate(${-mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}>
              <div className="front"></div><div className="back"></div><div className="right"></div><div className="left"></div><div className="top"></div><div className="bottom"></div>
            </div>

          </div>
        )}

        {/* 1. Base Layer (Static or High-Res Image) */}
        {settings.bgType === 'static' && (
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${settings.blur ? 'blur-sm' : ''}`}
            style={{ backgroundImage: `url(${settings.bgImage})`, opacity: settings.opacity }}
          />
        )}

        {/* 2. Animated Backgrounds */}
        {settings.bgType === 'animated' && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${settings.blur ? 'blur-md' : ''}`} style={{ opacity: settings.opacity }}>
            {settings.animationType === 'gradient' && <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-xy" />}
            {config?.image && <div className={`absolute inset-0 bg-cover bg-center animate-pan`} style={{ backgroundImage: `url(${config.image})` }} />}
            
            {/* Effect Overlays */}
            {(settings.animationType === 'rain' || config?.overlay === 'rain') && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => <div key={i} className="absolute bg-blue-200/40 w-0.5 h-16 animate-fall" style={{ left: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s`, animationDelay: `${Math.random() * 2}s` }} />)}
              </div>
            )}
          </div>
        )}

        {/* Global Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gray-900/10 backdrop-contrast-125 pointer-events-none" />
      </div>
    </>
  );
}