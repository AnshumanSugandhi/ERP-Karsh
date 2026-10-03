'use client';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/login/', {
        username,
        password
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      window.location.href = '/inventory';
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 border border-gray-200 shadow-xl bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest text-black uppercase">KARSH ERP</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to continue</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 mb-4 border border-red-200 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username</label>
            <input 
              required 
              type="text" 
              className="w-full border border-gray-300 p-3 text-sm text-black focus:border-black outline-none bg-white" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input 
              required 
              type="password" 
              className="w-full border border-gray-300 p-3 text-sm text-black focus:border-black outline-none bg-white" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white p-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

