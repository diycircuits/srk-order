import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

export const CatalogView = () => {
  const { products, setAddProductOpen } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Hardware Product Master</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">SRK RFID Tags, Readers, Antennas, and Barcode Hardware Master Catalog</p>
        </div>
        <button
          onClick={() => setAddProductOpen(true)}
          className="bg-[#0062bd] hover:bg-[#0052a3] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product Master</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((p) => (
          <div key={p.id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0062bd] dark:text-blue-400">{p.sku}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {p.category}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.name}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.description}</p>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Selling Price (Excl. GST)</span>
                <strong className="text-slate-900 dark:text-white text-sm">₹{p.unitPrice?.toFixed(2) || '0.00'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">HSN Code</span>
                <strong className="font-mono text-slate-700 dark:text-slate-300">{p.hsnCode} ({p.gstRate}% GST)</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

