import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Lock } from 'lucide-react';

export const AddUserModal = () => {
  const { addUserOpen, setAddUserOpen, addUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('srk12345');
  const [role, setRole] = useState('Dispatch Manager');

  if (!addUserOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    await addUser({
      name,
      email,
      password,
      role,
      status: 'Active'
    });

    setName('');
    setEmail('');
    setPassword('srk12345');
    setAddUserOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-5 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Add Employee Login Account</h2>
              <p className="text-xs text-slate-500 font-medium">Create login credentials & role permissions</p>
            </div>
          </div>

          <button
            onClick={() => setAddUserOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Employee Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email / Login ID *</label>
            <input
              type="email"
              required
              placeholder="vikram@srkinnovation.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Assigned Password *</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Assigned Access Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Management">Management</option>
              <option value="Sales Team">Sales Team</option>
              <option value="Purchase Team">Purchase Team</option>
              <option value="Warehouse Manager">Warehouse Manager</option>
              <option value="Dispatch Manager">Dispatch Manager</option>
              <option value="Accounts Team">Accounts Team</option>
              <option value="Service & RMA">Service & RMA</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setAddUserOpen(false)}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-blue-500/20"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
