import React from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const ServiceRmaModule = () => {
  const { rmaTickets, setAddRmaOpen, updateRmaStatus } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Service, RMA & Warranty Tickets</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Track hardware repair complaints by serial number or RFID EPC tag</p>
        </div>
        <button
          onClick={() => setAddRmaOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Service Ticket</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 font-bold text-sm">
          <Wrench className="w-5 h-5" />
          <span>Active Service & Repair Tickets ({rmaTickets.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">TICKET #</th>
                <th className="p-3">PRODUCT / RFID EPC</th>
                <th className="p-3">CUSTOMER</th>
                <th className="p-3">ISSUE DESCRIPTION</th>
                <th className="p-3 text-center">WARRANTY STATUS</th>
                <th className="p-3 text-center">TICKET STATUS</th>
                <th className="p-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {rmaTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{ticket.id}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{ticket.productName}</span>
                    <span className="text-[10px] font-mono text-slate-500">EPC: {ticket.epcTag}</span>
                  </td>
                  <td className="p-3 text-slate-900 dark:text-slate-200 font-semibold">{ticket.customerName}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{ticket.issueDescription}</td>
                  <td className="p-3 text-center">
                    <span className="badge-status status-delivered">{ticket.warrantyStatus}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="badge-status status-processing">{ticket.status}</span>
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={ticket.status}
                      onChange={(e) => updateRmaStatus(ticket.id, e.target.value)}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-[11px] font-bold text-slate-900 dark:text-white"
                    >
                      <option value="DIAGNOSING">DIAGNOSING</option>
                      <option value="REPAIRED">REPAIRED</option>
                      <option value="REPLACED">REPLACED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
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
