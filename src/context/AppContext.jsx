import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { calculateSlaStatus } from '../engine/WorkflowEngine';
import { performAutomatedStockCheck, recordInventoryTransaction } from '../engine/InventoryLedger';
import { NotificationService, zohoBooksAdapter } from '../engine/IntegrationAdapters';
import { 
  initialOrders, 
  initialCustomers, 
  initialProducts, 
  initialLocations, 
  initialProcurementRequests, 
  initialPurchaseOrders, 
  initialStockTransfers, 
  initialVendors,
  initialNotificationLogs,
  initialAuditLogs,
  initialLeads,
  initialRmaTickets
} from '../data/seedData';

const AppContext = createContext();
const notificationService = new NotificationService();

export const AppProvider = ({ children }) => {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [activeRole, setActiveRole] = useState('Super Admin');

  // Network & Office Server IP Info
  const [networkInfo, setNetworkInfo] = useState({ localIp: 'localhost', frontendLanUrl: 'http://localhost:5173' });

  // Core ERP State Stores
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [customers, setCustomers] = useState(initialCustomers);
  const [leads, setLeads] = useState(initialLeads);
  const [procurementRequests, setProcurementRequests] = useState(initialProcurementRequests);
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [stockTransfers, setStockTransfers] = useState(initialStockTransfers);
  const [inventoryLedger, setInventoryLedger] = useState([]);
  const [notificationLogs, setNotificationLogs] = useState(initialNotificationLogs);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [vendors, setVendors] = useState(initialVendors);
  const [rmaTickets, setRmaTickets] = useState(initialRmaTickets || []);
  const [users, setUsers] = useState([]);
  const [systemConfig, setSystemConfig] = useState({
    companyName: 'SRK Innovation Pvt. Ltd.',
    domainUrl: 'srkinnovation.com',
    defaultCurrency: 'Indian Rupee (₹ INR)',
    taxRate: 18,
    timezone: 'Asia/Kolkata (IST)'
  });

  const [locations] = useState(initialLocations);

  // Modal Overlay Controls
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [orderDetailsOrder, setOrderDetailsOrder] = useState(null);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [addRmaOpen, setAddRmaOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Data from Real Backend REST API & Database
  const fetchAllDataFromDB = useCallback(async () => {
    try {
      const net = await api.getNetworkInfo();
      if (net) setNetworkInfo(net);

      const dbOrders = await api.getOrders();
      if (Array.isArray(dbOrders) && dbOrders.length > 0) setOrders(dbOrders);

      const dbProducts = await api.getProducts();
      if (Array.isArray(dbProducts) && dbProducts.length > 0) setProducts(dbProducts);

      const dbCustomers = await api.getCustomers();
      if (Array.isArray(dbCustomers) && dbCustomers.length > 0) setCustomers(dbCustomers);

      const dbLeads = await api.getLeads();
      if (Array.isArray(dbLeads) && dbLeads.length > 0) setLeads(dbLeads);

      const dbVendors = await api.getVendors();
      if (Array.isArray(dbVendors) && dbVendors.length > 0) setVendors(dbVendors);

      const dbRma = await api.getRmaTickets();
      if (Array.isArray(dbRma) && dbRma.length > 0) setRmaTickets(dbRma);

      const dbUsers = await api.getUsers();
      if (Array.isArray(dbUsers) && dbUsers.length > 0) setUsers(dbUsers);

      const dbSettings = await api.getSettings();
      if (dbSettings && dbSettings.companyName) setSystemConfig(dbSettings);
    } catch {
      // Fallback if backend server is starting up
    }
  }, []);

  // Initial Load & Auto Sync (Polling every 4 seconds across all office laptops)
  useEffect(() => {
    fetchAllDataFromDB();
    const interval = setInterval(() => {
      fetchAllDataFromDB();
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchAllDataFromDB]);

  // Metrics Calculations
  const totalOrdersCount = orders.length;
  const delayedOrdersCount = orders.filter(o => calculateSlaStatus(o).isDelayed).length;
  const procurementPendingCount = orders.filter(o => o.status === 'PROCUREMENT_REQUIRED' || o.status === 'PROCUREMENT_IN_PROGRESS').length;
  const readyToDispatchCount = orders.filter(o => o.status === 'READY_TO_DISPATCH' || o.status === 'PACKING').length;
  
  const availableStock = products.reduce((sum, p) => {
    const locSum = Object.entries(p.stockByLocation || {})
      .filter(([loc]) => loc !== 'Reserved' && loc !== 'LOC-TRANSIT')
      .reduce((s, [, qty]) => s + qty, 0);
    return sum + (locSum || p.stock || 0);
  }, 0);

  const lowStockItemsCount = products.filter(p => {
    const locSum = Object.entries(p.stockByLocation || {})
      .filter(([loc]) => loc !== 'Reserved' && loc !== 'LOC-TRANSIT')
      .reduce((s, [, qty]) => s + qty, 0);
    const effectiveStock = locSum || p.stock || 0;
    return effectiveStock <= (p.minThreshold || p.minStock || 10);
  }).length;

  const totalLeads = leads.length;
  const openLeads = leads.filter(l => l.stage !== 'WON' && l.stage !== 'LOST' && l.stage !== 'Converted').length;
  const wonLeads = leads.filter(l => l.stage === 'WON' || l.stage === 'Converted').length;

  const pendingOrdersCount = orders.filter(o => o.status === 'booked' || o.status === 'NEW' || o.status === 'CONFIRMED' || o.status === 'STOCK_CHECK').length;
  const processingOrdersCount = orders.filter(o => o.status === 'processing' || o.status === 'PROCUREMENT_IN_PROGRESS' || o.status === 'MATERIAL_INCOMING' || o.status === 'PACKING' || o.status === 'QC').length;
  const dispatchPendingCount = orders.filter(o => o.status === 'READY_TO_DISPATCH' || o.status === 'booked' || o.status === 'processing' || o.status === 'partially delivered').length;

  const pendingPaymentsTotal = orders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);
  const receivedPaymentsTotal = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
  const monthlyRevenueTotal = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Actions: Add Customer
  const addCustomer = async (customerData) => {
    try {
      const created = await api.createCustomer(customerData);
      setCustomers(prev => [created, ...prev]);
    } catch {
      const fallback = { id: `cust-${Date.now()}`, ...customerData };
      setCustomers(prev => [fallback, ...prev]);
    }
  };

  // Actions: Add Product
  const addProduct = async (productData) => {
    try {
      const created = await api.createProduct(productData);
      setProducts(prev => [created, ...prev]);
    } catch {
      const fallback = { id: `prod-${Date.now()}`, ...productData };
      setProducts(prev => [fallback, ...prev]);
    }
  };

  // Action: Update Stock
  const updateStock = async (productId, newStockVal) => {
    try {
      await api.updateStock(productId, newStockVal);
      setProducts(prev => prev.map(p => (p.id === productId || p.sku === productId) ? { ...p, stock: parseInt(newStockVal, 10) } : p));
    } catch {
      // Local optimistic fallback
    }
  };

  // Actions: Add Vendor
  const addVendor = async (vendorData) => {
    try {
      const created = await api.createVendor(vendorData);
      setVendors(prev => [created, ...prev]);
    } catch {
      const fallback = { id: `v-${Date.now()}`, ...vendorData };
      setVendors(prev => [fallback, ...prev]);
    }
  };

  // Actions: Add Lead & Convert Lead
  const addLead = async (leadData) => {
    try {
      const created = await api.createLead(leadData);
      setLeads(prev => [created, ...prev]);
    } catch {
      const fallback = { id: `LEAD-${Date.now()}`, ...leadData };
      setLeads(prev => [fallback, ...prev]);
    }
  };

  const convertLeadToOrder = async (leadId) => {
    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead) return;

    try {
      await api.updateLeadStage(leadId, 'WON');
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: 'WON' } : l));

      await addOrder({
        source: 'Sales Lead Conversion',
        customerName: targetLead.companyName,
        customerEmail: targetLead.email,
        customerPhone: targetLead.phone,
        totalAmount: targetLead.value || 50000,
        paymentStatus: 'unpaid',
        items: [
          { sku: products[0]?.sku || 'SRK-RFID-RDR-4P', name: products[0]?.name || 'SRK Fixed 4-Port Reader', qty: 2, unitPrice: products[0]?.unitPrice || 18500 }
        ]
      });
    } catch {
      // Fallback
    }
  };

  // Actions: Service RMA Tickets
  const addRmaTicket = async (rmaData) => {
    try {
      const created = await api.createRmaTicket(rmaData);
      setRmaTickets(prev => [created, ...prev]);
    } catch {
      const fallback = { id: `RMA-${Date.now()}`, ...rmaData };
      setRmaTickets(prev => [fallback, ...prev]);
    }
  };

  const updateRmaStatus = async (ticketId, status) => {
    try {
      await api.updateRmaStatus(ticketId, status);
      setRmaTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    } catch {
      // Fallback
    }
  };

  // Actions: Add User & Settings
  const addUser = async (userData) => {
    try {
      const created = await api.createUser(userData);
      setUsers(prev => [created, ...prev]);
    } catch {
      const fallback = { id: `usr-${Date.now()}`, ...userData };
      setUsers(prev => [fallback, ...prev]);
    }
  };

  const updateSystemSettings = async (newConfig) => {
    try {
      await api.updateSettings(newConfig);
      setSystemConfig(newConfig);
    } catch {
      setSystemConfig(newConfig);
    }
  };

  // Action: Add Order (Push to SQL DB)
  const addOrder = async (newOrderData) => {
    try {
      const created = await api.createOrder(newOrderData);
      setOrders(prev => [created, ...prev]);

      const waLog = notificationService.sendWhatsAppNotification({
        orderId: created.id,
        customerName: created.customerName,
        phone: created.customerPhone,
        templateType: 'ORDER_CONFIRMED',
        variables: {
          customer_name: created.customerName,
          order_number: created.id,
          tracking_url: `https://track.srkinnovations.com/${created.id}`
        }
      });
      if (waLog && waLog.id) setNotificationLogs(prev => [waLog, ...prev]);

      setCreateOrderOpen(false);
    } catch {
      // Fallback
    }
  };

  // Action: Delete Order
  const deleteOrder = async (orderId) => {
    try {
      if (api.deleteOrder) {
        await api.deleteOrder(orderId);
      }
    } catch (err) {
      console.error("Delete order error:", err);
    }
    setOrders(prev => prev.filter(o => o.id !== orderId && o.orderId !== orderId));
    if (orderDetailsOrder && (orderDetailsOrder.id === orderId || orderDetailsOrder.orderId === orderId)) {
      setOrderDetailsOrder(null);
    }
  };

  // Action: Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, activeRole);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, stage: newStatus } : o));
    }
  };

  // Action: Forward Order Stage in Workflow Engine
  const forwardOrder = async (orderId, fromStage, toStage, remarks, forwardedBy) => {
    try {
      await api.updateOrderStatus(orderId, toStage, forwardedBy || activeRole);
      setOrders(prev => prev.map(o => {
        if (o.id === orderId || o.orderId === orderId) {
          return {
            ...o,
            stage: toStage,
            status: toStage,
            updatedAt: new Date().toISOString(),
            remarks: remarks || o.remarks
          };
        }
        return o;
      }));
    } catch {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId || o.orderId === orderId) {
          return {
            ...o,
            stage: toStage,
            status: toStage,
            updatedAt: new Date().toISOString(),
            remarks: remarks || o.remarks
          };
        }
        return o;
      }));
    }
  };

  // Action: Update Order Priority
  const updateOrderPriority = (orderId, priority) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderId === orderId) {
        return { ...o, priority, updatedAt: new Date().toISOString() };
      }
      return o;
    }));
  };

  // Action: Add Order Note
  const addOrderNote = (orderId, noteText) => {
    const noteObj = { id: `note-${Date.now()}`, note: noteText, author: activeRole || 'Admin', timestamp: new Date().toISOString() };
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderId === orderId) {
        const currentNotes = o.notes || [];
        return { ...o, notes: [noteObj, ...currentNotes], updatedAt: new Date().toISOString() };
      }
      return o;
    }));
  };

  // Action: Add Order Attachment
  const addOrderAttachment = (orderId, attachmentObj) => {
    const fileItem = { id: `file-${Date.now()}`, name: attachmentObj.name, url: attachmentObj.url || '#', uploadedBy: activeRole || 'Admin', timestamp: new Date().toISOString() };
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderId === orderId) {
        const currentFiles = o.attachments || [];
        return { ...o, attachments: [fileItem, ...currentFiles], updatedAt: new Date().toISOString() };
      }
      return o;
    }));
  };

  // Action: Create PO from PR
  const createPurchaseOrder = (prId, vendorId) => {
    const pr = procurementRequests.find(p => p.id === prId);
    const vendor = vendors.find(v => v.id === vendorId) || vendors[0];
    if (!pr) return;

    const poId = `SRK-PO-2026-${String(purchaseOrders.length + 46).padStart(6, '0')}`;
    const newPO = {
      id: poId,
      procurementReqId: pr.id,
      orderId: pr.orderId,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      items: [
        { sku: pr.productSku, name: pr.productName, qty: pr.shortageQty, unitPrice: 12500.00, subtotal: pr.shortageQty * 12500.00 }
      ],
      totalAmount: pr.shortageQty * 12500.00,
      expectedDelivery: '3 Days',
      destinationLocation: 'LOC-MUM',
      status: 'SENT_TO_VENDOR'
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    setProcurementRequests(prev => prev.map(p => p.id === prId ? { ...p, status: 'PO_CREATED' } : p));
    updateOrderStatus(pr.orderId, 'PROCUREMENT_IN_PROGRESS');
  };

  // Action: GRN Receipt
  const processGRNReceipt = (poId, receivedQty) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status: 'RECEIVED' } : p));

    setProducts(prevProducts => prevProducts.map(p => {
      const hasSku = p.sku === po.items[0]?.sku;
      if (hasSku) {
        const currentLocStock = p.stockByLocation['LOC-MUM'] || 0;
        return {
          ...p,
          stockByLocation: {
            ...p.stockByLocation,
            'LOC-MUM': currentLocStock + receivedQty
          }
        };
      }
      return p;
    }));

    const newLedger = recordInventoryTransaction(inventoryLedger, {
      productId: po.items[0]?.sku,
      productSku: po.items[0]?.sku,
      transactionType: 'PURCHASE_RECEIPT',
      fromLocationId: po.vendorName,
      toLocationId: 'LOC-MUM',
      quantity: receivedQty,
      referenceId: po.id,
      user: activeRole
    });
    setInventoryLedger(newLedger);

    if (po.orderId) {
      updateOrderStatus(po.orderId, 'MATERIAL_RECEIVED');
    }
  };

  // Action: Ingest Webhook
  const ingestShopifyWebhookOrder = async (rawPayload) => {
    try {
      await api.simulateWebhook(rawPayload);
      fetchAllDataFromDB();
    } catch {
      // Fallback
    }
  };

  const trackOrderById = (queryId) => {
    if (!queryId) return null;
    const cleaned = queryId.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === cleaned || o.id.toUpperCase().includes(cleaned));
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      activeSubTab,
      setActiveSubTab,
      activeRole,
      setActiveRole,
      networkInfo,
      orders,
      products,
      customers,
      leads,
      locations,
      vendors,
      rmaTickets,
      users,
      systemConfig,
      procurementRequests,
      purchaseOrders,
      stockTransfers,
      inventoryLedger,
      notificationLogs,
      auditLogs,
      trackingOrder,
      setTrackingOrder,
      orderDetailsOrder,
      setOrderDetailsOrder,
      createOrderOpen,
      setCreateOrderOpen,
      addCustomerOpen,
      setAddCustomerOpen,
      addProductOpen,
      setAddProductOpen,
      addVendorOpen,
      setAddVendorOpen,
      addRmaOpen,
      setAddRmaOpen,
      addLeadOpen,
      setAddLeadOpen,
      addUserOpen,
      setAddUserOpen,
      viewInvoiceOrder,
      setViewInvoiceOrder,
      searchQuery,
      setSearchQuery,
      // Key Metrics
      totalOrdersCount,
      delayedOrdersCount,
      procurementPendingCount,
      readyToDispatchCount,
      totalAvailableUnits: availableStock,
      availableStock,
      lowStockItemsCount,
      totalLeads,
      openLeads,
      wonLeads,
      pendingOrdersCount,
      processingOrdersCount,
      dispatchPendingCount,
      pendingPaymentsTotal,
      receivedPaymentsTotal,
      monthlyRevenueTotal,
      // Actions
      addOrder,
      addCustomer,
      addProduct,
      updateStock,
      addVendor,
      addLead,
      convertLeadToOrder,
      addRmaTicket,
      updateRmaStatus,
      addUser,
      updateSystemSettings,
      updateOrderStatus,
      deleteOrder,
      forwardOrder,
      updateOrderPriority,
      addOrderNote,
      addOrderAttachment,
      createPurchaseOrder,
      processGRNReceipt,
      ingestShopifyWebhookOrder,
      trackOrderById
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
