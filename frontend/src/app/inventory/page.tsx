'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PackagePlus, Search, Edit, Trash2, ArrowDownToLine } from 'lucide-react';
import AddProductModal from '@/components/inventory/AddProductModal';
import ReceiveStockModal from '@/components/inventory/ReceiveStockModal';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [receiveModalState, setReceiveModalState] = useState({ isOpen: false, product: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/inventory/products/${id}/`);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert('Failed to delete product.');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/inventory/products/');
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white">Product Master List</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your cosmetics catalog and stock batches.</p>
        </div>
        <button 
          onClick={() => { setProductToEdit(null); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg font-medium text-sm">
          <PackagePlus size={18} />
          Add Product
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by SKU or Name..." 
              className="pl-10 pr-4 py-2 w-full border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-200 bg-slate-950 placeholder-slate-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Product Info</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-center">Net Qty</th>
                <th className="p-4 font-semibold text-right">Base Price</th>
                <th className="p-4 font-semibold text-center">Shelf Life</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Loading product catalog...</td>
                </tr>
              ) : products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">No products found. Click 'Add Product' to create one.</td>
                </tr>
              ) : (
                products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())).map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono font-semibold text-slate-200">{product.sku}</td>
                    <td className="p-4 flex items-center gap-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-700 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-[10px] font-medium text-center leading-tight">No Img</div>
                      )}
                      <div>
                          <span className="font-semibold text-white block text-base">{product.name}</span>
                          <span className="text-xs text-slate-500 block">HSN: {product.hsn_code || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                        <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded text-xs font-semibold">
                            {product.category_name || 'Uncategorized'}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                        <span className="text-sm font-bold text-white">
                            {product.total_stock || 0}
                        </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-white">₹{product.base_price}</td>
                    <td className="p-4 text-center">
                      <span className="text-slate-300 text-xs font-semibold border border-slate-700 px-2 py-1 rounded">
                        {product.shelf_life_days} Days
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                          <button 
                            title="Receive Stock"
                            onClick={() => setReceiveModalState({ isOpen: true, product })}
                            className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors border border-cyan-500/30 p-1.5 rounded flex items-center gap-1 text-xs font-semibold uppercase">
                            <ArrowDownToLine size={14} /> GRN
                          </button>
                          <button onClick={() => { setProductToEdit(product); setIsAddModalOpen(true); }} title="Edit" className="text-slate-500 hover:text-white transition-colors"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(product.id)} title="Delete" className="text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddProductModal 
        isOpen={isAddModalOpen}
        productToEdit={productToEdit} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchProducts} 
      />
      
      <ReceiveStockModal 
        isOpen={receiveModalState.isOpen} 
        product={receiveModalState.product}
        onClose={() => setReceiveModalState({ isOpen: false, product: null })} 
        onSuccess={fetchProducts} 
      />
    </div>
  );
}


