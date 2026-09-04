import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  Bell, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Sun, 
  Moon, 
  Wifi, 
  Menu, 
  ChevronDown, 
  Phone, 
  Mail,
  Tag,
  Radio,
  ScanBarcode,
  Printer,
  Home
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
    delayedOrdersCount,
    ingestShopifyWebhookOrder
  } = useApp();

  const [theme, setTheme] = useState('light');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

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

  const categories = [
    { label: "Home", tab: "dashboard", icon: Home, query: "" },
    { label: "RFID Tags", tab: "orders", icon: Tag, query: "RFID" },
    { label: "RFID Reader", tab: "orders", icon: Radio, query: "Reader" },
    { label: "Barcode Scanner", tab: "orders", icon: ScanBarcode, query: "Scanner" },
    { label: "Label printer", tab: "orders", icon: Printer, query: "Printer" },
  ];

  const handleCategoryClick = (cat) => {
    setActiveTab(cat.tab);
    if (cat.query) {
      setSearchQuery(cat.query);
    } else {
      setSearchQuery('');
    }
    setShowCategoryMenu(false);
  };

  return (
    <div className="sticky top-0 z-40 flex flex-col shadow-sm">
      {/* 1. TOP ANNOUNCEMENT STRIP (Black bar matching www.srkinnovations.com) */}
      <div className="bg-[#0b1120] text-slate-200 text-[11px] font-medium py-1.5 px-4 overflow-hidden border-b border-slate-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-amber-400">★</span>
            <span className="text-slate-300 hidden sm:inline">SRK Innovations deals only through authorized email IDs & official numbers.</span>
            <span className="text-amber-400">★</span>
            <span className="text-white font-semibold">Free Shipping on orders above ₹5,999 with code <span className="text-amber-300 underline font-mono">FREESHIPPING</span></span>
            <span className="text-amber-400 hidden md:inline">★</span>
            <span className="text-slate-400 hidden lg:inline">🔒 Official SRK ERP & Dispatch Gate</span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 shrink-0 text-slate-300 font-mono text-[11px]">
            <a href="tel:+918411958300" className="hover:text-white flex items-center space-x-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91 8411958300</span>
            </a>
            <a href="mailto:info@srkinnovations.com" className="hover:text-white flex items-center space-x-1">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>info@srkinnovations.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search Box with Cobalt Blue Button, Action Buttons) */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 lg:px-8 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
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
              <option value="Service & RMA" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Service & RMA</option>
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

          {/* SLA Delay Notification Bell */}
          <button 
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
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
              className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#0062bd] to-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-sm cursor-pointer hover:opacity-90"
            >
              {activeRole.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* 3. SIGNATURE COBALT BLUE CATEGORY NAVBAR (Exact from SRK Innovations website) */}
      <nav className="bg-[#0062bd] text-white px-4 lg:px-8 py-2 flex items-center justify-between text-xs font-semibold shadow-inner">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Browse All Categories Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center space-x-2 bg-[#004f98] hover:bg-[#004280] px-3.5 py-1.5 rounded-lg text-white font-bold tracking-wide transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>BROWSE ALL CATEGORY</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {showCategoryMenu && (
              <div className="absolute left-0 top-full mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-slate-800 dark:text-slate-100 text-xs">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCategoryClick(cat)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center space-x-2.5 transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-[#0062bd]" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Category Links */}
          <div className="hidden md:flex items-center space-x-1 pl-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat)}
                className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white text-blue-50 transition-colors cursor-pointer font-medium"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info on Right */}
        <div className="hidden lg:flex items-center space-x-4 text-[11px] font-normal text-blue-100">
          <span className="flex items-center space-x-1">
            <span>☎</span>
            <span className="font-semibold text-white">+91 8411958300</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <span>✉</span>
            <span className="font-semibold text-white">info@srkinnovations.com</span>
          </span>
        </div>
      </nav>
    </div>
  );
};

