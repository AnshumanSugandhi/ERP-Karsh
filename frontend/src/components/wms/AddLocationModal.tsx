'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { X } from 'lucide-react';

export default function AddLocationModal({ isOpen, onClose, onSuccess, warehouseId, parentLocation }: any) {
  const [formData, setFormData] = useState({
    name: '',
    location_type: 'ZONE',
    max_weight: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const LOCATION_TYPES = ['ZONE', 'AISLE', 'RACK', 'SHELF', 'BIN'];
  
  // Quick helper to suggest the next logical type
  const getDefaultType = () => {
    if (!parentLocation) return 'ZONE';
    const parentIdx = LOCATION_TYPES.indexOf(parentLocation.location_type);
    if (parentIdx >= 0 && parentIdx < LOCATION_TYPES.length - 1) {
      return LOCATION_TYPES[parentIdx + 1];
    }
    return 'BIN';
  };

  // Reset form when opened
  useState(() => {
    if (isOpen) {
      setFormData({ name: '', location_type: getDefaultType(), max_weight: '' });
    }
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/inventory/storage-locations/', {
        warehouse: warehouseId,
        parent: parentLocation ? parentLocation.id : null,
        name: formData.name,
        location_type: formData.location_type,
        max_weight: formData.max_weight || null
      });
      onSuccess();
      onClose();
      setFormData({ name: '', location_type: getDefaultType(), max_weight: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create storage location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
        
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {parentLocation ? `Add Child to ${parentLocation.name}` : 'Add Root Zone'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location Type *</label>
            <select 
              required 
              className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 outline-none rounded-lg" 
              value={formData.location_type} 
              onChange={e => setFormData({...formData, location_type: e.target.value})}
            >
              {LOCATION_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name/Identifier *</label>
            <input 
              required 
              type="text" 
              className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 outline-none rounded-lg" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Aisle A, Rack 1" 
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Max Weight Capacity (Optional)</label>
            <input 
              type="number" 
              step="0.01"
              className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 outline-none rounded-lg" 
              value={formData.max_weight} 
              onChange={e => setFormData({...formData, max_weight: e.target.value})} 
              placeholder="e.g. 500.00" 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-sm font-bold uppercase">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg transition-colors text-sm font-bold uppercase disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Create Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
