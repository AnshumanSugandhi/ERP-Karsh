'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AddProductModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    sku: '', name: '', category: '', base_price: '', shelf_life_days: '', safety_stock_level: '10', hsn_code: ''
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/inventory/categories/').then(res => setCategories(res.data)).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/products/', formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add product", error);
      alert("Error adding product. Check console.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 w-full max-w-lg shadow-xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-black uppercase tracking-wider">New Product</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black font-bold">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SKU</label>
              <input required type="text" className="w-full border border-gray-300 p-2 text-sm text-black focus:border-black outline-none" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g. LIP-001" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
              <input required type="text" className="w-full border border-gray-300 p-2 text-sm text-black focus:border-black outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Red Lipstick" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select required className="w-full border border-gray-300 p-2 text-sm text-black focus:border-black outline-none bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">HSN Code</label>
              <input type="text" className="w-full border border-gray-300 p-2 text-sm text-black focus:border-black outline-none" value={formData.hsn_code} onChange={e => setFormData({...formData, hsn_code: e.target.value})} placeholder="Optional" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Base Price</label>
              <input required type="number" step="0.01" className="w-full border border-gray-300 p-2 text-sm text-black focus:border-black outline-none" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Shelf Life (Days)</label>
              <input required type="number" className="w-full border border-gray-300 p-2 text-sm text-black focus:border-black outline-none" value={formData.shelf_life_days} onChange={e => setFormData({...formData, shelf_life_days: e.target.value})} placeholder="365" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Safety Stock</label>
              <input required type="number" className="w-full border border-gray-300 p-2 text-sm text-black focus:border-black outline-none" value={formData.safety_stock_level} onChange={e => setFormData({...formData, safety_stock_level: e.target.value})} placeholder="10" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-black hover:bg-gray-100 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
