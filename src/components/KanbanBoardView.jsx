import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Columns, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  X,
  Trash2
} from 'lucide-react';

export const WORKFLOW_STAGES = [
  "New Order",
  "Address Confirmation",
  "Payment Follow-up",
  "Invoice",
  "Vendor Purchase",
  "Ready to Dispatch",
  "Dispatched",
  "In Transit",
  "Delivered",
  "Closed"
];

export const STAGE_COLORS = {
  "New Order": "#64748b",
  "Address Confirmation": "#3b82f6",
  "Payment Follow-up": "#eab308",
  "Invoice": "#f46b1f",
  "Vendor Purchase": "#8b5cf6",
  "Ready to Dispatch": "#14b8a6",
  "Dispatched": "#0ea5e9",
  "In Transit": "#60a5fa",
  "Delivered": "#22c55e",
  "Closed": "#6b7280"
};

export const PRIORITY_COLORS = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#f97316",
  Urgent: "#ef4444"
};

export const KanbanBoardView = () => {
  const { 
    orders = [], 
    setOrderDetailsOrder, 
    setCreateOrderOpen,
    forwardOrder,
    deleteOrder,
    activeRole
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [draggedOrderId, setDraggedOrderId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // Normalize order status/stage to match WORKFLOW_STAGES
  const getNormalizedStage = (order) => {
    const status = order.stage || order.status || "New Order";
    if (WORKFLOW_STAGES.includes(status)) return status;
    const lower = String(status).toLowerCase();
    if (lower.includes('confirm') || lower.includes('address')) return "Address Confirmation";
    if (lower.includes('payment') || lower.includes('unpaid')) return "Payment Follow-up";
    if (lower.includes('invoice')) return "Invoice";
    if (lower.includes('procurement') || lower.includes('vendor')) return "Vendor Purchase";
    if (lower.includes('ready') || lower.includes('packing')) return "Ready to Dispatch";
    if (lower.includes('transit')) return "In Transit";
    if (lower.includes('dispatch')) return "Dispatched";
    if (lower.includes('deliver')) return "Delivered";
    if (lower.includes('closed') || lower.includes('complete')) return "Closed";
    return "New Order";
  };

  const getNormalizedPriority = (order) => {
    return order.priority || "Medium";
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (selectedPriority && getNormalizedPriority(o) !== selectedPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const id = String(o.id || o.orderId || '').toLowerCase();
      const client = String(o.customerName || o.clientName || '').toLowerCase();
      const prod = String(o.product || o.items || '').toLowerCase();
      const pi = String(o.piNumber || o.source || '').toLowerCase();
      return id.includes(q) || client.includes(q) || prod.includes(q) || pi.includes(q);
    }
    return true;
  });

  const handleDragStart = (e, orderId) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDrop = async (e, toStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const orderId = draggedOrderId || e.dataTransfer.getData('text/plain');
    if (!orderId) return;

    const order = orders.find(o => (o.id || o.orderId) === orderId);
    if (!order) return;

    const fromStage = getNormalizedStage(order);
    if (fromStage === toStage) return;

    if (forwardOrder) {
      await forwardOrder(orderId, fromStage, toStage, "Moved via Kanban Pipeline Board", activeRole || "User");
    }
    setDraggedOrderId(null);
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diff)) return 'just now';
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Order Pipeline</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {filteredOrders.length} orders across {WORKFLOW_STAGES.length} workflow stages
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCreateOrderOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, PI, client name, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-orange-500"
        >
          <option value="">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {(searchQuery || selectedPriority) && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedPriority(''); }}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Kanban Board Container */}
      <div className="overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex gap-4 min-w-max">
          {WORKFLOW_STAGES.map((stage) => {
            const stageOrders = filteredOrders.filter(o => getNormalizedStage(o) === stage);
            const stageColor = STAGE_COLORS[stage] || '#64748b';
            const isTarget = dragOverStage === stage;

            return (
              <div
                key={stage}
                onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage); }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => handleDrop(e, stage)}
                className={`w-64 flex flex-col rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border transition-all duration-200 ${
                  isTarget 
                    ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10' 
                    : 'border-slate-200 dark:border-slate-800/80'
                }`}
                style={{ maxHeight: 'calc(100vh - 220px)' }}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/50 dark:bg-slate-900/80 rounded-t-2xl">
                  <span className="font-extrabold text-xs tracking-wide" style={{ color: stageColor }}>
                    {stage}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5 custom-scrollbar min-h-[160px]">
                  {stageOrders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-600">
                      <Columns className="w-8 h-8 opacity-30 mb-2 stroke-[1.5]" />
                      <span className="text-[11px] font-medium">No orders in this stage</span>
                    </div>
                  ) : (
                    stageOrders.map((order) => {
                      const orderId = order.id || order.orderId;
                      const client = order.customerName || order.clientName || 'Unknown Client';
                      const product = order.product || (order.items && order.items[0]?.name) || order.itemsDescription || 'Product Details';
                      const priority = getNormalizedPriority(order);
                      const priorityColor = PRIORITY_COLORS[priority] || '#64748b';
                      const updatedAt = order.updatedAt || order.createdDate || order.orderDate;

                      return (
                        <div
                          key={orderId}
                          draggable
                          onDragStart={(e) => handleDragStart(e, orderId)}
                          onClick={() => setOrderDetailsOrder(order)}
                          className="relative p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer group transform hover:-translate-y-0.5"
                        >
                          {/* Priority Colored Bar on Left Edge */}
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" 
                            style={{ backgroundColor: priorityColor }}
                          />

                          <div className="pl-1.5 space-y-2">
                            {/* Order ID & Quick Delete */}
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wide">
                                {orderId}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
                                    deleteOrder(orderId);
                                  }
                                }}
                                title="Delete Order"
                                className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Client Name */}
                            <div className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                              {client}
                            </div>

                            {/* Product Name */}
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                              {product}
                            </div>

                            {/* Footer: Priority Badge & Timestamp */}
                            <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
                              <span 
                                className="px-2 py-0.5 rounded-full font-extrabold flex items-center space-x-1"
                                style={{ 
                                  backgroundColor: `${priorityColor}18`,
                                  color: priorityColor,
                                  border: `1px solid ${priorityColor}30`
                                }}
                              >
                                <span>{priority}</span>
                              </span>

                              <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{getTimeAgo(updatedAt)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
