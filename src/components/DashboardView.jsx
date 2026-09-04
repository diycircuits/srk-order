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
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">DIY Circuits • Sales, Orders, Financials, and Multi-Location Stock Overview</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Sales Dashboard Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm">Sales Pipeline</h3>
              </div>
              <button 
                onClick={() => { setActiveTab('crm'); setActiveSubTab('leads'); }}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center"
              >
                View leads <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 block">Total Leads</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalLeads}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">All leads</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 block">Open Leads</span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{openLeads}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">In pipeline</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 block">Won Leads</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{wonLeads}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Converted</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 block">Lost Leads</span>
                <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">{lostLeads}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Closed lost</span>
              </div>
            </div>
          </div>
        </div>

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
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center"
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

        {/* Financial Dashboard Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <IndianRupee className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm">Zoho Financials</h3>
              </div>
              <button 
                onClick={() => { setActiveTab('catalog'); setActiveSubTab('invoices'); }}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center"
              >
                View invoices <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2.5 px-3.5 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">Pending Payments</span>
                  <span className="text-[10px] text-slate-400">{outstandingOrders.length} orders balance due</span>
                </div>
                <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">₹{(pendingPaymentsTotal || 0).toFixed(2)}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2.5 px-3.5 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">Received Payments</span>
                  <span className="text-[10px] text-slate-400">All time collected</span>
                </div>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹{(receivedPaymentsTotal || 0).toFixed(2)}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2.5 px-3.5 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">Monthly Revenue</span>
                  <span className="text-[10px] text-slate-400">August 2026</span>
                </div>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{(monthlyRevenueTotal || 0).toFixed(2)}</span>
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
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center"
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

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Outstanding Payments Table */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Outstanding Payments</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Zoho Books pending balance due</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200">
              ₹{(pendingPaymentsTotal || 0).toFixed(2)} Due
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">ORDER</th>
                  <th className="py-2.5 px-3">CUSTOMER</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">PAYMENT</th>
                  <th className="py-2.5 px-3 text-right">TOTAL</th>
                  <th className="py-2.5 px-3 text-right">DUE</th>
                  <th className="py-2.5 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                {outstandingOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <button 
                        onClick={() => setOrderDetailsOrder(ord)}
                        className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {ord.id}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-slate-900 dark:text-slate-200 font-bold">{ord.customerName}</td>
                    <td className="py-3 px-3">{getStatusBadge(ord.status)}</td>
                    <td className="py-3 px-3">{getPaymentBadge(ord.paymentStatus)}</td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-slate-200">₹{ord.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-rose-600 dark:text-rose-400">₹{ord.dueAmount.toFixed(2)}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => recordPayment(ord.id, ord.dueAmount)}
                        className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 font-bold px-2 py-1 rounded text-[11px] transition-colors"
                      >
                        Pay Full
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Dispatch Table */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Pending Dispatch</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Orders queued for shipment</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200">
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
                    <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      <button onClick={() => setOrderDetailsOrder(ord)} className="hover:underline">
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
                        className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 px-2 py-1 rounded text-[11px] font-bold transition-colors flex items-center justify-center space-x-1 mx-auto"
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
