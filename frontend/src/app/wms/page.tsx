'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Map as MapIcon, Plus, ChevronRight, ChevronDown, Box, Package2, Layers, Calendar, AlertTriangle } from 'lucide-react';
import AddLocationModal from '@/components/wms/AddLocationModal';

// Recursive Component for Tree
const LocationNode = ({ node, onAddChild, onSelectNode, selectedNodeId, depth = 0 }: any) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'ZONE': return 'text-purple-400';
      case 'AISLE': return 'text-indigo-400';
      case 'RACK': return 'text-cyan-400';
      case 'SHELF': return 'text-emerald-400';
      case 'BIN': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  const Icon = node.location_type === 'BIN' ? Box : (node.location_type === 'ZONE' ? MapIcon : Layers);
  const isSelected = selectedNodeId === node.id;

  return (
    <div className="select-none">
      <div 
        onClick={() => onSelectNode(node)}
        className={`flex items-center justify-between py-2 px-3 hover:bg-slate-800/80 cursor-pointer rounded-lg group transition-colors ${
          isSelected ? 'bg-slate-800/80 border-l-2 border-indigo-500' : ''
        } ${depth === 0 ? 'mt-2 border border-slate-800/50 bg-slate-900/30' : ''}`}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
      >
        <div className="flex items-center gap-2 flex-1">
          {node.children && node.children.length > 0 ? (
            <span onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="cursor-pointer p-1 -ml-1">
              {isExpanded ? <ChevronDown size={16} className="text-slate-500 hover:text-white" /> : <ChevronRight size={16} className="text-slate-500 hover:text-white" />}
            </span>
          ) : (
            <div className="w-6" /> // placeholder
          )}
          
          <Icon size={16} className={getTypeColor(node.location_type)} />
          
          <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>{node.name}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-950">
            {node.location_type}
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">{node.barcode}</span>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onAddChild(node); }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-600 hover:text-white text-slate-400 rounded transition-all"
          title="Add Child Location"
        >
          <Plus size={14} />
        </button>
      </div>

      {isExpanded && node.children && node.children.length > 0 && (
        <div className="border-l border-slate-800 ml-5">
          {node.children.map((child: any) => (
            <LocationNode 
              key={child.id} 
              node={child} 
              onAddChild={onAddChild} 
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function WMSPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selected Node State
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeStock, setNodeStock] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentLocation, setParentLocation] = useState<any>(null);

  useEffect(() => {
    api.get('/inventory/warehouses/')
      .then(res => {
        setWarehouses(res.data);
        if (res.data.length > 0) {
          setSelectedWarehouseId(res.data[0].id.toString());
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedWarehouseId) {
      fetchTree();
    } else {
      setTreeData([]);
    }
  }, [selectedWarehouseId]);

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/inventory/warehouses/${selectedWarehouseId}/layout_tree/`);
      setTreeData(res.data);
    } catch (error) {
      console.error("Failed to fetch WMS tree:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNode = async (node: any) => {
    setSelectedNode(node);
    setStockLoading(true);
    try {
      const res = await api.get(`/inventory/stock-batches/?location=${node.id}`);
      setNodeStock(res.data);
    } catch (error) {
      console.error("Failed to fetch stock for location:", error);
    } finally {
      setStockLoading(false);
    }
  };

  const handleAddRoot = () => {
    setParentLocation(null);
    setIsModalOpen(true);
  };

  const handleAddChild = (node: any) => {
    setParentLocation(node);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapIcon className="text-indigo-500" /> Digital Warehouse Map
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure hierarchical storage locations and inspect stock batches.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            className="border border-slate-700 bg-slate-900 p-2 text-sm text-white focus:border-indigo-500 rounded-lg outline-none"
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
          >
            <option value="">Select Warehouse...</option>
            {warehouses.map((w: any) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <button 
            onClick={handleAddRoot}
            disabled={!selectedWarehouseId}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg font-medium text-sm disabled:opacity-50"
          >
            <Plus size={18} /> Add Root Zone
          </button>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 min-h-0">
        
        {/* Left Tree Explorer */}
        <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
              <Package2 size={16} className="text-indigo-400" /> Storage Hierarchy
            </h3>
            <button onClick={fetchTree} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold uppercase">Refresh</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading ? (
              <div className="text-center py-12 text-slate-500 font-medium">Loading layout...</div>
            ) : !selectedWarehouseId ? (
              <div className="text-center py-12 text-slate-500 font-medium">Please select a warehouse above.</div>
            ) : treeData.length === 0 ? (
              <div className="text-center py-12">
                <MapIcon size={48} className="mx-auto text-slate-700 mb-3" />
                <p className="text-slate-400 font-medium">No storage locations defined.</p>
                <button onClick={handleAddRoot} className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-bold uppercase">Create First Zone</button>
              </div>
            ) : (
              <div className="space-y-1">
                {treeData.map((node: any) => (
                  <LocationNode 
                    key={node.id} 
                    node={node} 
                    onAddChild={handleAddChild} 
                    onSelectNode={handleSelectNode}
                    selectedNodeId={selectedNode?.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Info Panel - Visual Grid & Stock Inspector */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col min-h-0 overflow-hidden">
          
          {!selectedNode ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Box size={48} className="text-slate-700 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Location Explorer</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Select a Zone, Aisle, Rack, Shelf, or Bin from the tree to inspect its contents.
              </p>
            </div>
          ) : (
            <>
              {/* Explorer Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-start shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                      {selectedNode.location_type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{selectedNode.barcode}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedNode.name}</h2>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-300">Capacity</div>
                  <div className="text-xs text-slate-500">{selectedNode.max_weight ? `${selectedNode.max_weight} kg` : 'Unlimited'}</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                
                {/* Visual Sub-locations Grid (if any) */}
                {selectedNode.children && selectedNode.children.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">Sub-Locations</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedNode.children.map((child: any) => (
                        <div 
                          key={child.id} 
                          onClick={() => handleSelectNode(child)}
                          className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 group-hover:text-indigo-400 transition-colors">
                              {child.location_type}
                            </span>
                            <Box size={14} className="text-slate-600" />
                          </div>
                          <div className="font-bold text-slate-200">{child.name}</div>
                          <div className="text-[10px] text-slate-600 font-mono mt-1">{child.barcode}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Batches List */}
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                    <Package2 size={16}/> Stock Located Here
                  </h4>
                  
                  {stockLoading ? (
                    <div className="text-center py-8 text-slate-500">Scanning location...</div>
                  ) : nodeStock.length === 0 ? (
                    <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center">
                      <p className="text-slate-500 font-medium">No stock batches found directly at this location.</p>
                      {selectedNode.location_type !== 'BIN' && (
                        <p className="text-xs text-slate-600 mt-1">Stock might be stored in child locations (like Bins).</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {nodeStock.map((batch: any) => {
                        const isExpiringSoon = new Date(batch.expiry_date) < new Date(new Date().setDate(new Date().getDate() + 30));
                        return (
                          <div key={batch.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center hover:border-slate-700 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="bg-slate-950 border border-slate-800 w-12 h-12 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-xs text-slate-500 font-bold">QTY</span>
                                <span className="text-white font-bold">{batch.quantity}</span>
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-200 text-sm">{batch.product_name}</h5>
                                <p className="text-xs text-slate-500 font-mono">SKU: {batch.sku} | BATCH: {batch.batch_number}</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-[10px] font-bold uppercase text-slate-500">Exp. Date</div>
                                <div className={`text-sm font-medium flex items-center gap-1 ${isExpiringSoon ? 'text-amber-400' : 'text-slate-300'}`}>
                                  {isExpiringSoon && <AlertTriangle size={12} />}
                                  {batch.expiry_date}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>

      </div>

      <AddLocationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTree} 
        warehouseId={selectedWarehouseId}
        parentLocation={parentLocation}
      />
    </div>
  );
}

