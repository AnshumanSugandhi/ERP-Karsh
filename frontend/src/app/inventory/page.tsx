'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PackagePlus, Search, Edit, Trash2 } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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
            <h1 className="text-2xl font-bold text-gray-800">Product Master List</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your entire product catalog and SKUs.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          <PackagePlus size={20} />
          Add Product
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search products by SKU or Name..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Product Info</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right">Base Price</th>
                <th className="p-4 font-semibold text-center">Shelf Life</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Loading product catalog...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No products found. Click 'Add Product' to create one.</td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-semibold text-gray-900">{product.sku}</td>
                    <td className="p-4 flex items-center gap-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-medium text-center leading-tight">No Img</div>
                      )}
                      <div>
                          <span className="font-semibold text-gray-800 block text-base">{product.name}</span>
                          <span className="text-xs text-gray-500 block">HSN: {product.hsn_code || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                        <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-purple-100">
                            {product.category_name || 'Uncategorized'}
                        </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-900">₹{product.base_price}</td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-100">
                        {product.shelf_life_days} Days
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors bg-white hover:bg-blue-50 p-1.5 rounded"><Edit size={18} /></button>
                          <button className="text-gray-400 hover:text-red-600 transition-colors bg-white hover:bg-red-50 p-1.5 rounded"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
