import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Columns,
  ListTodo,
  ShoppingBag, 
  Truck, 
  PackageCheck, 
  Send, 
  Users, 
  BookOpen, 
  Wrench, 
  BarChart3, 
  Sliders, 
  ChevronRight,
  Warehouse,
  Bell,
  UserCheck,
  Calendar
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, activeSubTab, setActiveSubTab, delayedOrdersCount } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban Board', icon: Columns },
    { id: 'orders', label: 'All Orders', icon: ShoppingBag },
    { id: 'my-tasks', label: 'My Tasks', icon: ListTodo },
    { 
      id: 'inventory', 
      label: 'Inventory & Locations', 
      icon: Warehouse,
      submodules: [
        { id: 'matrix', label: 'Multi-Office Matrix' },
        { id: 'ledger', label: 'Immutable Ledger Log' }
      ] 
    },
    { id: 'transfers', label: 'Inter-Office Transfers', icon: Send },
    { id: 'fulfillment', label: 'Packing, QC & RFID Scan', icon: PackageCheck },
    { id: 'dispatch', label: 'Dispatch & Couriers', icon: Truck },
    { 
      id: 'crm', 
      label: 'CRM', 
      icon: Users,
      submodules: [
        { id: 'customers', label: 'Customers' },
        { id: 'leads', label: 'Leads Pipeline' }
      ] 
    },
    { 
      id: 'catalog', 
      label: 'Catalog & Zoho Books', 
      icon: BookOpen,
      submodules: [
        { id: 'products', label: 'Products & SKUs' },
        { id: 'invoices', label: 'Zoho Invoices' }
      ] 
    },
    { id: 'hr', label: 'Human Resources (HR)', icon: UserCheck },
    { id: 'collaboration', label: 'Collaboration & Agenda', icon: Calendar },
    { id: 'service', label: 'Service & RMA', icon: Wrench },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Internal Alerts', icon: Bell, badge: delayedOrdersCount > 0 ? String(delayedOrdersCount) : null },
    { id: 'integrations', label: 'Integrations & Config', icon: Sliders }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[calc(100vh-61px)] p-4 select-none shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            SRK Innovations ERP
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const hasSub = item.submodules && item.submodules.length > 0;

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (hasSub) setActiveSubTab(item.submodules[0].id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all group ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 font-bold shadow-sm' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 group-hover:text-slate-700'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200">
                        {item.badge}
                      </span>
                    )}

                    {hasSub && (
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform text-slate-400 ${isActive ? 'rotate-90 text-blue-600' : ''}`} />
                    )}
                  </button>

                  {/* Submodules when active */}
                  {isActive && hasSub && (
                    <div className="ml-4 pl-3 border-l border-blue-200 dark:border-blue-500/20 space-y-1 py-1">
                      {item.submodules.map((sub) => {
                        const isSubActive = activeSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab(item.id);
                              setActiveSubTab(sub.id);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                              isSubActive 
                                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-bold' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Branding Info */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <div className="flex items-center space-x-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Single Source of Truth</span>
        </div>
        <p className="text-[11px] text-slate-400">2026 © srkinnovation.com</p>
      </div>
    </aside>
  );
};
