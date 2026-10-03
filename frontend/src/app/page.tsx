'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { AlertTriangle, Clock, Package, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const [nearExpiry, setNearExpiry] = useState([]);
  const [deadStock, setDeadStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch our custom alert endpoints!
      const expiryRes = await api.get('/inventory/stock-batches/near_expiry/?days=30');
      const deadRes = await api.get('/inventory/stock-batches/dead_stock/?days=90');
      
      setNearExpiry(expiryRes.data);
      setDeadStock(deadRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard alerts", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 font-medium animate-pulse">Loading Executive Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Executive Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time overview of your inventory health and urgent alerts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><Package size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Active Warehouses</p>
            <p className="text-2xl font-bold text-white">2</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Items Near Expiry</p>
            <p className="text-2xl font-bold text-white">{nearExpiry.length}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg"><TrendingDown size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Dead Stock Batches</p>
            <p className="text-2xl font-bold text-white">{deadStock.length}</p>
          </div>
        </div>
      </div>

      {/* Alert Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Near Expiry Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" /> Near Expiry Alert (30 Days)
            </h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-96">
            {nearExpiry.length === 0 ? (
              <p className="p-6 text-sm text-slate-500 text-center">No batches expiring soon.</p>
            ) : (
              <ul className="divide-y divide-slate-800/50">
                {nearExpiry.map((batch: any) => (
                  <li key={batch.id} className="p-4 hover:bg-slate-800/50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-200">{batch.product_name}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">Batch: {batch.batch_number} • Qty: {batch.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-400">{batch.expiry_date}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">EXP Date</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Dead Stock Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingDown size={16} className="text-rose-400" /> Dead Stock Alert (90 Days)
            </h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-96">
            {deadStock.length === 0 ? (
              <p className="p-6 text-sm text-slate-500 text-center">No dead stock detected.</p>
            ) : (
              <ul className="divide-y divide-slate-800/50">
                {deadStock.map((batch: any) => (
                  <li key={batch.id} className="p-4 hover:bg-slate-800/50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-200">{batch.product_name}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">Batch: {batch.batch_number} • Qty: {batch.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-400 uppercase">Idle Stock</p>
                      <p className="text-xs text-slate-500 mt-1">{batch.warehouse_name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
