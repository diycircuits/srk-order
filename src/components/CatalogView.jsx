import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, FileText, Printer, Plus } from 'lucide-react';

export const CatalogView = () => {
  const { products, orders, activeSubTab, setActiveSubTab, setViewInvoiceOrder, setAddProductOpen } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Submodule Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Product Catalog & SKUs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'invoices' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Zoho Books Invoices</span>
        </button>
      </div>

      {/* PRODUCTS SUBMODULE */}
      {activeSubTab === 'products' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Hardware Product Master</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">SRK RFID Tags, Readers, Antennas, and Barcode Hardware Master Catalog</p>
            </div>
            <button
              onClick={() => setAddProductOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product Master</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.map((p) => (
              <div key={p.id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{p.sku}</span>
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
      )}

      {/* ZOHO INVOICES SUBMODULE */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Zoho Books Invoices</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Synchronized tax invoices referenced directly from Zoho Books</p>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 px-4">INVOICE #</th>
                  <th className="p-3.5 px-4">ORDER #</th>
                  <th className="p-3.5 px-4">CUSTOMER</th>
                  <th className="p-3.5 px-4 text-right">TOTAL AMOUNT</th>
                  <th className="p-3.5 px-4 text-right">BALANCE DUE</th>
                  <th className="p-3.5 px-4 text-center">STATUS</th>
                  <th className="p-3.5 px-4 text-center">PRINT TAX INVOICE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {ord.zohoInvoiceRef?.invoiceNumber || 'INV-2026-8891'}
                    </td>
                    <td className="p-3.5 px-4 font-mono text-blue-600 dark:text-blue-400 font-bold">{ord.id}</td>
                    <td className="p-3.5 px-4 font-bold text-slate-900 dark:text-white">{ord.customerName}</td>
                    <td className="p-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">₹{ord.totalAmount?.toFixed(2) || '0.00'}</td>
                    <td className="p-3.5 px-4 text-right font-extrabold text-rose-600 dark:text-rose-400">₹{ord.dueAmount?.toFixed(2) || '0.00'}</td>
                    <td className="p-3.5 px-4 text-center">
                      <span className="badge-status status-processing">{ord.paymentStatus}</span>
                    </td>
                    <td className="p-3.5 px-4 text-center">
                      <button
                        onClick={() => setViewInvoiceOrder(ord)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center space-x-1 mx-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
