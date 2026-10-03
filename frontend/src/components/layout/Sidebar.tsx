'use client';

import Link from 'next/link';
import { Package, LayoutDashboard, Settings, LogOut, ShoppingCart, Truck, Factory, Users } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold tracking-wider text-blue-400 border-b border-gray-800">
        KARSH ERP
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link href="/inventory" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Package size={20} />
          <span>Inventory</span>
        </Link>
        
        <Link href="/vendors" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Truck size={20} />
          <span>Vendors / POs</span>
        </Link>
        
        <Link href="/manufacturing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Factory size={20} />
          <span>Manufacturing</span>
        </Link>

        <Link href="/sales" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <ShoppingCart size={20} />
          <span>Sales & Finance</span>
        </Link>
        
        <Link href="/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Users size={20} />
          <span>HR & Users</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-800 transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 transition-colors"
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
