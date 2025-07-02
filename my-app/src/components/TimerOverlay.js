import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Camera } from 'lucide-react';

export default function TimerOverlay() {
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState('working'); // 'working' or 'paused'
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    // Notify main process of initial state on mount
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('timer-state', 'working');
    }
  }, []);

  useEffect(() => {
    let interval;
    if (state === 'working') {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

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

  const pad = n => n.toString().padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const handleToggle = () => {
    const newState = state === 'paused' ? 'working' : 'paused';
    setState(newState);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('timer-state', newState);
    }
  };

  const icon = state === 'paused' ? <Play size={18} /> : <Pause size={18} />;
  const label = state === 'paused' ? 'Start' : 'Pause';

  return (
    <div
      className="fixed bottom-2 right-2 z-50 bg-gray-800 bg-opacity-95 rounded-lg shadow-lg flex items-center px-2 py-1 min-w-[120px] min-h-[38px]"
      style={{ WebkitAppRegion: 'drag', cursor: 'move' }}
    >
      <span className="text-white text-base font-bold mr-2 select-none">{pad(hours)}:{pad(minutes)}</span>
      <span className={`text-xs font-semibold select-none ${state === 'working' ? 'text-green-400' : 'text-yellow-400'}`}>{state === 'working' ? 'Working' : 'Paused'}</span>
      {showCamera && (
        <Camera size={18} className="ml-2 text-yellow-300 animate-bounce" title="Screenshot taken" />
      )}
      <button
        className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        aria-label={label}
        title={label}
        onClick={handleToggle}
        style={{ WebkitAppRegion: 'no-drag' }}
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