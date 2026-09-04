import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Boxes, Truck, Download, FileSpreadsheet } from 'lucide-react';

export const ReportsView = () => {
  const { orders, products, availableStock } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalValuation = availableStock * 350;

  const downloadCSV = (filename, rows) => {
    const processRow = (row) => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(processRow).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Status', 'Payment Status', 'Total Amount', 'Due Amount', 'Created Date'];
    const rows = orders.map(o => [
      o.id,
      o.customerName,
      o.status,
      o.paymentStatus,
      o.totalAmount,
      o.dueAmount,
      o.createdDate
    ]);
    downloadCSV(`SRK_Orders_Report_${new Date().toISOString().slice(0,10)}.csv`, [headers, ...rows]);
  };

  const exportInventoryCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Stock Available', 'Unit Price', 'Total Valuation'];
    const rows = products.map(p => [
      p.sku,
      p.name,
      p.category,
      p.stock || 0,
      p.unitPrice,
      (p.stock || 0) * p.unitPrice
    ]);
    downloadCSV(`SRK_Inventory_Valuation_Report_${new Date().toISOString().slice(0,10)}.csv`, [headers, ...rows]);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Executive Reports & Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">DIY Circuits executive reporting on sales, stock valuation, and courier delivery speeds</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportOrdersCSV}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Orders CSV</span>
          </button>
          <button
            onClick={exportInventoryCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Stock CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Pipeline Booking Value</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{totalRevenue.toFixed(2)}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <Boxes className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Physical Inventory Valuation</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{totalValuation.toLocaleString()}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Average Courier Fulfillment Time</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1.8 Days</span>
        </div>
      </div>

      {/* Order Status Breakdown Summary */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Order Status Distribution Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block">Total Active Orders</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{orders.length}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block">Confirmed & Processing</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {orders.filter(o => o.status === 'CONFIRMED' || o.status === 'processing').length}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block">Dispatched & Delivered</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {orders.filter(o => o.status === 'DISPATCHED' || o.status === 'DELIVERED' || o.status === 'delivered').length}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block">Shortage / Procurement</span>
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {orders.filter(o => o.status === 'PROCUREMENT_REQUIRED' || o.status === 'PROCUREMENT_IN_PROGRESS').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
