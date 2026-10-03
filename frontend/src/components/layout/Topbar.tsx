import { Bell, UserCircle, Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 ml-64 shadow-sm">
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-gray-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search products, orders, or vendors..." 
          className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
        />
      </div>

      <div className="flex items-center gap-4 text-gray-500">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-200">
          <UserCircle size={24} className="text-gray-700" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-800 leading-none">Admin User</span>
            <span className="text-xs text-gray-500 mt-1">Superadmin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
