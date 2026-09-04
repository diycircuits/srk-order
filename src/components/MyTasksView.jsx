import React from 'react';
import { useApp } from '../context/AppContext';
import { ListTodo, ArrowRight, Trash2 } from 'lucide-react';
import { WORKFLOW_STAGES, PRIORITY_COLORS } from './KanbanBoardView';

export const MyTasksView = () => {
  const { orders = [], setOrderDetailsOrder, activeRole, forwardOrder, deleteOrder } = useApp();

  // Filter tasks assigned to current role or active department
  const pendingOrders = orders.filter(o => {
    const s = o.stage || o.status || '';
    return s !== 'Closed' && s !== 'Delivered' && s !== 'completed';
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Tasks</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {pendingOrders.length} pending order tasks in your active queue ({activeRole || 'Super Admin'})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingOrders.map(order => {
          const id = order.id || order.orderId;
          const client = order.customerName || order.clientName || 'Client';
          const product = order.product || (order.items && order.items[0]?.name) || order.itemsDescription || 'Product Item';
          const stage = order.stage || order.status || 'New Order';
          const priority = order.priority || 'Medium';
          const priorityColor = PRIORITY_COLORS[priority] || '#64748b';
          const amount = order.amount || order.totalAmount || 0;

          return (
            <div
              key={id}
              onClick={() => setOrderDetailsOrder(order)}
              className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono">{id}</span>
                  <span 
                    className="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                    style={{ backgroundColor: `${priorityColor}18`, color: priorityColor, border: `1px solid ${priorityColor}30` }}
                  >
                    {priority}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {stage}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {client}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">
                  {product}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">AMOUNT</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">
                    Rs. {Number(amount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete order ${id}?`)) {
                        deleteOrder(id);
                      }
                    }}
                    title="Delete Order"
                    className="p-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = WORKFLOW_STAGES.indexOf(stage);
                      const nextStage = idx >= 0 && idx < WORKFLOW_STAGES.length - 1 ? WORKFLOW_STAGES[idx + 1] : WORKFLOW_STAGES[0];
                      if (forwardOrder) {
                        forwardOrder(id, stage, nextStage, 'Quick forward from My Tasks', activeRole || 'User');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-blue-500/20 transition-colors"
                  >
                    <span>Forward</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
