import React, { useEffect, useState } from 'react';

export default function InactivityOverlay({ visible, idleTime, onAdd, onSkip, projects }) {
  const [reason, setReason] = useState('');
  const [selectedProject, setSelectedProject] = useState(projects[0] || '');
  const [timer, setTimer] = useState(idleTime);

  useEffect(() => {
    if (!visible) return;
    setTimer(idleTime);
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [visible, idleTime]);

  if (visible) {
    console.log('[DEBUG] InactivityOverlay is rendering');
  }
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-red-500 bg-opacity-80 flex items-start justify-center z-50">
      <div className="w-full max-w-xl mt-16 bg-white rounded-lg shadow-2xl p-10 flex flex-col items-center border border-gray-200">
        <div className="w-full flex flex-col items-center mb-6">
          <span className="font-bold text-2xl text-gray-800 mb-2">Inactive</span>
          <span className="text-lg text-gray-600 mb-4">Inactive for {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
        </div>
        <input
          className="border border-gray-300 rounded px-4 py-2 w-full mb-6 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Reason for inactivity (last 1 min)"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full mb-6 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
        >
          {projects.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <div className="flex w-full justify-between mt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded shadow mr-2"
            onClick={() => onAdd(reason, selectedProject)}
          >Add</button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-2 rounded"
            onClick={onSkip}
          >Skip</button>
        </div>
      </div>
    </div>
  );
} 