import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus } from 'lucide-react';

export const AddCustomerModal = () => {
  const { addCustomerOpen, setAddCustomerOpen, addCustomer } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('Enterprise B2B');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');

  if (!addCustomerOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    addCustomer({
      name,
      code: code || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      email,
      phone,
      type,
      gstin: gstin || '27AAACA1234F1Z9',
      address: address || 'Corporate Hub, Mumbai'
    });

    setName('');
    setCode('');
    setEmail('');
    setPhone('');
    setGstin('');
    setAddress('');
    setAddCustomerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-5 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Add New Customer Account</h2>
              <p className="text-xs text-slate-500 font-medium">Create client profile & GSTIN record</p>
            </div>
          </div>

          <button
            onClick={() => setAddCustomerOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Company / Customer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Consultancy Services"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Customer Code</label>
              <input
                type="text"
                placeholder="CUST-104"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Account Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Enterprise B2B">Enterprise B2B</option>
                <option value="Government & PSU">Government & PSU</option>
                <option value="System Integrator">System Integrator</option>
                <option value="Direct Retail">Direct Retail</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="procurement@client.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98200 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">GSTIN Number</label>
            <input
              type="text"
              placeholder="27AAACA1234F1Z9"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Billing & Shipping Address</label>
            <textarea
              rows="2"
              placeholder="Full office or warehouse address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setAddCustomerOpen(false)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-blue-500/20"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
