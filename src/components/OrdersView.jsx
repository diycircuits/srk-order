import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { calculateSlaStatus } from '../engine/WorkflowEngine';

export const OrdersView = () => {
  const { 
    orders, 
    setCreateOrderOpen, 
    setOrderDetailsOrder, 
    setTrackingOrder,
    updateOrderStatus,
    deleteOrder
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter Orders
  const filteredOrders = orders.filter(ord => {
    // Status Filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'DELAYED') {
        const sla = calculateSlaStatus(ord);
        if (!sla.isDelayed) return false;
      } else if (ord.status !== statusFilter) {
        return false;
      }
    }

    // Payment Filter
    if (paymentFilter !== 'ALL' && ord.paymentStatus !== paymentFilter) {
      return false;
    }

    // Search Filter
    if (localSearch) {
      const q = localSearch.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchCustomer = ord.customerName.toLowerCase().includes(q);
      const matchAwb = ord.courierDetails?.awbNumber?.toLowerCase().includes(q);
      const matchZoho = ord.zohoInvoiceRef?.invoiceNumber?.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchAwb && !matchZoho) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Order Lifecycle Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Browse, manage, track, and update customer sales orders</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setCreateOrderOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Book Order</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, AWB, Zoho Invoice..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-medium rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCUREMENT_REQUIRED">Procurement Required</option>
              <option value="PROCUREMENT_IN_PROGRESS">Procurement In Progress</option>
              <option value="MATERIAL_RECEIVED">Material Received</option>
              <option value="PACKING">Packing & QC</option>
              <option value="READY_TO_DISPATCH">Ready to Dispatch</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="DELIVERED">Delivered</option>
              <option value="DELAYED">⚠️ SLA Delayed</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-medium rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">ORDER #</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">SLA ALERT</th>
                <th className="py-3 px-4">PAYMENT</th>
                <th className="py-3 px-4 text-right">TOTAL</th>
                <th className="py-3 px-4">CREATED</th>
                <th className="py-3 px-4 text-center font-bold">LIFECYCLE ACTION</th>
                <th className="py-3 px-4 text-center">CONTROL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 text-xs">
                    No orders matching selected filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const sla = calculateSlaStatus(ord);
                  return (
                    <tr key={ord.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setOrderDetailsOrder(ord)}
                          className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline block"
                        >
                          {ord.id}
                        </button>
                        {ord.zohoInvoiceRef?.invoiceNumber && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                            {ord.zohoInvoiceRef.invoiceNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{ord.customerCode}</span>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>

                      <td className="py-3.5 px-4">
                        {sla.isDelayed ? (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            <span>{sla.badgeText}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">On Schedule ✓</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">{getPaymentBadge(ord.paymentStatus)}</td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-slate-100">
                        ₹{ord.totalAmount.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{ord.createdDate}</td>

                      {/* Quick Lifecycle Status Transition Select */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="NEW">1. New Order</option>
                          <option value="CONFIRMED">2. Confirmed</option>
                          <option value="PROCUREMENT_REQUIRED">3. Procurement Required</option>
                          <option value="PROCUREMENT_IN_PROGRESS">4. Procurement In Progress</option>
                          <option value="MATERIAL_RECEIVED">5. Material Received</option>
                          <option value="PACKING">6. Packing & QC</option>
                          <option value="READY_TO_DISPATCH">7. Ready to Dispatch</option>
                          <option value="DISPATCHED">8. Dispatched</option>
                          <option value="DELIVERED">9. Delivered</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setOrderDetailsOrder(ord)}
                            title="Open Single Source of Truth Order Control Drawer"
                            className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 border border-blue-200 dark:border-blue-500/30 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setTrackingOrder(ord)}
                            title="Open Customer Order Tracking Modal"
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete order ${ord.id}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            title="Delete Order"
                            className="p-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Page {currentPage} of {totalPages} • {filteredOrders.length} total orders</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
