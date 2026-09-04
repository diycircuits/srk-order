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
    return selectedItems.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.unitPrice) || 0)), 0);
  };

  const handleCustomerChange = (name) => {
    setCustomerName(name);
    const found = customers.find(c => c.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (found) {
      if (found.email) setCustomerEmail(found.email);
      if (found.phone) setCustomerPhone(found.phone);
      if (found.gstin) setGstin(found.gstin);
      if (found.address) setShippingAddress(found.address);
    }
  };

  const handleAddItem = () => {
    const defaultProd = products[0] || { sku: 'SRK-GENERIC', name: '', unitPrice: 0 };
    setSelectedItems(prev => [
      ...prev,
      { sku: defaultProd.sku || 'SRK-ITEM', name: defaultProd.name || '', qty: 1, unitPrice: defaultProd.unitPrice || 0 }
    ]);
  };

  const handleUpdateItem = (index, field, value) => {
    setSelectedItems(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      return { ...item, [field]: value };
    }));
  };

  const handleItemNameChange = (index, nameValue) => {
    const found = products.find(p => 
      p.name.toLowerCase().trim() === nameValue.toLowerCase().trim() ||
      p.sku.toLowerCase().trim() === nameValue.toLowerCase().trim()
    );
    setSelectedItems(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      if (found) {
        return {
          ...item,
          name: found.name,
          sku: found.sku,
          unitPrice: found.unitPrice
        };
      }
      return {
        ...item,
        name: nameValue
      };
    }));
  };

  const handleRemoveItem = (index) => {
    if (selectedItems.length <= 1) return;
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const totalAmount = calculateTotal();
      await addOrder({
        source,
        priority,
        customerName: (customerName || '').trim() || 'Direct Customer',
        customerEmail: (customerEmail || '').trim() || 'client@corporate.com',
        customerPhone: (customerPhone || '').trim() || '+91 98000 00000',
        shippingAddress: (shippingAddress || '').trim() || 'Delivery Address',
        gstin: (gstin || '').trim(),
        paymentStatus,
        totalAmount,
        items: selectedItems.map(item => ({
          sku: item.sku || 'SRK-ITEM',
          name: (item.name || '').trim() || 'Industrial Hardware',
          qty: Math.max(1, Number(item.qty) || 1),
          unitPrice: Math.max(0, Number(item.unitPrice) || 0),
          subtotal: Math.max(1, Number(item.qty) || 1) * Math.max(0, Number(item.unitPrice) || 0)
        }))
      });
      setCreateOrderOpen(false);
    } catch (err) {
      console.error("Order creation error:", err);
      setCreateOrderOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        
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
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Customer Account <span className="text-slate-400 font-normal text-[11px]">(Editable / Select from list)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="customer-account-suggestions"
                  value={customerName}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  placeholder="Type or select Customer / Company..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <datalist id="customer-account-suggestions">
                  {customers.map(c => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Customer Phone</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Customer Email</label>
              <input
                type="text"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Items Table */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-900 dark:text-white">Order Line Items</label>
                <span className="text-[11px] text-slate-400 block">Edit item description, rate, or quantity freely</span>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <datalist id="products-catalog-datalist">
              {products.map((p, pIdx) => (
                <option key={p.id || pIdx} value={p.name}>
                  ₹{p.unitPrice}
                </option>
              ))}
            </datalist>

            {/* Table Header on sm+ */}
            <div className="hidden sm:flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-1">
              <div className="flex-1 min-w-[200px]">Item Description</div>
              <div className="flex items-center space-x-2.5">
                <div className="w-24 text-right pr-2">Rate (₹)</div>
                <div className="w-16 text-center">Qty</div>
                <div className="w-24 text-right pr-2">Total (₹)</div>
                <div className="w-8"></div>
              </div>
            </div>

            {selectedItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center gap-2.5"
              >
                {/* Product Name / Description */}
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    list="products-catalog-datalist"
                    value={item.name}
                    onChange={(e) => handleItemNameChange(idx, e.target.value)}
                    placeholder="Type product name or select from catalog..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Right controls: Rate, Qty, Total, Delete */}
                <div className="flex items-center justify-between sm:justify-end space-x-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                  {/* Rate / Unit Price */}
                  <div className="w-24">
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 sm:hidden">Rate (₹)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-slate-400 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-6 pr-2 py-2 text-xs font-bold text-slate-900 dark:text-white text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="w-16">
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 sm:hidden">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleUpdateItem(idx, 'qty', parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-center font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Line Total */}
                  <div className="w-24 text-right">
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5 sm:hidden">Amount</label>
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block py-2">
                      ₹{((Number(item.qty) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={selectedItems.length <= 1}
                    className={`p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors ${selectedItems.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    title={selectedItems.length <= 1 ? 'At least one item is required' : 'Delete item'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[11px] font-semibold">Total Booking Amount</span>
              <strong className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                ₹{calculateTotal().toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCreateOrderOpen(false)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/25 transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                    <span>Booking Order...</span>
                  </>
                ) : (
                  <span>Book & Run Auto Stock Check</span>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
