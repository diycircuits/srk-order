import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { MyTasksView } from './components/MyTasksView';
import { OrdersView } from './components/OrdersView';
import { InventoryLocationModule } from './components/InventoryLocationModule';
import { FulfillmentModule } from './components/FulfillmentModule';
import { CrmView } from './components/CrmView';
import { CatalogView } from './components/CatalogView';
import { IntegrationsView } from './components/IntegrationsView';
import { AdminView } from './components/AdminView';
import { PublicTrackingPortal } from './components/PublicTrackingPortal';

import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrderDetailsView } from './components/OrderDetailsView';
import { CreateOrderModal } from './components/CreateOrderModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AddCustomerModal } from './components/AddCustomerModal';
import { AddProductModal } from './components/AddProductModal';
import { AddVendorModal } from './components/AddVendorModal';
import { AddUserModal } from './components/AddUserModal';

const MainLayout = () => {
  const { activeTab } = useApp();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0062bd] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Loading SRK Innovations ERP...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && activeTab !== 'public-track') {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {activeTab !== 'public-track' && <Sidebar />}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'kanban' && <KanbanBoardView />}
          {activeTab === 'my-tasks' && <MyTasksView />}
          {activeTab === 'orders' && <OrdersView />}
          {activeTab === 'inventory' && <InventoryLocationModule />}
          {activeTab === 'transfers' && <InventoryLocationModule />}
          {activeTab === 'dispatch' && <FulfillmentModule />}
          {activeTab === 'crm' && <CrmView />}
          {activeTab === 'catalog' && <CatalogView />}
          {activeTab === 'integrations' && <IntegrationsView />}
          {activeTab === 'admin' && <AdminView />}
          {activeTab === 'public-track' && <PublicTrackingPortal />}
        </main>
      </div>

      {/* Global Modals */}
      <OrderTrackingModal />
      <OrderDetailsView />
      <CreateOrderModal />
      <InvoiceModal />
      <AddCustomerModal />
      <AddProductModal />
      <AddVendorModal />
      <AddUserModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
