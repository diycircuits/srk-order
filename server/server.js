import express from 'express';
import cors from 'cors';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initDB, runQuery, getQuery, allQuery } from './db.js';
import { hashPassword, verifyPassword, generateJwtToken, verifyJwtToken } from './auth.js';
import { initAutoBackupScheduler, createBackupSnapshot, listBackups, restoreBackupSnapshot } from './backupService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});
app.use(express.json());

// Log incoming requests from LAN/other laptops
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url} (From: ${req.ip})`);
  next();
});

// Helper: Get local network IP address
const getLocalIpAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  return addresses;
};

// 1. Network Info Route
app.get('/api/network-info', (req, res) => {
  const ips = getLocalIpAddresses();
  const primaryIp = ips[0] || 'localhost';
  res.json({
    localIp: primaryIp,
    allIps: ips,
    frontendLanUrl: `http://${primaryIp}:${PORT}`,
    backendLanUrl: `http://${primaryIp}:${PORT}`
  });
});

// 2. REAL AUTHENTICATION & LOGIN ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await getQuery(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateJwtToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyJwtToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });

    const user = await getQuery(`SELECT id, name, email, role, status FROM users WHERE id = ?`, [decoded.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ZERO DATA LOSS BACKUP ROUTES
app.get('/api/admin/backups', (req, res) => {
  const backups = listBackups();
  res.json(backups);
});

app.post('/api/admin/backups/create', async (req, res) => {
  const result = await createBackupSnapshot();
  if (result) {
    res.json({ success: true, backup: result });
  } else {
    res.status(500).json({ error: 'Failed to create backup snapshot' });
  }
});

app.post('/api/admin/backups/restore', async (req, res) => {
  try {
    const { fileName } = req.body;
    await restoreBackupSnapshot(fileName);
    res.json({ success: true, message: `Database restored from ${fileName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Orders Routes
app.get('/api/orders', async (req, res) => {
  try {
    const rows = await allQuery(`SELECT * FROM orders ORDER BY rowid DESC`);
    const formatted = rows.map(r => ({
      ...r,
      isDelayed: Boolean(r.isDelayed),
      items: typeof r.items === 'string' ? JSON.parse(r.items) : (r.items || []),
      timeline: typeof r.timeline === 'string' ? JSON.parse(r.timeline) : (r.timeline || []),
      courierDetails: typeof r.courierDetails === 'string' ? JSON.parse(r.courierDetails) : (r.courierDetails || {})
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const data = req.body;
    const countRow = await getQuery(`SELECT COUNT(*) as count FROM orders`);
    const nextNum = (countRow?.count || 0) + 1246;
    const orderId = data.id || `SRK-ORD-2026-${String(nextNum).padStart(6, '0')}`;
    const formattedDate = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    const items = data.items || [];
    const totalAmount = parseFloat(data.totalAmount || 0);
    const paidAmount = data.paymentStatus === 'paid' ? totalAmount : 0;
    const dueAmount = data.paymentStatus === 'paid' ? 0 : totalAmount;

    const initialTimeline = [
      { timestamp: formattedDate, event: `Order created via ${data.source || 'SaaS App'}`, user: 'Office User', type: 'USER' },
      { timestamp: formattedDate, event: 'SQL Database Transaction Committed (Zero Data Loss WAL)', user: 'Backend System', type: 'SYSTEM' }
    ];

    await runQuery(`
      INSERT INTO orders (id, shopifyOrderId, source, priority, customerName, customerCode, customerEmail, customerPhone, status, paymentStatus, totalAmount, paidAmount, dueAmount, createdDate, slaPromisedDate, isDelayed, shippingAddress, billingAddress, gstin, items, timeline, courierDetails)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId, data.shopifyOrderId || null, data.source || 'Sales Team', data.priority || 'NORMAL',
      data.customerName || 'Customer User', data.customerCode || 'CUST-100', data.customerEmail || 'client@corporate.com',
      data.customerPhone || '+91 98000 00000', data.status || 'CONFIRMED', data.paymentStatus || 'unpaid',
      totalAmount, paidAmount, dueAmount, formattedDate, '3 Days', 0,
      data.shippingAddress || 'Corporate Logistics Hub', data.billingAddress || 'Corporate Office',
      data.gstin || '27AAACA1234F1Z9', JSON.stringify(items), JSON.stringify(initialTimeline),
      JSON.stringify({ courierName: 'DTDC Express', awbNumber: `DT-${Math.floor(100000000 + Math.random() * 900000000)}`, trackingUrl: 'https://www.dtdc.in' })
    ]);

    const created = await getQuery(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    created.items = JSON.parse(created.items);
    created.timeline = JSON.parse(created.timeline);
    created.courierDetails = JSON.parse(created.courierDetails);

    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;
    const existing = await getQuery(`SELECT * FROM orders WHERE id = ?`, [id]);
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    const timeline = JSON.parse(existing.timeline || '[]');
    const timestamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    timeline.push({ timestamp, event: `Status updated to ${status.replace(/_/g, ' ')}`, user: role || 'Office User', type: 'USER' });

    await runQuery(`UPDATE orders SET status = ?, timeline = ? WHERE id = ?`, [status, JSON.stringify(timeline), id]);

    const updated = await getQuery(`SELECT * FROM orders WHERE id = ?`, [id]);
    updated.items = JSON.parse(updated.items);
    updated.timeline = JSON.parse(updated.timeline);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM orders WHERE id = ?`, [id]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const rows = await allQuery(`SELECT * FROM products ORDER BY rowid DESC`);
    const formatted = rows.map(r => ({
      ...r,
      stockByLocation: typeof r.stockByLocation === 'string' ? JSON.parse(r.stockByLocation) : (r.stockByLocation || {})
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const data = req.body;
    const id = `prod-${Date.now()}`;
    const stockByLocation = { 'LOC-MUM': parseInt(data.stock || 0, 10), 'LOC-BLR': 0, 'LOC-DEL': 0 };

    await runQuery(`
      INSERT INTO products (id, sku, name, category, unitPrice, hsnCode, gstRate, stock, minThreshold, description, stockByLocation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.sku, data.name, data.category || 'RFID Hardware', parseFloat(data.unitPrice || 0),
      data.hsnCode || '84719000', parseFloat(data.gstRate || 18), parseInt(data.stock || 0, 10),
      parseInt(data.minThreshold || 5, 10), data.description || '', JSON.stringify(stockByLocation)
    ]);

    const created = await getQuery(`SELECT * FROM products WHERE id = ?`, [id]);
    created.stockByLocation = JSON.parse(created.stockByLocation);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const qty = parseInt(stock, 10) || 0;
    const existing = await getQuery(`SELECT * FROM products WHERE id = ? OR sku = ?`, [id, id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const loc = JSON.parse(existing.stockByLocation || '{}');
    loc['LOC-MUM'] = qty;

    await runQuery(`UPDATE products SET stock = ?, stockByLocation = ? WHERE id = ? OR sku = ?`, [
      qty, JSON.stringify(loc), existing.id, existing.sku
    ]);

    res.json({ success: true, id: existing.id, stock: qty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Customers Routes
app.get('/api/customers', async (req, res) => {
  try {
    const rows = await allQuery(`SELECT * FROM customers ORDER BY rowid DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const data = req.body;
    const id = `cust-${Date.now()}`;
    await runQuery(`
      INSERT INTO customers (id, code, name, email, phone, type, gstin, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.code || `CUST-${Math.floor(100 + Math.random() * 900)}`, data.name, data.email, data.phone, data.type || 'Enterprise B2B', data.gstin || '27AAACA1234F1Z9', data.address || ''
    ]);
    const created = await getQuery(`SELECT * FROM customers WHERE id = ?`, [id]);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Leads Routes
app.get('/api/leads', async (req, res) => {
  try {
    const rows = await allQuery(`SELECT * FROM leads ORDER BY rowid DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const data = req.body;
    const id = `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`;
    await runQuery(`
      INSERT INTO leads (id, companyName, contactName, email, phone, value, stage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.companyName, data.contactName, data.email, data.phone, parseFloat(data.value || 0), data.stage || 'PROSPECTING'
    ]);
    const created = await getQuery(`SELECT * FROM leads WHERE id = ?`, [id]);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/leads/:id/stage', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    await runQuery(`UPDATE leads SET stage = ? WHERE id = ?`, [stage, id]);
    res.json({ success: true, id, stage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. RMA Tickets Routes
app.get('/api/rma', async (req, res) => {
  try {
    const rows = await allQuery(`SELECT * FROM rma_tickets ORDER BY rowid DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rma', async (req, res) => {
  try {
    const data = req.body;
    const countRow = await getQuery(`SELECT COUNT(*) as count FROM rma_tickets`);
    const id = `SRK-RMA-2026-${String((countRow?.count || 0) + 1).padStart(4, '0')}`;

    await runQuery(`
      INSERT INTO rma_tickets (id, productName, epcTag, customerName, issueDescription, warrantyStatus, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.productName, data.epcTag || 'EPC-99201', data.customerName, data.issueDescription, data.warrantyStatus || 'Active Warranty', data.status || 'DIAGNOSING'
    ]);
    const created = await getQuery(`SELECT * FROM rma_tickets WHERE id = ?`, [id]);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/rma/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await runQuery(`UPDATE rma_tickets SET status = ? WHERE id = ?`, [status, id]);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Vendors Routes
app.get('/api/vendors', async (req, res) => {
  try {
    const rows = await allQuery(`SELECT * FROM vendors ORDER BY rowid DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const data = req.body;
    const id = `v-${Date.now()}`;
    await runQuery(`
      INSERT INTO vendors (id, name, category, contact, email, phone, leadTimeDays, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.name, data.category || 'Component Supplier', data.contact || 'Key Account Manager', data.email, data.phone, parseInt(data.leadTimeDays || 5, 10), 4.8
    ]);
    const created = await getQuery(`SELECT * FROM vendors WHERE id = ?`, [id]);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Users & Settings Routes (With Password Hashing)
app.get('/api/users', async (req, res) => {
  try {
    const rows = await allQuery(`SELECT id, name, email, role, status FROM users ORDER BY rowid DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const data = req.body;
    const id = `usr-${Date.now()}`;
    const password = data.password || 'srk12345';
    const passObj = hashPassword(password);

    await runQuery(`
      INSERT INTO users (id, name, email, role, passwordHash, salt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, data.name, data.email.toLowerCase().trim(), data.role || 'Dispatch Manager', passObj.hash, passObj.salt, 'Active']);

    const created = await getQuery(`SELECT id, name, email, role, status FROM users WHERE id = ?`, [id]);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const row = await getQuery(`SELECT val FROM settings WHERE key = 'system_config'`);
    res.json(row ? JSON.parse(row.val) : {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const data = req.body;
    await runQuery(`INSERT OR REPLACE INTO settings (key, val) VALUES ('system_config', ?)`, [JSON.stringify(data)]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Real Shopify Webhook Endpoint
app.post('/api/webhooks/shopify', async (req, res) => {
  try {
    const payload = req.body;
    const shopifyOrderId = payload.id || Math.floor(100000 + Math.random() * 900000);
    const customerName = payload.customer ? `${payload.customer.first_name || ''} ${payload.customer.last_name || ''}`.trim() : 'Shopify Buyer';
    
    const countRow = await getQuery(`SELECT COUNT(*) as count FROM orders`);
    const nextNum = (countRow?.count || 0) + 1246;
    const orderId = `SRK-ORD-2026-${String(nextNum).padStart(6, '0')}`;
    const formattedDate = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    const items = (payload.line_items || []).map(it => ({
      sku: it.sku || 'SRK-RFID-RDR-4P',
      name: it.title || 'SRK Fixed 4-Port Reader',
      qty: it.quantity || 1,
      unitPrice: parseFloat(it.price || 18500),
      subtotal: (it.quantity || 1) * parseFloat(it.price || 18500)
    }));

    const totalAmount = parseFloat(payload.total_price || 18500);

    await runQuery(`
      INSERT INTO orders (id, shopifyOrderId, source, priority, customerName, customerCode, customerEmail, customerPhone, status, paymentStatus, totalAmount, paidAmount, dueAmount, createdDate, slaPromisedDate, isDelayed, shippingAddress, billingAddress, gstin, items, timeline, courierDetails)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId, String(shopifyOrderId), 'Shopify Webhook', 'NORMAL', customerName, 'CUST-SHOPIFY',
      payload.email || 'buyer@shopify.com', '+91 98000 11111', 'CONFIRMED', 'paid',
      totalAmount, totalAmount, 0, formattedDate, '3 Days', 0,
      'Shopify Customer Address, India', 'Shopify Billing', '27AAACA1234F1Z9',
      JSON.stringify(items),
      JSON.stringify([
        { timestamp: formattedDate, event: `Real Webhook Ingested from Shopify Order #${shopifyOrderId}`, user: 'Shopify Cloud Engine', type: 'SYSTEM' }
      ]),
      JSON.stringify({ courierName: 'Shiprocket', awbNumber: `SR-${Math.floor(1000000 + Math.random() * 9000000)}`, trackingUrl: 'https://shiprocket.co' })
    ]);

    console.log(`⚡ Real Webhook Ingested: Shopify Order #${shopifyOrderId} -> SRK Order ${orderId}`);
    res.json({ success: true, srkOrderId: orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Production Static Serving for Single Server Deployment
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Express 5 compatible SPA fallback
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start Server, Init DB & Backup Scheduler
initDB().then(() => {
  initAutoBackupScheduler();

  app.listen(PORT, '0.0.0.0', () => {
    const ips = getLocalIpAddresses();
    console.log(`\n======================================================`);
    console.log(`🚀 SRK Innovations SaaS Enterprise ERP Server Running!`);
    console.log(`🛡️ Zero Data Loss WAL Mode Active & Auto Backup Scheduled`);
    console.log(`------------------------------------------------------`);
    console.log(`- Software URL (This Laptop): http://localhost:${PORT}`);
    ips.forEach(ip => {
      console.log(`- Other Laptops (Wi-Fi / LAN): http://${ip}:${PORT}`);
    });
    console.log(`======================================================\n`);
  });
}).catch(err => {
  console.error('Fatal database initialization error:', err);
});
