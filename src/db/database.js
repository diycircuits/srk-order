import { 
  initialOrders, 
  initialProducts, 
  initialCustomers, 
  initialLeads, 
  initialPurchaseOrders, 
  initialRmaTickets, 
  initialVendors, 
  initialAuditLogs 
} from '../data/seedData';

const DB_NAME = 'SRK_OrderManagement_DB';
const DB_VERSION = 1;

export const STORES = {
  ORDERS: 'orders',
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  LEADS: 'leads',
  PURCHASE_ORDERS: 'purchaseOrders',
  RMA_TICKETS: 'rmaTickets',
  VENDORS: 'vendors',
  AUDIT_LOGS: 'auditLogs',
  USERS: 'users',
  SETTINGS: 'settings'
};

export class IndexedDBEngine {
  static db = null;

  static async openDB() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORES.ORDERS)) {
          db.createObjectStore(STORES.ORDERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
          db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.CUSTOMERS)) {
          db.createObjectStore(STORES.CUSTOMERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.LEADS)) {
          db.createObjectStore(STORES.LEADS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PURCHASE_ORDERS)) {
          db.createObjectStore(STORES.PURCHASE_ORDERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.RMA_TICKETS)) {
          db.createObjectStore(STORES.RMA_TICKETS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.VENDORS)) {
          db.createObjectStore(STORES.VENDORS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.AUDIT_LOGS)) {
          db.createObjectStore(STORES.AUDIT_LOGS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          db.createObjectStore(STORES.USERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  static async getAll(storeName) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  static async put(storeName, value) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  static async putMany(storeName, valuesArray) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      valuesArray.forEach(item => store.put(item));

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  static async delete(storeName, id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  static async clearStore(storeName) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  static async initializeDatabaseIfEmpty() {
    await this.openDB();
    const existingOrders = await this.getAll(STORES.ORDERS);

    if (existingOrders.length === 0) {
      console.log('⚡ Initializing IndexedDB with Seed Data...');
      await this.putMany(STORES.ORDERS, initialOrders);
      await this.putMany(STORES.PRODUCTS, initialProducts);
      await this.putMany(STORES.CUSTOMERS, initialCustomers);
      await this.putMany(STORES.LEADS, initialLeads);
      await this.putMany(STORES.PURCHASE_ORDERS, initialPurchaseOrders);
      await this.putMany(STORES.RMA_TICKETS, initialRmaTickets);
      await this.putMany(STORES.VENDORS, initialVendors);
      await this.putMany(STORES.AUDIT_LOGS, initialAuditLogs);
      
      const defaultUsers = [
        { id: 'usr-1', name: 'System Administrator', email: 'admin@srkinnovation.com', role: 'Super Admin', status: 'Active' },
        { id: 'usr-2', name: 'Dispatch Manager', email: 'warehouse@srkinnovation.com', role: 'Dispatch Manager', status: 'Active' },
        { id: 'usr-3', name: 'Customer User', email: 'customer@srkinnovation.com', role: 'Customer User', status: 'Active' }
      ];
      await this.putMany(STORES.USERS, defaultUsers);

      const defaultConfig = {
        key: 'system_config',
        companyName: 'SRK Innovation Pvt. Ltd.',
        domainUrl: 'srkinnovation.com',
        defaultCurrency: 'Indian Rupee (₹ INR)',
        taxRate: 18,
        timezone: 'Asia/Kolkata (IST)'
      };
      await this.put(STORES.SETTINGS, defaultConfig);
    }
  }

  static async exportBackup() {
    const backupData = {};
    for (const key of Object.values(STORES)) {
      backupData[key] = await this.getAll(key);
    }
    return JSON.stringify(backupData, null, 2);
  }

  static async importBackup(jsonData) {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    for (const [storeName, dataArray] of Object.entries(parsed)) {
      if (Object.values(STORES).includes(storeName) && Array.isArray(dataArray)) {
        await this.clearStore(storeName);
        await this.putMany(storeName, dataArray);
      }
    }
    return true;
  }
}
