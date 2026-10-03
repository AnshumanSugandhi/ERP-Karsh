'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, X, UploadCloud, Link as LinkIcon, Download } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onSuccess, productToEdit }: any) {
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  const [formData, setFormData] = useState({
    sku: '', name: '', category: '', base_price: '', shelf_life_days: '', safety_stock_level: '10', hsn_code: ''
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Quick category creation
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Initial Stock (only applicable when creating new)
  const [initialStock, setInitialStock] = useState({ quantity: '', warehouse: '', unit_cost: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/inventory/categories/').then(res => setCategories(res.data)).catch(console.error);
      api.get('/inventory/warehouses/').then(res => setWarehouses(res.data)).catch(console.error);
      
      if (productToEdit) {
        setFormData({
          sku: productToEdit.sku || '',
          name: productToEdit.name || '',
          category: productToEdit.category?.id?.toString() || productToEdit.category || '',
          base_price: productToEdit.base_price || '',
          shelf_life_days: productToEdit.shelf_life_days?.toString() || '',
          safety_stock_level: productToEdit.safety_stock_level?.toString() || '10',
          hsn_code: productToEdit.hsn_code || ''
        });
        setImage(null);
        setPreviewUrl(productToEdit.image || null);
        setImageUrlInput('');
      } else {
        setFormData({ sku: '', name: '', category: '', base_price: '', shelf_life_days: '', safety_stock_level: '10', hsn_code: '' });
        setImage(null);
        setPreviewUrl(null);
        setImageUrlInput('');
        setInitialStock({ quantity: '', warehouse: '', unit_cost: '' });
      }
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await api.post('/inventory/categories/', { name: newCategoryName, description: 'Added via Product Modal' });
      setCategories([...categories, res.data] as any);
      setFormData({ ...formData, category: res.data.id.toString() });
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch (err) {
      console.error(err);
      alert('Failed to create category.');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Image File selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Fetch Image from URL
  const handleFetchUrl = async () => {
    if (!imageUrlInput.trim()) return;
    try {
      setIsFetchingUrl(true);
      const res = await fetch(imageUrlInput);
      const blob = await res.blob();
      const file = new File([blob], 'fetched_image.jpg', { type: blob.type });
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageUrlInput('');
    } catch (err) {
      alert("Could not fetch image directly due to CORS or invalid URL. Try downloading it instead.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });
      if (image) {
        form.append('image', image);
      } else if (!productToEdit && !image) {
          // It's fine, image is optional
      }

      let savedProduct;
      if (productToEdit) {
        // Edit mode
        const res = await api.patch(`/inventory/products/${productToEdit.id}/`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        savedProduct = res.data;
      } else {
        // Create mode
        const res = await api.post('/inventory/products/', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        savedProduct = res.data;
      }

      // Add Stock Batch for both New and Edited products if requested
      const qty = parseInt(initialStock.quantity);
      if (qty > 0 && initialStock.warehouse) {
        const today = new Date();
        let expDate = today.toISOString().split('T')[0];
        if (formData.shelf_life_days) {
          const exp = new Date();
          exp.setDate(today.getDate() + parseInt(formData.shelf_life_days));
          expDate = exp.toISOString().split('T')[0];
        }
        await api.post('/inventory/stock-batches/', {
          product: savedProduct.id,
          warehouse: initialStock.warehouse,
          batch_number: `BATCH-${Math.floor(Date.now() / 1000)}`,
          mfd_date: today.toISOString().split('T')[0],
          expiry_date: expDate,
          quantity: qty,
          unit_cost: initialStock.unit_cost || formData.base_price
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Error saving product. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {productToEdit ? 'Edit Product' : 'New Product Configuration'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Core Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">1. Core Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SKU *</label>
                <input required type="text" className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g. LIP-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Product Name *</label>
                <input required type="text" className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Red Lipstick" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category *</label>
                {isAddingCategory ? (
                  <div className="flex gap-2">
                    <input autoFocus type="text" className="flex-1 border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 outline-none rounded-lg" placeholder="New Category..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                    <button type="button" onClick={handleCreateCategory} className="bg-indigo-600 text-white px-3 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">Save</button>
                    <button type="button" onClick={() => setIsAddingCategory(false)} className="bg-slate-800 text-slate-400 px-2 rounded-lg hover:text-white transition-colors"><X size={16}/></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select required className="flex-1 border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="">Select Category...</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setIsAddingCategory(true)} className="bg-slate-800 border border-slate-700 text-slate-300 px-3 rounded-lg hover:bg-slate-700 transition-colors" title="Add New Category">
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">HSN Code</label>
                <input type="text" className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg" value={formData.hsn_code} onChange={e => setFormData({...formData, hsn_code: e.target.value})} placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Pricing & Logistics */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">2. Pricing & Logistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Base Price (₹) *</label>
                <input required type="number" step="0.01" className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Shelf Life (Days) *</label>
                <input required type="number" className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg" value={formData.shelf_life_days} onChange={e => setFormData({...formData, shelf_life_days: e.target.value})} placeholder="365" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Safety Stock *</label>
                <input required type="number" className="w-full border border-slate-700 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg" value={formData.safety_stock_level} onChange={e => setFormData({...formData, safety_stock_level: e.target.value})} placeholder="10" />
              </div>
            </div>
          </div>

          {/* Image Upload - Drag & Drop / URL */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">3. Product Image</h3>
            <div className="flex gap-6 items-start">
              
              {/* Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-shrink-0 w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-950'
                } relative overflow-hidden group`}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => { setImage(null); setPreviewUrl(null); }} className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600"><X size={16}/></button>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 text-center p-4 pointer-events-none">
                    <UploadCloud size={28} className="mx-auto mb-2 text-slate-600" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Drop Image</span>
                  </div>
                )}
                
                {/* Hidden File Input overlaid to allow clicking */}
                {!previewUrl && (
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Click to browse or drag and drop"
                  />
                )}
              </div>

              {/* Info & URL Fetcher */}
              <div className="flex-1 space-y-4 pt-2">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Drag & Drop</p>
                  <p className="text-xs text-slate-500">Upload a JPEG, PNG, or WebP. Max size 5MB.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-slate-900 text-xs text-slate-500 font-medium uppercase">Or Provide URL</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon size={14} className="absolute left-3 top-3 text-slate-500" />
                    <input 
                      type="url" 
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleFetchUrl}
                    disabled={isFetchingUrl || !imageUrlInput}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isFetchingUrl ? 'Fetching...' : <><Download size={16}/> Fetch</>}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Initial Stock (Available in both modes) */}
          <div className="space-y-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              4. Add Stock Batch <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Qty to Add</label>
                <input type="number" min="0" className="w-full border border-slate-700 bg-slate-900 p-2 text-sm text-white focus:border-cyan-500 outline-none rounded-lg" value={initialStock.quantity} onChange={e => setInitialStock({...initialStock, quantity: e.target.value})} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Unit Cost (₹)</label>
                <input type="number" step="0.01" className="w-full border border-slate-700 bg-slate-900 p-2 text-sm text-white focus:border-cyan-500 outline-none rounded-lg" value={initialStock.unit_cost} onChange={e => setInitialStock({...initialStock, unit_cost: e.target.value})} placeholder="Matches Base Price" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Warehouse</label>
                <select className="w-full border border-slate-700 bg-slate-900 p-2 text-sm text-white focus:border-cyan-500 outline-none rounded-lg" value={initialStock.warehouse} onChange={e => setInitialStock({...initialStock, warehouse: e.target.value})}>
                  <option value="">Select Location...</option>
                  {warehouses.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 italic">* Filling this will automatically create a GRN transaction for this product.</p>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6 sticky bottom-0 bg-slate-900 py-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-sm font-bold uppercase tracking-wider">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg transition-colors text-sm font-bold uppercase tracking-wider disabled:opacity-50">
              {isSubmitting ? 'Saving...' : (productToEdit ? 'Update Product' : 'Save Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
