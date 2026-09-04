import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { calculateSlaStatus } from '../engine/WorkflowEngine';

export const NotificationCenter = () => {
  const { orders, setOrderDetailsOrder } = useApp();

  const delayedOrders = orders.filter(o => calculateSlaStatus(o).isDelayed);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Internal Alerts & SLA Delay Center</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Automated system notifications for delayed orders, procurement alerts, and SLA breaches</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm">
            <Bell className="w-5 h-5 text-rose-500" />
            <span>Active SLA Breach Alerts ({delayedOrders.length})</span>
          </div>
        </div>

        <div className="space-y-3">
          {delayedOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>All orders are progressing within target SLA timeframes! No delayed alerts.</span>
            </div>
          ) : (
            delayedOrders.map((ord) => {
              const sla = calculateSlaStatus(ord);
              return (
                <div key={ord.id} className="bg-rose-50 dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{ord.id}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{ord.customerName}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{sla.badgeText} • Current Status: <strong className="text-slate-900 dark:text-slate-200">{ord.status}</strong></p>
                  </div>

                  <button
                    onClick={() => setOrderDetailsOrder(ord)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <span>Inspect Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
