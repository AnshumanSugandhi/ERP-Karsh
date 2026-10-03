'use client';

import Link from 'next/link';
import { Package, LayoutDashboard, Settings, LogOut, ShoppingCart, Truck, Factory, Users, Map as MapIcon } from 'lucide-react';

import { usePathname } from 'next/navigation';
export default function Sidebar() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl">
      <div className="p-6 text-xl font-bold tracking-widest text-white border-b border-slate-800 uppercase flex items-center gap-2">
        <span className="text-cyan-400">KARSH</span> ERP
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        
        <Link href="/inventory" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <Package size={18} />
          <span className="text-sm font-medium">Inventory</span>
        </Link>

        <Link href="/wms" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <MapIcon size={18} />
          <span className="text-sm font-medium">Warehouse Map</span>
        </Link>
        
        <Link href="/vendors" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <Truck size={18} />
          <span className="text-sm font-medium">Vendors / POs</span>
        </Link>
        
        <Link href="/manufacturing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <Factory size={18} />
          <span className="text-sm font-medium">Manufacturing</span>
        </Link>

        <Link href="/sales" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <ShoppingCart size={18} />
          <span className="text-sm font-medium">Sales & Finance</span>
        </Link>
        
        <Link href="/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <Users size={18} />
          <span className="text-sm font-medium">HR & Users</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-400">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 transition-colors"
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  window.location.reload();
                }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}


