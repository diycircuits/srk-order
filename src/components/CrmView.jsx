import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search } from 'lucide-react';

export const CrmView = () => {
  const { customers, setAddCustomerOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Customer Master Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage customer profiles, billing addresses, and GSTIN records</p>
        </div>
        <button
          onClick={() => setAddCustomerOpen(true)}
          className="bg-[#0062bd] hover:bg-[#0052a3] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
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
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0062bd]"
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
                <td className="p-3.5 px-4 font-mono text-[#0062bd] dark:text-blue-400 font-bold">{c.code}</td>
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
  );
};

