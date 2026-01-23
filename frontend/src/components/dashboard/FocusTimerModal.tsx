"use client";

import { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiPlus, FiMinus, FiX, FiCheckCircle, FiCheck } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActiveFocus {
  text: string;
  duration: number;
  status: 'In Progress' | 'Completed';
}

export default function FocusTimerModal({ isOpen, onClose }: FocusTimerModalProps) {
  // --- State ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [focusPurpose, setFocusPurpose] = useState('');
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [activeFocus, setActiveFocus] = useState<ActiveFocus | null>(null);

  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const savedPurpose = localStorage.getItem('focus_purpose');
    if (savedPurpose) setFocusPurpose(savedPurpose);
  }, []);

  useEffect(() => {
    localStorage.setItem('focus_purpose', focusPurpose);
  }, [focusPurpose]);

  // --- Timer Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleCompletion();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // --- Handlers ---

  const handleCompletion = () => {
    setIsActive(false);
    setSessionCompleted(true);
    if (activeFocus) {
      setActiveFocus({ ...activeFocus, status: 'Completed' });
    }
    playCompletionSound();
    sendNotification("Focus completed 🎉", focusPurpose ? `Task: ${focusPurpose}` : "Great job staying focused!");
  };

  const playCompletionSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/piano.mp3.mp3');
    }
    audioRef.current.play().catch(e => console.error("Audio play failed:", e));
  };

  const sendNotification = (title: string, body: string) => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  };

  const toggleTimer = () => {
    if (!isActive && focusPurpose.trim()) {
      // Starting session: Create Focus Card
      setActiveFocus({
        text: focusPurpose,
        duration: Math.ceil(timeLeft / 60),
        status: 'In Progress'
      });
      setFocusPurpose(''); // Clear input so placeholder shows
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setSessionCompleted(false);
    // Note: Requirement says cards exist only during session. 
    // We clear it on reset to start fresh.
    setActiveFocus(null);
  };

  const adjustTime = (minutes: number) => {
    setTimeLeft(prev => {
      const newTime = prev + (minutes * 60);
      return newTime > 0 ? newTime : 5 * 60;
    });
    setSessionCompleted(false);
  };

  const completeFocusCard = () => {
    setActiveFocus(null);
    setIsActive(false); // Stop the timer when task is completed
    sendNotification("Session Complete", "Focus session marked complete");
    // Play a short success sound (using the same chime for consistency)
    playCompletionSound();
  };

  // --- Formatting ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render ---
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transform transition-all scale-100 ring-1 ring-white/20 overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-500/10 rounded-full mb-3">
            <IoSparkles size={24} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Focus Timer</h2>
          <p className="text-gray-400 text-sm">Stay in the zone</p>
        </div>

        <div className="flex flex-col items-center justify-center mb-8 relative">
          <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isActive ? 'bg-blue-500' : 'bg-transparent'}`}></div>
          <div className="text-7xl font-mono font-bold text-white tracking-wider tabular-nums drop-shadow-lg">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 text-center">
            What are you focusing on?
          </label>
          <input
            type="text"
            value={focusPurpose}
            onChange={(e) => setFocusPurpose(e.target.value)}
            placeholder="e.g., Studying React"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-center text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`w-16 h-16 flex items-center justify-center rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                isActive 
                  ? 'bg-gray-800 text-red-400 hover:bg-gray-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {isActive ? <FiPause size={28} /> : <FiPlay size={28} className="ml-1" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
            >
              <FiRotateCcw size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={() => adjustTime(-5)} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-white/5"><FiMinus size={12} /> 5 min</button>
            <button onClick={() => adjustTime(5)} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-white/5"><FiPlus size={12} /> 5 min</button>
          </div>
        </div>

        {/* Focus Card Section */}
        {activeFocus && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`relative p-5 rounded-2xl border transition-all duration-500 ${
              activeFocus.status === 'Completed' 
              ? 'bg-green-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
              : 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-semibold text-lg leading-tight">{activeFocus.text}</h4>
                  <p className="text-gray-400 text-xs mt-1">{activeFocus.duration} Minute Session</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                  activeFocus.status === 'Completed'
                  ? 'text-green-400 border-green-400/20 bg-green-400/10'
                  : 'text-blue-400 border-blue-400/20 bg-blue-400/10'
                }`}>
                  {activeFocus.status}
                </span>
              </div>
              
              <div className="flex items-center justify-end mt-4">
                <button
                  onClick={completeFocusCard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95"
                >
                  <FiCheck size={14} /> Complete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}