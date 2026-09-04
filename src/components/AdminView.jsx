import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Settings, RefreshCw, Download, Plus, ShieldCheck, Database, Lock } from 'lucide-react';

export const AdminView = () => {
  const { 
    users, 
    systemConfig, 
    setAddUserOpen, 
    updateSystemSettings 
  } = useApp();

  const [companyName, setCompanyName] = useState(systemConfig.companyName || 'SRK Innovation Pvt. Ltd.');
  const [domainUrl, setDomainUrl] = useState(systemConfig.domainUrl || 'srkinnovations.com');
  const [defaultCurrency, setDefaultCurrency] = useState(systemConfig.defaultCurrency || 'Indian Rupee (₹ INR)');
  const [taxRate, setTaxRate] = useState(systemConfig.taxRate || 18);
  const [timezone, setTimezone] = useState(systemConfig.timezone || 'Asia/Kolkata (IST)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [backups, setBackups] = useState([]);
  const [backupStatus, setBackupStatus] = useState('');

  const fetchBackups = async () => {
    try {
      const res = await fetch('/api/admin/backups');
      if (res.ok) {
        const data = await res.json();
        setBackups(data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateSnapshot = async () => {
    setBackupStatus('Creating backup snapshot...');
    try {
      const res = await fetch('/api/admin/backups/create', { method: 'POST' });
      if (res.ok) {
        setBackupStatus('✅ Database snapshot created successfully!');
        fetchBackups();
      }
    } catch (err) {
      setBackupStatus('❌ Backup failed: ' + err.message);
    }
    setTimeout(() => setBackupStatus(''), 4000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateSystemSettings({
      companyName,
      domainUrl,
      defaultCurrency,
      taxRate: parseFloat(taxRate) || 18,
      timezone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Administration & System Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage user access roles, system configurations, and Zero Data Loss SQL backups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles & Access Control Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">User Accounts & Access Permissions</h3>
            </div>
            <button
              onClick={() => setAddUserOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee User</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">{u.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="badge-status status-delivered">{u.role}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20">
                    Active Login
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Configuration Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">SRK Innovations Configuration</h3>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Domain URL</label>
                <input
                  type="text"
                  value={domainUrl}
                  onChange={(e) => setDomainUrl(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Standard Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Default Currency</label>
                <input
                  type="text"
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">✓ System Config Saved</span>
              ) : <span></span>}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Database Tools & Zero Data Loss Backups Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Zero Data Loss WAL Engine & Backups</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automated SQL snapshots in server/backups/ every 6 hours</p>
            </div>
          </div>
          
          <button
            onClick={handleCreateSnapshot}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-md active:scale-95 transition-all"
          >
            <Database className="w-4 h-4" />
            <span>Create Instant Backup Snapshot</span>
          </button>
        </div>

        {backupStatus && (
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
            {backupStatus}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Historical Database Snapshot Files ({backups.length})</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 text-xs">
            {backups.map((b, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                <div className="flex items-center space-x-2">
                  <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{b.fileName}</span>
                  <span className="text-slate-400">({b.sizeMb})</span>
                </div>
                <span className="text-slate-500">{new Date(b.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
