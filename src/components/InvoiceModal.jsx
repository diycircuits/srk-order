import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer } from 'lucide-react';

export const InvoiceModal = () => {
  const { viewInvoiceOrder, setViewInvoiceOrder } = useApp();

  if (!viewInvoiceOrder) return null;

  const ord = viewInvoiceOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header Actions (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-base font-extrabold text-slate-900">Tax Invoice Preview — {ord.zohoInvoiceRef?.invoiceNumber || 'INV-2026-8891'}</h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => setViewInvoiceOrder(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Document */}
        <div className="space-y-6 text-xs text-slate-800 p-4 border border-slate-200 rounded-2xl bg-white">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">SRK INNOVATIONS</h1>
              <p className="text-slate-500 font-medium">srkinnovation.com • GSTIN: 27AAAAA0000A1Z5</p>
              <p className="text-slate-500">Tech Park, MIDC, Pune, Maharashtra 411057</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-extrabold text-blue-600 uppercase">TAX INVOICE</h2>
              <span className="font-mono font-bold text-slate-900 text-sm block">{ord.zohoInvoiceRef?.invoiceNumber || 'INV-2026-8891'}</span>
              <span className="text-slate-500">Date: {ord.createdDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-900 uppercase text-[10px]">Billed To:</span>
              <p className="font-bold text-slate-900 text-sm">{ord.customerName}</p>
              <p className="text-slate-600">{ord.shippingAddress}</p>
              <p className="text-slate-500 font-mono text-[11px]">GSTIN: {ord.gstin}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 uppercase text-[10px]">Order & Payment Details:</span>
              <p className="font-mono font-bold text-slate-900">Order ID: {ord.id}</p>
              <p className="text-slate-600">Payment Terms: Net 15 Days</p>
              <p className="text-rose-600 font-bold">Balance Due: ₹{ord.dueAmount.toFixed(2)}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-slate-200">
            <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-600">
              <tr>
                <th className="p-2 border border-slate-200">SKU / ITEM</th>
                <th className="p-2 border border-slate-200 text-center">QTY</th>
                <th className="p-2 border border-slate-200 text-right">UNIT PRICE</th>
                <th className="p-2 border border-slate-200 text-right">GST (18%)</th>
                <th className="p-2 border border-slate-200 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {ord.items.map((it, i) => (
                <tr key={i}>
                  <td className="p-2 border border-slate-200 font-medium">
                    <span className="font-bold block">{it.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">{it.sku}</span>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-bold">{it.qty}</td>
                  <td className="p-2 border border-slate-200 text-right">₹{it.unitPrice.toFixed(2)}</td>
                  <td className="p-2 border border-slate-200 text-right">₹{(it.subtotal * 0.18).toFixed(2)}</td>
                  <td className="p-2 border border-slate-200 text-right font-bold">₹{it.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-end pt-4">
            <div className="text-[10px] text-slate-500">
              <p>This is a computer-generated Tax Invoice synced with Zoho Books.</p>
              <p>SRK Innovations • Thank you for your business!</p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-slate-900">Total Invoice Amount: ₹{ord.totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
