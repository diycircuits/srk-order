import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Sun, 
  Moon, 
  Wifi
} from 'lucide-react';

export const Header = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setCreateOrderOpen, 
    setActiveTab, 
    activeTab, 
    activeRole, 
    setActiveRole,
    ingestShopifyWebhookOrder
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 lg:px-8 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Left Brand Title */}
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md shadow-blue-500/20 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="./srk-logo.png" alt="SRK Innovations" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-[#0062bd] transition-colors">
                  SRK Innovations
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center space-x-1">
                  <Wifi className="w-3 h-3 animate-pulse text-emerald-500" />
                  <span>Live ERP</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                srkinnovations.com • <strong className="text-[#0062bd] dark:text-blue-400 font-mono">srkorder.radical-global.com</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Center Search Bar with SRK Blue Search Button */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full flex items-center shadow-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search RFID tags, readers, barcode scanners, orders, AWB, EPC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-l-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0062bd] focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button 
              type="button"
              className="bg-[#0062bd] hover:bg-[#0052a3] text-white px-4 py-2 rounded-r-xl border border-[#0062bd] transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Role Switcher Dropdown */}
          <div className="hidden lg:flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0062bd] dark:text-blue-400" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-transparent text-[#0062bd] dark:text-blue-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Super Admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Super Admin</option>
              <option value="Management" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Management</option>
              <option value="Sales Team" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sales Team</option>
              <option value="Purchase Team" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Purchase Team</option>
              <option value="Warehouse Manager" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Warehouse Manager</option>
              <option value="Dispatch Manager" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Dispatch Manager</option>
              <option value="Accounts Team" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Accounts Team</option>
            </select>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Light / Dark Theme Mode"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Simulate Shopify Order Webhook Button */}
          <button
            onClick={handleSimulateShopifyWebhook}
            title="Trigger Real HTTP Webhook API to Express backend server"
            className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline">Shopify Sync</span>
          </button>

          {/* Public Tracking Portal Toggle */}
          <button
            onClick={() => setActiveTab('public-track')}
            className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border cursor-pointer ${
              activeTab === 'public-track' 
                ? 'bg-[#0062bd] text-white border-[#0062bd] shadow-md shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[#0062bd] dark:text-blue-300 border-blue-200 dark:border-slate-700'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Track Portal</span>
          </button>

          {/* Book Order Quick Action in SRK Cobalt Blue */}
          <button
            onClick={() => setCreateOrderOpen(true)}
            className="flex items-center space-x-1.5 bg-[#0062bd] hover:bg-[#0052a3] text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold">Book Order</span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div 
              title={`Role: ${activeRole}`}
              className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#0062bd] to-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-sm cursor-pointer hover:opacity-90"
            >
              {activeRole.charAt(0)}
            </div>
          </div>
        </div>
      </header>
  );
};


