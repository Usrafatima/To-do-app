"use client";

import { useTheme, BackgroundType, AnimationType, SoundType } from '@/contexts/ThemeContext';
import { 
  FiSettings, FiImage, FiActivity, FiX, FiCheck, FiDroplet, FiWind, FiDisc, FiMap, FiCloud,
  FiMusic, FiVolume2, FiPlay, FiPause, FiCloudRain, FiSun, FiSpeaker, FiHeadphones, FiZap
} from 'react-icons/fi';
import { BiLayer, BiWater } from 'react-icons/bi';
import { useState, useEffect } from 'react';

const STATIC_IMAGES = [
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Mountains
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Abstract
  "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Desert
  "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Ocean
  "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Architecture
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Space
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Minimal
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Forest
];

const SOUND_OPTIONS: { id: SoundType; label: string; icon: any }[] = [
  { id: 'rain', label: 'Rain', icon: FiCloudRain },
  { id: 'forest', label: 'Forest', icon: FiWind },
  { id: 'ocean', label: 'Ocean', icon: BiWater },
  { id: 'fire', label: 'Fire', icon: FiSun },
  { id: 'lofi', label: 'Lo-Fi', icon: FiHeadphones },
  { id: 'piano', label: 'Piano', icon: FiMusic },
  { id: 'synth', label: 'Synth', icon: FiZap },
  { id: 'humming', label: 'Humming', icon: FiDisc },
];

export default function Sidebar() {
  const { settings, updateSettings, isSidebarOpen, toggleSidebar } = useTheme();
  
  // 1. Decoupled Local State for the slider
  const [localVolume, setLocalVolume] = useState(0.5);

  // 2. Initialize local volume from settings ONLY once on mount
  // This prevents the slider from "snapping back" during global state updates
  useEffect(() => {
    if (settings.soundVolume !== undefined) {
      setLocalVolume(settings.soundVolume);
    }
  }, []); 

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    setLocalVolume(newVal); // Instant visual update
    updateSettings({ soundVolume: newVal }); // Global update for AudioLayer
  };

  return (
    <>
      {/* Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 bottom-20 z-40 p-3 bg-gray-800/80 backdrop-blur-md text-white rounded-full shadow-lg border border-gray-700 hover:bg-gray-700 transition-all hover:scale-110 group"
          title="Customize UI"
        >
          <FiSettings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transform transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-8 pb-24">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-space-grotesk flex items-center gap-2">
              <FiSettings className="text-blue-400" /> Appearance
            </h2>
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white transition-colors">
              <FiX size={24} />
            </button>
          </div>

          {/* --- VISUALS --- */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Visuals</h3>
            
            {/* Background Mode */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400">Background Mode</label>
              <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                {(['none', 'static', 'animated'] as BackgroundType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateSettings({ bgType: type })}
                    className={`flex-1 py-2 px-2 text-xs font-medium rounded-md capitalize transition-all ${
                      settings.bgType === type 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Static Image Selector */}
            {settings.bgType === 'static' && (
              <div className="space-y-3 animate-fadeIn">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                  <FiImage /> Select Wallpaper
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STATIC_IMAGES.map((img) => (
                    <button
                      key={img}
                      onClick={() => updateSettings({ bgImage: img })}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        settings.bgImage === img ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-gray-500'
                      }`}
                    >
                      <img src={img} alt="bg" className="w-full h-full object-cover" />
                      {settings.bgImage === img && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <FiCheck className="text-white drop-shadow-md" size={20} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Animation Selector */}
            {settings.bgType === 'animated' && (
              <div className="space-y-3 animate-fadeIn">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                  <FiActivity /> Animation Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gradient', icon: FiWind, label: 'Flow' },
                    { id: 'rain', icon: FiDroplet, label: 'Rain' },
                    { id: 'particles', icon: FiDisc, label: 'Orbs' },
                    { id: 'anime', icon: FiActivity, label: 'Anime' },
                    { id: 'forest', icon: FiImage, label: 'Forest' },
                    { id: 'city', icon: FiMap, label: 'City' },
                    { id: 'clouds', icon: FiCloud, label: 'Clouds' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateSettings({ animationType: item.id as AnimationType })}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        settings.animationType === item.id 
                          ? 'bg-gray-800 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} className="mb-1" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            {settings.bgType !== 'none' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Opacity</span>
                    <span>{Math.round(settings.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.opacity}
                    onChange={(e) => updateSettings({ opacity: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 flex items-center gap-2">
                    <BiLayer /> Blur Background
                  </span>
                  <button
                    onClick={() => updateSettings({ blur: !settings.blur })}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      settings.blur ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        settings.blur ? 'left-6' : 'left-1'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- SOUND & AMBIENCE --- */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center justify-between">
              Sound & Ambience
              {settings.soundType !== 'none' && (
                <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full animate-pulse">
                  {settings.isSoundPlaying ? 'Playing' : 'Paused'}
                </span>
              )}
            </h3>

            {/* Play/Pause Main Toggle */}
            <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${settings.isSoundPlaying ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-700 text-gray-400'}`}>
                  {settings.isSoundPlaying ? <FiSpeaker size={18} /> : <FiVolume2 size={18} />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-200">
                    {settings.soundType === 'none' ? 'No Sound Selected' : 
                     SOUND_OPTIONS.find(s => s.id === settings.soundType)?.label || 'Audio'}
                  </div>
                  <div className="text-xs text-gray-500">Master Audio</div>
                </div>
              </div>
              
              <button
                onClick={() => updateSettings({ isSoundPlaying: !settings.isSoundPlaying })}
                disabled={settings.soundType === 'none'}
                className={`p-2 rounded-full transition-colors ${
                  settings.soundType === 'none' ? 'opacity-50 cursor-not-allowed text-gray-500' :
                  settings.isSoundPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {settings.isSoundPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </button>
            </div>

            {/* Sound Selector Grid */}
            <div className="grid grid-cols-4 gap-2">
              {SOUND_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    updateSettings({ 
                      soundType: item.id,
                      isSoundPlaying: true
                    });
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all aspect-square ${
                    settings.soundType === item.id 
                      ? 'bg-gray-800 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-gray-800/30 border-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className={`mb-1 ${settings.soundType === item.id && settings.isSoundPlaying ? 'animate-bounce' : ''}`} />
                  <span className="text-[9px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="flex items-center gap-2"><FiVolume2 /> Volume</span>
                <span>{Math.round(localVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={localVolume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}