import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wrench } from 'lucide-react';

export const AddRmaModal = () => {
  const { addRmaOpen, setAddRmaOpen, addRmaTicket, customers, products } = useApp();

  const [productName, setProductName] = useState(products[0]?.name || 'SRK Fixed 4-Port Reader');
  const [epcTag, setEpcTag] = useState('');
  const [customerName, setCustomerName] = useState(customers[0]?.name || 'Acme Logistics India');
  const [issueDescription, setIssueDescription] = useState('');
  const [warrantyStatus, setWarrantyStatus] = useState('Active Warranty');

  if (!addRmaOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName || !issueDescription) return;

    addRmaTicket({
      productName,
      epcTag: epcTag || `EPC-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      issueDescription,
      warrantyStatus,
      status: 'DIAGNOSING'
    });

    setEpcTag('');
    setIssueDescription('');
    setAddRmaOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-5 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Create Service / RMA Ticket</h2>
              <p className="text-xs text-slate-500 font-medium">Log hardware repair or warranty replacement</p>
            </div>
          </div>

          <button
            onClick={() => setAddRmaOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Target Product Hardware *</label>
            <select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
            >
              {products.map(p => (
                <option key={p.id} value={p.name}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Serial / RFID EPC Tag</label>
              <input
                type="text"
                placeholder="E28069150000402430B2..."
                value={epcTag}
                onChange={(e) => setEpcTag(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Warranty Status</label>
              <select
                value={warrantyStatus}
                onChange={(e) => setWarrantyStatus(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Active Warranty">Active Warranty</option>
                <option value="Out of Warranty (Paid)">Out of Warranty (Paid)</option>
                <option value="Extended AMC">Extended AMC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Customer Account *</label>
            <select
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
            >
              {customers.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Issue / Fault Symptom *</label>
            <textarea
              rows="3"
              required
              placeholder="Describe the hardware symptom or failure mode..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setAddRmaOpen(false)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-blue-500/20"
            >
              Log RMA Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
