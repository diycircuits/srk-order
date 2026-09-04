import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Warehouse, 
  Truck, 
  AlertTriangle, 
  Plus,
  CheckCircle2, 
  Edit3 
} from 'lucide-react';

export const InventoryView = () => {
  const { 
    products, 
    vendors, 
    activeSubTab, 
    setActiveSubTab, 
    updateStock, 
    availableStock,
    lowStockItemsCount,
    setAddVendorOpen,
    setAddProductOpen
  } = useApp();

  const [editingStockId, setEditingStockId] = useState(null);
  const [stockVal, setStockVal] = useState('');

  const handleStockSave = (prodId) => {
    if (stockVal !== '') {
      updateStock(prodId, stockVal);
    }
    setEditingStockId(null);
    setStockVal('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Submodule Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('stock')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'stock' 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
              : 'text-slate-400 hover:text-white bg-slate-800/40'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Stock Control</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vendors')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'vendors' 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
              : 'text-slate-400 hover:text-white bg-slate-800/40'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Vendors & Suppliers</span>
        </button>
      </div>

      {/* STOCK SUB-MODULE */}
      {activeSubTab === 'stock' && (
        <div className="space-y-5">
          {/* Summary Cards & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Stock Control & Ledger</h1>
              <p className="text-xs text-slate-400">Real-time inventory levels across central warehouse</p>
            </div>
            <button
              onClick={() => setAddProductOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product SKU</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 block">Total Units Available</span>
                <span className="text-2xl font-bold text-emerald-400">{availableStock}</span>
              </div>
              <Warehouse className="w-8 h-8 text-emerald-500/30" />
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 block">Low Stock Alert Count</span>
                <span className="text-2xl font-bold text-slate-200">{lowStockItemsCount}</span>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500/30" />
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 block">Central Warehouse</span>
                <span className="text-sm font-bold text-blue-400">MIDC Pune Logistics Hub</span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500/30" />
            </div>
          </div>

          {/* Stock Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">PRODUCT / SKU</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4 text-center">THRESHOLD</th>
                  <th className="py-3 px-4 text-center">ON HAND STOCK</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-center">ADJUST STOCK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {products.map((p) => {
                  const effectiveStock = p.stockByLocation ? (p.stockByLocation['LOC-MUM'] || p.stock || 0) : (p.stock || 0);
                  const isLow = effectiveStock <= (p.minThreshold || 10);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] font-mono text-blue-400">{p.sku}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">{p.category}</td>

                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">{p.minThreshold || 10}</td>

                      <td className="py-3.5 px-4 text-center font-bold text-base text-white">
                        {editingStockId === p.id ? (
                          <input
                            type="number"
                            value={stockVal}
                            onChange={(e) => setStockVal(e.target.value)}
                            className="w-20 bg-slate-800 border border-blue-500 text-center rounded text-white p-1"
                          />
                        ) : (
                          effectiveStock
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isLow ? (
                          <span className="badge-status status-cancelled">Low Stock</span>
                        ) : (
                          <span className="badge-status status-delivered">Optimal</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {editingStockId === p.id ? (
                          <button
                            onClick={() => handleStockSave(p.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded text-xs"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setStockVal(effectiveStock);
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded text-xs flex items-center space-x-1 mx-auto"
                          >
                            <Edit3 className="w-3 h-3 text-blue-400" />
                            <span>Update</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VENDORS SUB-MODULE */}
      {activeSubTab === 'vendors' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Vendors & Suppliers</h1>
              <p className="text-xs text-slate-400">Approved component manufacturers and vendors</p>
            </div>
            <button
              onClick={() => setAddVendorOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((v) => (
              <div key={v.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{v.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {v.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Contact Person: <strong className="text-slate-200">{v.contact}</strong></p>
                <p className="text-xs text-slate-400">Email: {v.email}</p>
                <p className="text-xs text-slate-400">Phone: {v.phone}</p>
                <p className="text-xs text-slate-400">Lead Time: <strong className="text-emerald-400">{v.leadTimeDays} Days</strong></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
