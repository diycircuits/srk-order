import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, ShoppingBag } from 'lucide-react';

export const CreateOrderModal = () => {
  const { createOrderOpen, setCreateOrderOpen, addOrder, products, customers } = useApp();

  const [customerName, setCustomerName] = useState(customers[0]?.name || 'Acme Logistics India Pvt Ltd');
  const [customerEmail, setCustomerEmail] = useState(customers[0]?.email || 'logistics@acmeindia.com');
  const [customerPhone, setCustomerPhone] = useState(customers[0]?.phone || '+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState('123 Logistics Hub, Bhiwandi, Thane, MH 421302');
  const [gstin, setGstin] = useState('27AAACA1234F1Z9');
  const [source, setSource] = useState('Sales Team');
  const [priority, setPriority] = useState('NORMAL');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');

  const [selectedItems, setSelectedItems] = useState([
    { 
      sku: products[0]?.sku || 'SRK-RFID-RDR-4P', 
      name: products[0]?.name || 'SRK Fixed 4-Port Industrial RFID Reader', 
      qty: 5, 
      unitPrice: products[0]?.unitPrice || 11500.00 
    }
  ]);

  if (!createOrderOpen) return null;

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  };

  const handleCustomerSelect = (name) => {
    setCustomerName(name);
    const found = customers.find(c => c.name === name);
    if (found) {
      setCustomerEmail(found.email || '');
      setCustomerPhone(found.phone || '');
      setGstin(found.gstin || '');
      setShippingAddress(found.address || '');
    }
  };

  const handleAddItem = () => {
    const defaultProd = products[0] || { sku: 'SRK-GENERIC', name: 'Hardware Component', unitPrice: 1000 };
    setSelectedItems(prev => [
      ...prev,
      { sku: defaultProd.sku, name: defaultProd.name, qty: 1, unitPrice: defaultProd.unitPrice }
    ]);
  };

  const handleProductSelect = (index, sku) => {
    const found = products.find(p => p.sku === sku);
    if (found) {
      setSelectedItems(prev => prev.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            sku: found.sku,
            name: found.name,
            unitPrice: found.unitPrice
          };
        }
        return item;
      }));
    }
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = calculateTotal();
    addOrder({
      source,
      priority,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      gstin,
      paymentStatus,
      totalAmount,
      items: selectedItems.map(item => ({
        ...item,
        subtotal: item.qty * item.unitPrice
      }))
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Book New Sales Order</h2>
              <p className="text-xs text-slate-500 font-medium">Auto-triggers Multi-Location Stock Check & Shortage PR</p>
            </div>
          </div>

          <button
            onClick={() => setCreateOrderOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Order Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Sales Team">Sales Team</option>
                <option value="Shopify">Shopify Store</option>
                <option value="WhatsApp Business">WhatsApp Business</option>
                <option value="Direct Purchase">Direct Purchase</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Customer Account</label>
              <select
                value={customerName}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Customer Phone</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Customer Email</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Shipping & Delivery Address</label>
            <textarea
              rows="2"
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
            ></textarea>
          </div>

          {/* Items Table */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white">Order Line Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {selectedItems.map((item, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between space-x-3">
                <div className="flex-1">
                  <select
                    value={item.sku}
                    onChange={(e) => handleProductSelect(idx, e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.sku}>{p.name} (₹{p.unitPrice})</option>
                    ))}
                  </select>
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 block mt-1">{item.sku}</span>
                </div>

                <div className="w-20">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 1;
                      setSelectedItems(prev => prev.map((it, i) => i === idx ? { ...it, qty: val } : it));
                    }}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-center font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="text-right w-24">
                  <span className="font-bold text-slate-900 dark:text-white block">₹{(item.qty * item.unitPrice).toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[11px]">Total Booking Amount</span>
              <strong className="text-xl font-extrabold text-blue-600 dark:text-blue-400">₹{calculateTotal().toFixed(2)}</strong>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCreateOrderOpen(false)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20"
              >
                Book & Run Auto Stock Check
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
