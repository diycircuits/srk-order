import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Bell, ExternalLink, Zap, ShieldCheck, RefreshCw, Sun, Moon, Wifi } from 'lucide-react';

export const Header = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setCreateOrderOpen, 
    setActiveTab, 
    activeTab, 
    activeRole, 
    setActiveRole,
    delayedOrdersCount,
    ingestShopifyWebhookOrder,
    networkInfo 
  } = useApp();

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSimulateShopifyWebhook = () => {
    ingestShopifyWebhookOrder({
      id: Math.floor(100000 + Math.random() * 900000),
      customer: { first_name: "Shopify", last_name: "Buyer" },
      email: "buyer@shopify.com",
      total_price: "37000.00",
      line_items: [
        { sku: "SRK-RFID-RDR-4P", title: "SRK Fixed 4-Port RFID Reader", quantity: 2, price: "18500.00" }
      ]
    });
  };

  return (
    <header className="glass-header sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-sm border-b border-slate-200 dark:border-slate-800">
      {/* Left Brand Title */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                SRK Innovations
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center space-x-1">
                <Wifi className="w-3 h-3 animate-pulse text-emerald-500" />
                <span>Office SaaS Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Open on any laptop: <strong className="text-blue-600 dark:text-blue-400 font-mono">{networkInfo.frontendLanUrl || 'http://localhost:5173'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID (SRK-ORD-...), SKU, Customer, AWB, EPC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher Dropdown */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Role:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            className="bg-transparent text-blue-700 dark:text-blue-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="Super Admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Super Admin</option>
            <option value="Management" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Management</option>
            <option value="Sales Team" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sales Team</option>
            <option value="Purchase Team" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Purchase Team</option>
            <option value="Warehouse Manager" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Warehouse Manager</option>
            <option value="Dispatch Manager" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Dispatch Manager</option>
            <option value="Accounts Team" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Accounts Team</option>
            <option value="Service & RMA" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Service & RMA</option>
          </select>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Light / Dark Theme Mode"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Simulate Shopify Order Webhook Button */}
        <button
          onClick={handleSimulateShopifyWebhook}
          title="Trigger Real HTTP Webhook API to Express backend server"
          className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 transition-all"
        >
          <RefreshCw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden xl:inline">Shopify Webhook</span>
        </button>

        {/* Public Tracking Portal Toggle */}
        <button
          onClick={() => setActiveTab('public-track')}
          className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${
            activeTab === 'public-track' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
              : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">Track Portal</span>
        </button>

        {/* Book Order Quick Action */}
        <button
          onClick={() => setCreateOrderOpen(true)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold">Book Order</span>
        </button>

        {/* SLA Delay Notification Bell */}
        <button 
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {delayedOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {delayedOrdersCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div 
            title={`Role: ${activeRole}`}
            className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-sm cursor-pointer hover:opacity-90"
          >
            {activeRole.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
