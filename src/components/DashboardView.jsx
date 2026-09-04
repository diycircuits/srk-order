import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  IndianRupee, 
  Boxes, 
  CheckCircle2, 
  Eye, 
  ChevronRight
} from 'lucide-react';

export const DashboardView = () => {
  const { 
    orders = [], 
    totalLeads = 0, 
    openLeads = 0, 
    wonLeads = 0, 
    lostLeads = 0,
    pendingOrdersCount = 0,
    processingOrdersCount = 0,
    dispatchPendingCount = 0,
    pendingPaymentsTotal = 0,
    receivedPaymentsTotal = 0,
    monthlyRevenueTotal = 0,
    availableStock = 0,
    lowStockItemsCount = 0,
    setActiveTab,
    setActiveSubTab,
    setTrackingOrder,
    setOrderDetailsOrder,
    recordPayment
  } = useApp();

  const outstandingOrders = orders.filter(o => (o.dueAmount || 0) > 0);
  const pendingDispatchOrders = orders.filter(o => o.status === 'booked' || o.status === 'processing' || o.status === 'READY_TO_DISPATCH' || o.status === 'PACKING');
  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'booked':
      case 'confirmed':
        return <span className="badge-status status-booked">{s}</span>;
      case 'processing':
      case 'procurement_in_progress':
      case 'packing':
      case 'qc':
        return <span className="badge-status status-processing">{s.replace(/_/g, ' ')}</span>;
      case 'in transit':
      case 'dispatched':
        return <span className="badge-status status-in-transit">{s.replace(/_/g, ' ')}</span>;
      case 'partially delivered':
        return <span className="badge-status status-partially-delivered">partially delivered</span>;
      case 'delivered':
      case 'completed':
        return <span className="badge-status status-delivered">{s}</span>;
      default:
        return <span className="badge-status status-booked">{s.replace(/_/g, ' ')}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'unpaid':
        return <span className="badge-status payment-unpaid">unpaid</span>;
      case 'paid':
        return <span className="badge-status payment-paid">paid</span>;
      case 'partial':
        return <span className="badge-status payment-partial">partial</span>;
      default:
        return <span className="badge-status payment-unpaid">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Executive Control Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">SRK Innovations • Retail Automation, Sales, Orders & Multi-Location Stock</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Order Dashboard Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <ShoppingBag className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm">Order Operations</h3>
              </div>
              <button 
                onClick={() => setActiveTab('orders')}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center cursor-pointer"
              >
                View orders <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2.5 px-3.5 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">Pending Confirmation</span>
                  <span className="text-[10px] text-slate-400">New & booked</span>
                </div>
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{pendingOrdersCount}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2.5 px-3.5 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">Processing / Fulfillment</span>
                  <span className="text-[10px] text-slate-400">In fulfillment</span>
                </div>
                <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{processingOrdersCount}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2.5 px-3.5 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">Dispatch Queue</span>
                  <span className="text-[10px] text-slate-400">Awaiting courier</span>
                </div>
                <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400">{dispatchPendingCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Dashboard Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Boxes className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm">Multi-Office Stock</h3>
              </div>
              <button 
                onClick={() => { setActiveTab('inventory'); setActiveSubTab('matrix'); }}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center cursor-pointer"
              >
                View matrix <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 block">Available Stock</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{availableStock}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Across offices</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 block">Low Stock Alert</span>
                <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">{lowStockItemsCount}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Below threshold</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-slate-800/30 border border-emerald-200 dark:border-slate-800 text-[11px] text-emerald-800 dark:text-slate-400 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>LOW STOCK ALERTS: All physical stock at optimal levels.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Pending Dispatch Section */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Pending Dispatch</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Orders queued for shipment & courier assignment</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-[#0062bd] dark:text-blue-300 border border-blue-200">
            {pendingDispatchOrders.length} Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">ORDER</th>
                <th className="py-2.5 px-3">CUSTOMER</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">TOTAL</th>
                <th className="py-2.5 px-3">CREATED</th>
                <th className="py-2.5 px-3 text-center">CONTROL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {pendingDispatchOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#0062bd] dark:text-blue-400">
                    <button onClick={() => setOrderDetailsOrder(ord)} className="hover:underline cursor-pointer">
                      {ord.id}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-slate-900 dark:text-slate-200 font-bold">{ord.customerName}</td>
                  <td className="py-3 px-3">{getStatusBadge(ord.status)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-slate-200">₹{ord.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{ord.createdDate}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setOrderDetailsOrder(ord)}
                      className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/20 text-[#0062bd] dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 px-2 py-1 rounded text-[11px] font-bold transition-colors flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Recent SRK Orders</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest transactions across the platform</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            View all <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">ORDER</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">PAYMENT</th>
                <th className="py-3 px-4 text-right">TOTAL</th>
                <th className="py-3 px-4 text-right">DUE</th>
                <th className="py-3 px-4 text-center">TRACKING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    <button onClick={() => setOrderDetailsOrder(ord)} className="hover:underline">
                      {ord.id}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 dark:text-slate-200 font-bold">{ord.customerName}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>
                  <td className="py-3.5 px-4">{getPaymentBadge(ord.paymentStatus)}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-slate-100">₹{ord.totalAmount.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-rose-600 dark:text-rose-400">₹{ord.dueAmount.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setTrackingOrder(ord)}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Track Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
