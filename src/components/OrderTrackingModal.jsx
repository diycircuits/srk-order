import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Truck, ExternalLink } from 'lucide-react';
import { calculateSlaStatus } from '../engine/WorkflowEngine';

export const OrderTrackingModal = () => {
  const { trackingOrder, setTrackingOrder } = useApp();

  if (!trackingOrder) return null;

  const ord = trackingOrder;
  const sla = calculateSlaStatus(ord);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-mono text-slate-900 dark:text-white">{ord.id}</h2>
              <p className="text-xs text-slate-500 font-medium">{ord.customerName}</p>
            </div>
          </div>

          <button
            onClick={() => setTrackingOrder(null)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Courier Partner:</span>
            <strong className="text-slate-900 dark:text-white">{ord.courierDetails?.courierName || 'DTDC Express'}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">AWB Number:</span>
            <strong className="font-mono text-purple-600 dark:text-purple-400">{ord.courierDetails?.awbNumber || 'Pending AWB'}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Current Lifecycle Status:</span>
            <strong className="text-blue-600 dark:text-blue-400 font-bold">{ord.status}</strong>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <a 
              href={ord.courierDetails?.trackingUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              <span>Track on Official Courier Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={() => setTrackingOrder(null)}
            className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-4 py-2 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
