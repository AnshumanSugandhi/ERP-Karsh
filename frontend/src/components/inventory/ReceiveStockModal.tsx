'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ReceiveStockModal({ isOpen, onClose, onSuccess, product }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, product: any }) {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    product: '', warehouse: '', batch_number: '', mfd_date: '', expiry_date: '', quantity: '', unit_cost: ''
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/inventory/warehouses/').then(res => setWarehouses(res.data)).catch(console.error);
      
      // Auto-calculate expiry date based on product's shelf life if available
      const today = new Date();
      let expDate = '';
      if (product?.shelf_life_days) {
        const exp = new Date();
        exp.setDate(today.getDate() + product.shelf_life_days);
        expDate = exp.toISOString().split('T')[0];
      }

      setFormData(prev => ({
        ...prev,
        product: product?.id || '',
        mfd_date: today.toISOString().split('T')[0],
        expiry_date: expDate,
        batch_number: `BATCH-${Math.floor(1000 + Math.random() * 9000)}`
      }));
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/stock-batches/', formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to receive stock", error);
      alert("Error receiving stock. Check console.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-xl border-slate-800">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Receive Stock (GRN)</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-white font-bold">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="mb-4 p-3 bg-slate-800/50 border border-slate-800 text-sm">
            <span className="font-bold text-white">Product: </span> 
            <span className="text-slate-400">{product?.sku} - {product?.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Warehouse Location</label>
              <select required className="w-full border border-slate-700 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-950" value={formData.warehouse} onChange={e => setFormData({...formData, warehouse: e.target.value})}>
                <option value="">Select Warehouse...</option>
                {warehouses.map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Batch Number</label>
              <input required type="text" className="w-full border border-slate-700 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" value={formData.batch_number} onChange={e => setFormData({...formData, batch_number: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">MFD Date</label>
              <input required type="date" className="w-full border border-slate-700 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" value={formData.mfd_date} onChange={e => setFormData({...formData, mfd_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
              <input required type="date" className="w-full border border-slate-700 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Quantity Received</label>
              <input required type="number" min="1" className="w-full border border-slate-700 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Unit Cost (₹)</label>
              <input required type="number" step="0.01" className="w-full border border-slate-700 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" value={formData.unit_cost} onChange={e => setFormData({...formData, unit_cost: e.target.value})} placeholder="0.00" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-700 text-white hover:bg-slate-800/50 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg transition-colors text-sm font-medium">Record Receipt</button>
          </div>
        </form>
      </div>
    </div>
  );
}

