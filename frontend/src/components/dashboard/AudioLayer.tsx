"use client";

import { useTheme, SoundType } from '@/contexts/ThemeContext';
import { useEffect, useRef } from 'react';

/**
 * AUDIO LAYER COMPONENT
 * Handles playback logic and volume control.
 */
const SOUND_SOURCES: Record<SoundType, string> = {
  none: "",
  lofi: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  rain: "/sounds/rain.mp3.mp3",
  forest: "/sounds/forest.mp3.mp3",
  ocean: "/sounds/ocean.mp3.mp3",
  fire: "/sounds/fire.mp3.mp3",
  piano: "/sounds/piano.mp3.mp3",
  synth: "/sounds/synth.mp3.mp3",
  humming: "/sounds/humming.mp3.mp3",
};

export default function AudioLayer() {
  const { settings } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Helper to apply volume safely
  const applyVolume = () => {
    if (audioRef.current) {
      const vol = Number(settings.soundVolume);
      if (!isNaN(vol)) {
        audioRef.current.volume = Math.max(0, Math.min(1, vol));
      }
    }
  };

  // 1. Sync volume whenever the setting changes
  useEffect(() => {
    applyVolume();
  }, [settings.soundVolume]);

  // 2. Handle Source & Playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetSrc = SOUND_SOURCES[settings.soundType];

    if (settings.soundType === 'none' || !targetSrc) {
      audio.pause();
      return;
    }

    // Load new source if changed
    if (!audio.src.endsWith(targetSrc)) {
      audio.src = targetSrc;
      audio.load();
      applyVolume(); // Re-apply volume after loading new source
    }

    if (settings.isSoundPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => applyVolume()) // Re-apply volume after playback starts
          .catch(error => {
            console.warn("AudioLayer: Playback blocked. Interaction needed.", error.message);
          });
      }
    } else {
      audio.pause();
    }

  }, [settings.soundType, settings.isSoundPlaying]);

  return (
    <audio 
      ref={audioRef} 
      loop 
      preload="auto"
      className="hidden" 
      onPlay={applyVolume} // Safety: Re-apply on play event
      onLoadedData={applyVolume} // Safety: Re-apply on data loaded
      onError={(e) => {
        const error = e.currentTarget.error;
        console.error(`AudioLayer Error: Could not play ${settings.soundType}.`, error?.message);
      }}
    />
  );
}