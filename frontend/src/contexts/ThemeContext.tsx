"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BackgroundType = 'none' | 'static' | 'animated';
export type AnimationType = 'gradient' | 'rain' | 'particles' | 'anime' | 'forest' | 'city' | 'clouds';
export type SoundType = 'none' | 'rain' | 'forest' | 'ocean' | 'fire' | 'lofi' | 'piano' | 'synth' | 'humming';

interface ThemeSettings {
  // Visuals
  bgType: BackgroundType;
  bgImage: string;
  animationType: AnimationType;
  opacity: number; // 0 to 1
  blur: boolean;
  intensity: 'low' | 'medium' | 'high';
  
  // Audio
  soundType: SoundType;
  soundVolume: number; // 0 to 1
  isSoundPlaying: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (updates: Partial<ThemeSettings>) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultSettings: ThemeSettings = {
  bgType: 'none',
  bgImage: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80',
  animationType: 'gradient',
  opacity: 0.5,
  blur: false,
  intensity: 'low',
  
  soundType: 'none',
  soundVolume: 0.5,
  isSoundPlaying: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dashboard_theme_settings');
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch (e) {
        console.error("Failed to parse theme settings", e);
      }
    }
  }, []);

  const updateSettings = (updates: Partial<ThemeSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem('dashboard_theme_settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, isSidebarOpen, toggleSidebar }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};