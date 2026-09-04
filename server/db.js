import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from './auth.js';
import { 
  initialOrders, 
  initialProducts, 
  initialCustomers, 
  initialLeads, 
  initialPurchaseOrders, 
  initialRmaTickets, 
  initialVendors 
} from '../src/data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

const verboseSqlite = sqlite3.verbose();
export const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to SQLite database:', err.message);
  } else {
    console.log('✅ Real SQL Database connected at server/database.sqlite');
  }
});

export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const initDB = async () => {
  console.log('⚡ Enabling Zero Data Loss SQLite WAL Mode...');

  // Enable WAL mode & performance pragmas for Zero Data Loss & High Concurrent Speeds
  await runQuery(`PRAGMA journal_mode = WAL;`);
  await runQuery(`PRAGMA synchronous = NORMAL;`);
  await runQuery(`PRAGMA foreign_keys = ON;`);

  console.log('⚡ Initializing Database Schema...');

  // 1. Orders Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      shopifyOrderId TEXT,
      source TEXT,
      priority TEXT,
      customerName TEXT,
      customerCode TEXT,
      customerEmail TEXT,
      customerPhone TEXT,
      status TEXT,
      paymentStatus TEXT,
      totalAmount REAL,
      paidAmount REAL,
      dueAmount REAL,
      createdDate TEXT,
      slaPromisedDate TEXT,
      isDelayed INTEGER,
      shippingAddress TEXT,
      billingAddress TEXT,
      gstin TEXT,
      items TEXT,
      timeline TEXT,
      courierDetails TEXT
    );
  `);

  // 2. Products Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE,
      name TEXT,
      category TEXT,
      unitPrice REAL,
      hsnCode TEXT,
      gstRate REAL,
      stock INTEGER,
      minThreshold INTEGER,
      description TEXT,
      stockByLocation TEXT
    );
  `);

  // 3. Customers Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      code TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      type TEXT,
      gstin TEXT,
      address TEXT
    );
  `);

  // 4. Leads Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      companyName TEXT,
      contactName TEXT,
      email TEXT,
      phone TEXT,
      value REAL,
      stage TEXT
    );
  `);

  // 5. Purchase Orders Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id TEXT PRIMARY KEY,
      procurementReqId TEXT,
      orderId TEXT,
      vendorId TEXT,
      vendorName TEXT,
      vendorEmail TEXT,
      items TEXT,
      totalAmount REAL,
      expectedDelivery TEXT,
      destinationLocation TEXT,
      status TEXT
    );
  `);

  // 6. RMA Tickets Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS rma_tickets (
      id TEXT PRIMARY KEY,
      productName TEXT,
      epcTag TEXT,
      customerName TEXT,
      issueDescription TEXT,
      warrantyStatus TEXT,
      status TEXT
    );
  `);

  // 7. Vendors Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT,
      contact TEXT,
      email TEXT,
      phone TEXT,
      leadTimeDays INTEGER,
      rating REAL
    );
  `);

  // 8. Users Table with Authentication Support
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      role TEXT,
      passwordHash TEXT,
      salt TEXT,
      status TEXT
    );
  `);

  // 9. Settings Table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      val TEXT
    );
  `);

  // Clear dummy data for clean fresh start
  console.log('⚡ Clearing dummy data for fresh instance...');
  await runQuery(`DELETE FROM orders`);
  await runQuery(`DELETE FROM products`);
  await runQuery(`DELETE FROM customers`);
  await runQuery(`DELETE FROM leads`);
  await runQuery(`DELETE FROM purchase_orders`);
  await runQuery(`DELETE FROM rma_tickets`);
  await runQuery(`DELETE FROM vendors`);

  // Ensure users table schema migrations & default accounts with hashed passwords
  try { await runQuery(`ALTER TABLE users ADD COLUMN passwordHash TEXT`); } catch {}
  try { await runQuery(`ALTER TABLE users ADD COLUMN salt TEXT`); } catch {}

  const adminPass = hashPassword('admin123');
  const warehousePass = hashPassword('warehouse123');
  const salesPass = hashPassword('sales123');

  const defaultUsers = [
    { id: 'usr-1', name: 'System Administrator', email: 'admin@srkinnovation.com', role: 'Super Admin', passwordHash: adminPass.hash, salt: adminPass.salt, status: 'Active' },
    { id: 'usr-2', name: 'Dispatch Manager', email: 'warehouse@srkinnovation.com', role: 'Dispatch Manager', passwordHash: warehousePass.hash, salt: warehousePass.salt, status: 'Active' },
    { id: 'usr-3', name: 'Sales Representative', email: 'sales@srkinnovation.com', role: 'Sales Team', passwordHash: salesPass.hash, salt: salesPass.salt, status: 'Active' }
  ];

  for (const u of defaultUsers) {
    await runQuery(`
      INSERT OR REPLACE INTO users (id, name, email, role, passwordHash, salt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [u.id, u.name, u.email, u.role, u.passwordHash, u.salt, u.status]);
  }
};
