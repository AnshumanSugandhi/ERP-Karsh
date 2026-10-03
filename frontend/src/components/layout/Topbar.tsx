'use client';
import { Bell, UserCircle, Search } from 'lucide-react';

import { usePathname } from 'next/navigation';
export default function Topbar() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 ml-64">
      <div className="flex items-center bg-slate-950 rounded-lg px-3 py-2 w-96 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <Search size={16} className="text-slate-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none w-full text-sm text-slate-200 placeholder-slate-500"
        />
      </div>

      <div className="flex items-center gap-4 text-slate-400">
        <button className="p-2 hover:bg-slate-800 hover:text-indigo-400 rounded-lg transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-700">
          <UserCircle size={24} className="text-slate-400" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-200 leading-none">Admin User</span>
            <span className="text-xs text-slate-500 mt-1">Superadmin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

