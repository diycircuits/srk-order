import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, CheckCircle2 } from 'lucide-react';

export const FulfillmentModule = () => {
  const { orders, updateOrderStatus } = useApp();

  const dispatchOrders = orders.filter(o => o.status === 'READY_TO_DISPATCH' || o.status === 'PACKING' || o.status === 'DISPATCHED' || o.status === 'booked' || o.status === 'processing');

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dispatch & Courier Operations</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage outgoing courier consignments, AWBs, and parcel dispatches</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Truck className="w-5 h-5 text-[#0062bd] dark:text-blue-400" />
          <h2 className="font-bold text-slate-900 dark:text-white text-base">Courier Dispatch Queue</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {dispatchOrders.map((ord) => (
            <div key={ord.id} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[#0062bd] dark:text-blue-400">{ord.id}</span>
                  <span className="badge-status status-processing">{ord.status}</span>
                </div>
                <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm">{ord.customerName}</h3>
                <p className="text-slate-500 text-[11px] mt-1 line-clamp-1">{ord.shippingAddress}</p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">
                  Courier: <strong className="text-slate-700 dark:text-slate-300">{ord.courierDetails?.courierName || 'Blue Dart / DTDC'}</strong>
                  {ord.courierDetails?.awbNumber && <span> • AWB: {ord.courierDetails.awbNumber}</span>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">₹{ord.totalAmount?.toFixed(2)}</span>
                {ord.status === 'DISPATCHED' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dispatched</span>
                  </span>
                ) : (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'DISPATCHED')}
                    className="bg-[#0062bd] hover:bg-[#0052a3] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Mark Dispatched
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

