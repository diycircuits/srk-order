import React from 'react';
import { useApp } from '../context/AppContext';
import { Warehouse, History } from 'lucide-react';

export const InventoryLocationModule = () => {
  const { products, inventoryLedger, activeSubTab, setActiveSubTab } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Submodule Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'matrix' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Multi-Location Stock Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'ledger' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Immutable Ledger Log</span>
        </button>
      </div>

      {/* MULTI-LOCATION MATRIX SUB-MODULE */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Multi-Location Physical Stock</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Inventory breakdown across Mumbai, Delhi, Nagpur offices and transit hubs</p>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 px-4">SKU / PRODUCT</th>
                  <th className="p-3.5 px-4 text-center">MUMBAI HUB</th>
                  <th className="p-3.5 px-4 text-center">DELHI HUB</th>
                  <th className="p-3.5 px-4 text-center">NAGPUR HUB</th>
                  <th className="p-3.5 px-4 text-center">IN TRANSIT</th>
                  <th className="p-3.5 px-4 text-center">RESERVED LOCK</th>
                  <th className="p-3.5 px-4 text-right">TOTAL AVAILABLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                {products.map((p) => {
                  const stock = p.stockByLocation || {};
                  const mum = stock['LOC-MUM'] || 0;
                  const del = stock['LOC-DEL'] || 0;
                  const nag = stock['LOC-NAG'] || 0;
                  const transit = stock['LOC-TRANSIT'] || 0;
                  const reserved = stock['Reserved'] || 0;
                  const total = mum + del + nag;

                  return (
                    <tr key={p.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{p.name}</span>
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">{p.sku}</span>
                      </td>

                      <td className="p-3.5 px-4 text-center font-bold text-slate-900 dark:text-slate-200">{mum}</td>
                      <td className="p-3.5 px-4 text-center font-bold text-slate-900 dark:text-slate-200">{del}</td>
                      <td className="p-3.5 px-4 text-center font-bold text-slate-900 dark:text-slate-200">{nag}</td>
                      <td className="p-3.5 px-4 text-center font-bold text-purple-600 dark:text-purple-400">{transit}</td>
                      <td className="p-3.5 px-4 text-center font-bold text-amber-600 dark:text-amber-400">{reserved}</td>
                      <td className="p-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IMMUTABLE LEDGER LOG SUB-MODULE */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Immutable Inventory Ledger</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Complete audit trail of every stock entry, transfer, reservation, and dispatch</p>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 px-4">TIMESTAMP</th>
                  <th className="p-3.5 px-4">TRANSACTION TYPE</th>
                  <th className="p-3.5 px-4">SKU / ITEM</th>
                  <th className="p-3.5 px-4">FROM ➔ TO LOCATION</th>
                  <th className="p-3.5 px-4 text-center">QTY</th>
                  <th className="p-3.5 px-4">USER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                {inventoryLedger.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">No transactions logged yet. Perform a GRN, transfer, or dispatch to see live audit logs.</td>
                  </tr>
                ) : (
                  inventoryLedger.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 px-4 font-mono text-slate-500 text-[11px]">{txn.timestamp}</td>
                      <td className="p-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">{txn.transactionType}</td>
                      <td className="p-3.5 px-4 font-mono text-slate-900 dark:text-white">{txn.productSku}</td>
                      <td className="p-3.5 px-4 text-slate-700 dark:text-slate-300">{txn.fromLocationId} ➔ {txn.toLocationId}</td>
                      <td className="p-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">{txn.quantity}</td>
                      <td className="p-3.5 px-4 text-slate-500">{txn.user}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
