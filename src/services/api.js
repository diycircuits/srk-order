const API_BASE = '/api';

export const api = {
  // 1. Network Info
  async getNetworkInfo() {
    try {
      const res = await fetch(`${API_BASE}/network-info`);
      return await res.json();
    } catch {
      return { localIp: 'localhost', frontendLanUrl: 'http://localhost:5173' };
    }
  },

  // 2. Orders API
  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  },

  async updateOrderStatus(orderId, status, role = 'Super Admin') {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, role })
    });
    return await res.json();
  },

  async deleteOrder(orderId) {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // 3. Products API
  async getProducts() {
    const res = await fetch(`${API_BASE}/products`);
    return await res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  },

  async updateStock(productId, stock) {
    const res = await fetch(`${API_BASE}/products/${productId}/stock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock })
    });
    return await res.json();
  },

  // 4. Customers API
  async getCustomers() {
    const res = await fetch(`${API_BASE}/customers`);
    return await res.json();
  },

  async createCustomer(customerData) {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    return await res.json();
  },

  // 5. Leads API
  async getLeads() {
    const res = await fetch(`${API_BASE}/leads`);
    return await res.json();
  },

  async createLead(leadData) {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    return await res.json();
  },

  async updateLeadStage(leadId, stage) {
    const res = await fetch(`${API_BASE}/leads/${leadId}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage })
    });
    return await res.json();
  },

  // 6. RMA Tickets API
  async getRmaTickets() {
    const res = await fetch(`${API_BASE}/rma`);
    return await res.json();
  },

  async createRmaTicket(rmaData) {
    const res = await fetch(`${API_BASE}/rma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rmaData)
    });
    return await res.json();
  },

  async updateRmaStatus(ticketId, status) {
    const res = await fetch(`${API_BASE}/rma/${ticketId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  // 7. Vendors API
  async getVendors() {
    const res = await fetch(`${API_BASE}/vendors`);
    return await res.json();
  },

  async createVendor(vendorData) {
    const res = await fetch(`${API_BASE}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData)
    });
    return await res.json();
  },

  // 8. Users & Settings API
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    return await res.json();
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  },

  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return await res.json();
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
    return await res.json();
  },

  // 9. Trigger Shopify Webhook Simulation
  async simulateWebhook(payload) {
    const res = await fetch(`${API_BASE}/webhooks/shopify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }
};
