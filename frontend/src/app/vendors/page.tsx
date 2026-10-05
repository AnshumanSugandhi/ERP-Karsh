'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Truck, Search, Plus, ShoppingCart, User, Building, Phone, Mail, Clock, ShieldCheck, ChevronRight, CheckCircle2, ClipboardList } from 'lucide-react';

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState<'vendors' | 'pos'>('vendors');
  const [vendors, setVendors] = useState([]);
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'vendors') {
        const res = await api.get('/vendors/vendors/');
        setVendors(res.data);
      } else {
        const res = await api.get('/vendors/purchase-orders/');
        setPos(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'SENT': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'PARTIAL': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CANCELLED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const filteredVendors = vendors.filter((v: any) => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPos = pos.filter((p: any) => p.po_number.toLowerCase().includes(searchTerm.toLowerCase()) || p.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="text-indigo-500" /> Procurement & Vendors
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage suppliers, lead times, and active purchase orders.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg flex items-center gap-2 shrink-0">
            <Plus size={18} /> {activeTab === 'vendors' ? 'New Vendor' : 'Create PO'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'vendors' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'}`}
        >
          <Building size={16} /> Vendors Registry
        </button>
        <button 
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'pos' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'}`}
        >
          <ClipboardList size={16} /> Purchase Orders
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500">Loading data...</div>
        ) : activeTab === 'vendors' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {filteredVendors.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500">
                <Building size={48} className="mb-4 text-slate-700" />
                <p>No vendors found.</p>
              </div>
            ) : (
              filteredVendors.map((vendor: any) => (
                <div key={vendor.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{vendor.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-500 mt-1">
                        <ShieldCheck size={12} /> Rating: {vendor.reliability_rating}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${vendor.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                      {vendor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-400">
                    {vendor.contact_email && <div className="flex items-center gap-2"><Mail size={14} className="text-slate-500" /> {vendor.contact_email}</div>}
                    {vendor.contact_phone && <div className="flex items-center gap-2"><Phone size={14} className="text-slate-500" /> {vendor.contact_phone}</div>}
                    <div className="flex items-center gap-2"><Clock size={14} className="text-slate-500" /> Avg Lead: {vendor.lead_time_days} Days</div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-bold uppercase flex items-center gap-1">
                      View Profile <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">PO Number</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order Date</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Expected</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredPos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      <ClipboardList size={48} className="mx-auto mb-4 text-slate-700" />
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  filteredPos.map((po: any) => (
                    <tr key={po.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono text-sm text-indigo-400 font-bold">{po.po_number}</td>
                      <td className="p-4 font-semibold text-slate-200">{po.vendor_name}</td>
                      <td className="p-4 text-sm text-slate-400">{po.order_date}</td>
                      <td className="p-4 text-sm text-slate-400">{po.expected_delivery_date || '-'}</td>
                      <td className="p-4 text-right font-mono text-emerald-400">${parseFloat(po.total_amount || 0).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${getStatusColor(po.status)}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
