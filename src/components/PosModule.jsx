import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Printer, 
  CheckCircle2, 
  Scan,
  X
} from 'lucide-react';

export const PosModule = () => {
  const { products = [], addOrder, setViewInvoiceOrder } = useApp();

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('+91 98000 00000');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');
  const [searchQuery, setSearchQuery] = useState('');

  const [receiptOrder, setReceiptOrder] = useState(null);

  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return String(p.name || '').toLowerCase().includes(q) || String(p.sku || '').toLowerCase().includes(q);
  });

  const addToCart = (product) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1, unitPrice: product.price || 1200 }]);
    }
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrd = {
      id: `SRK-POS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      product: cart.map(c => `${c.name} (x${c.qty})`).join(', '),
      totalAmount,
      amount: totalAmount,
      advance: totalAmount,
      balance: 0,
      paymentStatus: 'paid',
      stage: 'Closed',
      status: 'Closed',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: cart
    };
    if (addOrder) addOrder(newOrd);
    setReceiptOrder(newOrd);
    setCart([]);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Point of Sale (POS Terminal)</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Instant Barcode & SKU Checkout, Payment Processing & Quick Receipt Generation
            </p>
          </div>
        </div>
      </div>

      {/* POS Grid: Catalog (Left 2 cols) + Cart (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Product Catalog & Search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search by SKU, product name, barcode scan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white font-medium focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer space-y-2 group shadow-sm"
              >
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block">{p.sku || p.id}</span>
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-white">Rs. {(p.price || 1200).toLocaleString('en-IN')}</span>
                  <button className="p-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold">
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart Summary & Payment Register */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Active POS Cart ({cart.length})</h3>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-[11px] font-bold text-red-500 hover:underline">
                  Clear Cart
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {cart.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Cart is empty. Click any product on left to add.
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.name}</span>
                      <span className="text-[11px] text-slate-400">Rs. {item.unitPrice} x {item.qty}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button onClick={() => updateCartQty(item.id, -1)} className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs px-1">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, 1)} className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold" />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
                <option value="UPI / QR">UPI / QR Code</option>
                <option value="Cash">Cash Receipt</option>
                <option value="Credit Card">Credit / Debit Card</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-slate-500 text-sm">TOTAL AMOUNT</span>
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">Rs. {totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Complete Sale & Print Receipt
            </button>
          </div>
        </div>

      </div>

      {/* MODAL: POS Receipt */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl">
            <div className="text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-extrabold text-base">POS Sale Completed</h3>
              <p className="text-xs text-slate-500 font-mono">{receiptOrder.id}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between"><span>Customer:</span><span className="font-bold">{receiptOrder.customerName}</span></div>
              <div className="flex justify-between"><span>Payment:</span><span className="font-bold">{paymentMethod}</span></div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-extrabold text-blue-600"><span>Paid Total:</span><span>Rs. {receiptOrder.totalAmount.toLocaleString('en-IN')}</span></div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button onClick={() => setReceiptOrder(null)} className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs">
                Close & Next Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
