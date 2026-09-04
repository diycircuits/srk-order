import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Package, Truck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { calculateSlaStatus } from '../engine/WorkflowEngine';

export const PublicTrackingPortal = () => {
  const { trackOrderById, setActiveTab } = useApp();
  const [inputOrderNumber, setInputOrderNumber] = useState('SRK-ORD-2026-001244');
  const [searchedOrder, setSearchedOrder] = useState(trackOrderById('SRK-ORD-2026-001244'));

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const result = trackOrderById(inputOrderNumber);
    setSearchedOrder(result || 'NOT_FOUND');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center">
      
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SRK Staff Dashboard</span>
          </button>
          <span className="text-xs text-slate-400 font-medium">track.srkinnovations.com</span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center mx-auto text-xl shadow-lg shadow-blue-500/20">
            SRK
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Track Your SRK Order</h1>
          <p className="text-xs text-slate-500 font-medium">Enter your Order Number (e.g. SRK-ORD-2026-001244) to check live status and dispatch progress.</p>
        </div>

        {/* Track Form Input */}
        <form onSubmit={handleTrackSubmit} className="glass-panel p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            required
            placeholder="Enter SRK Order Number..."
            value={inputOrderNumber}
            onChange={(e) => setInputOrderNumber(e.target.value)}
            className="flex-1 bg-transparent text-sm font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
          >
            Track Order
          </button>
        </form>

        {/* Searched Order Display */}
        {searchedOrder === 'NOT_FOUND' && (
          <div className="glass-panel p-6 rounded-2xl border border-rose-200 dark:border-rose-500/30 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Order Not Found</h3>
            <p className="text-xs text-slate-500">Please double check your order number or contact support at support@srkinnovation.com</p>
          </div>
        )}

        {searchedOrder && searchedOrder !== 'NOT_FOUND' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-lg block">{searchedOrder.id}</span>
                <span className="text-xs text-slate-500">Recipient: <strong className="text-slate-900 dark:text-slate-200">{searchedOrder.customerName}</strong></span>
              </div>
              <span className="badge-status status-delivered">{searchedOrder.status}</span>
            </div>

            {/* Courier Shipment Box */}
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Courier Partner:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{searchedOrder.courierDetails?.courierName || 'FedEx National'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">AWB Tracking Number:</span>
                <strong className="font-mono text-purple-600 dark:text-purple-400 font-bold">{searchedOrder.courierDetails?.awbNumber || 'FX-55019283'}</strong>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Tracking Updates</h3>
              <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800 text-xs">
                {searchedOrder.timeline.map((ev, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-[10px] font-mono text-slate-400 block">{ev.timestamp}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{ev.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
