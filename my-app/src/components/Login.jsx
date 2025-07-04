import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <div className="w-screen h-screen bg-gray-100 m-0 p-0">
      {/* Header */}
      <div className="w-full px-8 py-6 flex flex-col bg-white border-b border-gray-200">
        <div className="flex items-center mb-1">
          <span className="font-bold text-xl text-gray-800 tracking-wide mr-2">PulseTrack</span>
          <div className="flex-1" />
          <button className="text-gray-400 hover:text-gray-700 text-lg">&#x25B2;</button>
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <span className="mr-2">Select project</span>
          <span className="mr-2">|</span>
          <span>Comment</span>
          <span className="flex-1" />
          <span>Today: <span className="font-bold text-gray-800">0:00</span></span>
        </div>
      </div>
      {/* Form */}
      <div className="w-full max-w-xl mx-auto px-8 pt-10">
        <div className="font-semibold text-gray-800 mb-4 text-lg">PulseTrack authorization</div>
        <form onSubmit={e => { e.preventDefault(); onLogin(); }}>
          <div className="mb-4 flex items-center">
            <label className="w-24 text-sm text-gray-700">Domain</label>
            <input type="text" value={domain} onChange={e => setDomain(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 w-32 mr-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-sm text-gray-500">.pulsetrack.com</span>
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-24 text-sm text-gray-700">E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-24 text-sm text-gray-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4 flex items-center">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="mr-1 accent-blue-500" />
            <span className="text-sm text-gray-700">Remember me</span>
            <span className="flex-1" />
            <a href="#" className="text-xs text-blue-600 hover:underline">Registration</a>
          </div>
          <div className="flex justify-between mt-6">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow">Login</button>
            <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded">Cancel</button>
          </div>
        </form>
        <div className="text-xs text-gray-500 mt-8">
          Authorization controls the services and commands available to user.<br />
          Were you not to enable authorization, authentication token alone would provide the same access to services for all authenticated users.
        </div>
      </div>
    </div>
  );
} 