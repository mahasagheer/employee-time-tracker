import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Camera } from 'lucide-react';

export default function TimerOverlay({ paused: externalPausedProp }) {
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState('working'); // 'working' or 'paused'
  const [showCamera, setShowCamera] = useState(false);
  const [externalPaused, setExternalPaused] = useState(false);
  const [idlePaused, setIdlePaused] = useState(false);
  const inactivityTimeout = useRef(null);

  // Inactivity detection logic
  const resetInactivity = () => {
    clearTimeout(inactivityTimeout.current);
    if (idlePaused) setIdlePaused(false);
    if (state === 'paused' && !externalPaused) setState('working');
    inactivityTimeout.current = setTimeout(() => {
      setState('paused');
      setIdlePaused(true);
    }, 60000); // 1 minute
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    resetInactivity();
    return () => {
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      clearTimeout(inactivityTimeout.current);
    };
  }, [idlePaused, state, externalPaused]);

  // Sync external paused prop with internal state (for overlay window compatibility)
  useEffect(() => {
    setExternalPaused(!!externalPausedProp);
    if (externalPausedProp) {
      setState('paused');
      setIdlePaused(true);
    } else {
      setIdlePaused(false);
    }
  }, [externalPausedProp]);

  useEffect(() => {
    // Notify main process of initial state on mount
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('timer-state', 'working');
    }
  }, []);

  useEffect(() => {
    let interval;
    if (state === 'working' && !externalPaused) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [state, externalPaused]);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const handler = () => {
        setShowCamera(true);
        setTimeout(() => setShowCamera(false), 2000);
      };
      window.electron.ipcRenderer.on('screenshot-taken', handler);
      return () => {
        window.electron.ipcRenderer.removeListener('screenshot-taken', handler);
      };
    }
  }, []);

  // Listen for inactivity-pause and inactivity-resume events (for overlay window)
  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const pauseHandler = () => {
        setState('paused');
        setExternalPaused(true);
        setIdlePaused(true);
      };
      const resumeHandler = () => {
        setExternalPaused(false);
        setState('working');
        setIdlePaused(false);
      };
      window.electron.ipcRenderer.on('inactivity-pause', pauseHandler);
      window.electron.ipcRenderer.on('inactivity-resume', resumeHandler);
      return () => {
        window.electron.ipcRenderer.removeListener('inactivity-pause', pauseHandler);
        window.electron.ipcRenderer.removeListener('inactivity-resume', resumeHandler);
      };
    }
  }, []);

  const pad = n => n.toString().padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const handleToggle = () => {
    // Allow resume if paused due to inactivity
    if (idlePaused) {
      setState('working');
      setExternalPaused(false);
      setIdlePaused(false);
      resetInactivity(); // <-- Reset inactivity timer when resuming
      return;
    }
    if (externalPaused) return; // Don't allow manual toggle if externally paused for other reasons
    const newState = state === 'paused' ? 'working' : 'paused';
    setState(newState);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('timer-state', newState);
    }
  };

  const icon = state === 'paused' || externalPaused ? <Play size={18} /> : <Pause size={18} />;
  const label = state === 'paused' || externalPaused ? 'Start' : 'Pause';

  return (
    <div
      className="bg-gray-800 shadow-lg flex items-center px-4 py-0 min-w-[180px] min-h-[32px]"
      style={{ WebkitAppRegion: 'drag', cursor: 'move' }}
    >
      <span className="text-white text-base font-bold mr-2 select-none">{pad(hours)}:{pad(minutes)}</span>
      <span className={`text-xs font-semibold select-none ${state === 'working' && !externalPaused ? 'text-green-400' : 'text-yellow-400'}`}>{state === 'working' && !externalPaused ? 'Working' : 'Paused'}</span>
      {showCamera && (
        <Camera size={18} className="ml-2 text-yellow-300 animate-bounce" title="Screenshot taken" />
      )}
      <button
        className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        aria-label={label}
        title={label}
        onClick={handleToggle}
        style={{ WebkitAppRegion: 'no-drag' }}
        // Only disable if paused for other reasons, not idle
        disabled={externalPaused && !idlePaused}
      >
        {icon}
      </button>
      <button
        className="ml-1 p-1 bg-gray-500 text-white rounded hover:bg-gray-700 flex items-center justify-center"
        aria-label="Close"
        title="Close"
        onClick={() => window.close()}
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <X size={16} />
      </button>
    </div>
  );
} 