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
        <h1 className="text-2xl font-bold text-black">Executive Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time overview of your inventory health and urgent alerts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-300 flex items-center gap-4">
          <div className="p-2 border border-black text-black"><Package size={20} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Warehouses</p>
            <p className="text-2xl font-bold text-black">2</p>
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-300 flex items-center gap-4">
          <div className="p-2 border border-black text-black"><Clock size={20} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Items Near Expiry</p>
            <p className="text-2xl font-bold text-black">{nearExpiry.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-300 flex items-center gap-4">
          <div className="p-2 border border-black text-black"><TrendingDown size={20} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Dead Stock Batches</p>
            <p className="text-2xl font-bold text-black">{deadStock.length}</p>
          </div>
        </div>
      </div>

      {/* Alert Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Near Expiry Widget */}
        <div className="bg-white border border-gray-300 flex flex-col">
          <div className="bg-gray-100 p-4 border-b border-gray-300 flex justify-between items-center">
            <h3 className="font-semibold text-black flex items-center gap-2">
              <AlertTriangle size={16} /> Near Expiry Alert (30 Days)
            </h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-96">
            {nearExpiry.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No batches expiring soon.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {nearExpiry.map((batch: any) => (
                  <li key={batch.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-black">{batch.product_name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">Batch: {batch.batch_number} • Qty: {batch.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-black">{batch.expiry_date}</p>
                      <p className="text-xs text-gray-500 font-medium">EXP Date</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Dead Stock Widget */}
        <div className="bg-white border border-gray-300 flex flex-col">
          <div className="bg-gray-100 p-4 border-b border-gray-300 flex justify-between items-center">
            <h3 className="font-semibold text-black flex items-center gap-2">
              <TrendingDown size={16} /> Dead Stock Alert (90 Days)
            </h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-96">
            {deadStock.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No dead stock detected.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {deadStock.map((batch: any) => (
                  <li key={batch.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-black">{batch.product_name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">Batch: {batch.batch_number} • Qty: {batch.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-black uppercase">Idle Stock</p>
                      <p className="text-xs text-gray-500 mt-1">{batch.warehouse_name}</p>
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
