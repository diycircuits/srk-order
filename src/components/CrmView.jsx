import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Plus, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CrmView = () => {
  const { customers, leads, activeSubTab, setActiveSubTab, setAddCustomerOpen, setAddLeadOpen, convertLeadToOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Sub-tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Records</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leads')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'leads' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Sales Leads Pipeline</span>
        </button>
      </div>

      {/* CUSTOMERS SUBMODULE */}
      {activeSubTab === 'customers' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Customer Master Directory</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage customer profiles, billing addresses, and GSTIN records</p>
            </div>
            <button
              onClick={() => setAddCustomerOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer name, code, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 px-4">CUSTOMER NAME</th>
                  <th className="p-3.5 px-4">CODE</th>
                  <th className="p-3.5 px-4">EMAIL</th>
                  <th className="p-3.5 px-4">PHONE</th>
                  <th className="p-3.5 px-4">TYPE</th>
                  <th className="p-3.5 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 px-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="p-3.5 px-4 font-mono text-blue-600 dark:text-blue-400 font-bold">{c.code}</td>
                    <td className="p-3.5 px-4 text-slate-600 dark:text-slate-300">{c.email}</td>
                    <td className="p-3.5 px-4 text-slate-600 dark:text-slate-300">{c.phone}</td>
                    <td className="p-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{c.type}</td>
                    <td className="p-3.5 px-4"><span className="badge-status status-delivered">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LEADS SUBMODULE */}
      {activeSubTab === 'leads' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sales Leads Pipeline</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track prospective corporate accounts and hardware lead conversions</p>
            </div>
            <button
              onClick={() => setAddLeadOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sales Lead</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{lead.id}</span>
                    <span className="badge-status status-processing">{lead.stage}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{lead.contactName}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{lead.companyName}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pipeline Value:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm">₹{lead.value.toFixed(2)}</strong>
                  </div>

                  {lead.stage === 'WON' ? (
                    <div className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-center font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Converted to Order</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => convertLeadToOrder(lead.id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <span>Convert to Sales Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
