import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageCheck, QrCode, Scan } from 'lucide-react';

export const FulfillmentModule = () => {
  const { orders, updateOrderStatus } = useApp();

  const [scanOrderNumber, setScanOrderNumber] = useState('SRK-ORD-2026-001244');
  const [scannedQty, setScannedQty] = useState(4);
  const [expectedQty, setExpectedQty] = useState(4);
  const [scanResult, setScanResult] = useState(null);

  const handleRunScan = () => {
    if (parseInt(scannedQty, 10) === parseInt(expectedQty, 10)) {
      setScanResult({ success: true, message: "✅ VERIFIED: All 4 RFID/Barcode tags matched order specification." });
    } else {
      setScanResult({ success: false, message: `❌ MISMATCH: Scanned ${scannedQty} units, but expected ${expectedQty} units!` });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Packing, QC & RFID/Barcode Verification</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Barcode / RFID portal scanner verification mode and dispatch packing slips</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFID & Barcode Scanner Verification Tool */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Scan className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">RFID / Barcode Scanner QC Terminal</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Target Order Number</label>
              <input
                type="text"
                value={scanOrderNumber}
                onChange={(e) => setScanOrderNumber(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-blue-700 dark:text-blue-300 font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Expected Items Qty</label>
                <input
                  type="number"
                  value={expectedQty}
                  onChange={(e) => setExpectedQty(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Scanned Items Count</label>
                <input
                  type="number"
                  value={scannedQty}
                  onChange={(e) => setScannedQty(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-emerald-600 dark:text-emerald-400 font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleRunScan}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Simulate RFID Tag Scan</span>
            </button>

            {scanResult && (
              <div className={`p-4 rounded-xl border text-xs font-bold ${
                scanResult.success 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-600/15 dark:border-emerald-500/30 dark:text-emerald-300' 
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-600/15 dark:border-rose-500/30 dark:text-rose-300'
              }`}>
                {scanResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Dispatch Queue Table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">QC Passed — Ready for Courier Dispatch</h2>

          <div className="space-y-3 text-xs">
            {orders.filter(o => o.status === 'READY_TO_DISPATCH' || o.status === 'PACKING' || o.status === 'DISPATCHED').map((ord) => (
              <div key={ord.id} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{ord.id}</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">{ord.customerName}</span>
                  <span className="text-[10px] text-slate-500 block">Courier: {ord.courierDetails?.courierName || 'DTDC'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'DISPATCHED')}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Mark Dispatched
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
