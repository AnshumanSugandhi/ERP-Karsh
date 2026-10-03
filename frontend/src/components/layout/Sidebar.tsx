'use client';

import Link from 'next/link';
import { Package, LayoutDashboard, Settings, LogOut, ShoppingCart, Truck, Factory, Users } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col fixed left-0 top-0 border-r border-gray-200">
      <div className="p-6 text-xl font-bold tracking-widest text-white border-b border-gray-800 uppercase">
        KARSH ERP
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/" className="flex items-center gap-3 p-3 rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white">
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        
        <Link href="/inventory" className="flex items-center gap-3 p-3 rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white">
          <Package size={18} />
          <span className="text-sm font-medium">Inventory</span>
        </Link>
        
        <Link href="/vendors" className="flex items-center gap-3 p-3 rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white">
          <Truck size={18} />
          <span className="text-sm font-medium">Vendors / POs</span>
        </Link>
        
        <Link href="/manufacturing" className="flex items-center gap-3 p-3 rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white">
          <Factory size={18} />
          <span className="text-sm font-medium">Manufacturing</span>
        </Link>

        <Link href="/sales" className="flex items-center gap-3 p-3 rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white">
          <ShoppingCart size={18} />
          <span className="text-sm font-medium">Sales & Finance</span>
        </Link>
        
        <Link href="/users" className="flex items-center gap-3 p-3 rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white">
          <Users size={18} />
          <span className="text-sm font-medium">HR & Users</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="flex items-center gap-3 p-3 w-full rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="flex items-center gap-3 p-3 w-full rounded hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
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
