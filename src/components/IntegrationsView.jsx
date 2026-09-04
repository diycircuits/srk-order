import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw } from 'lucide-react';

export const IntegrationsView = () => {
  const { notificationLogs, ingestShopifyWebhookOrder } = useApp();

  const [statusMsg, setStatusMsg] = React.useState('');

  const handleSimulateShopify = () => {
    ingestShopifyWebhookOrder({
      id: Math.floor(100000 + Math.random() * 900000),
      customer: { first_name: "Shopify", last_name: "Customer" },
      email: "buyer@shopify.com",
      total_price: "18500.00",
      line_items: [
        { sku: "SRK-RFID-RDR-4P", title: "SRK Fixed 4-Port Reader", quantity: 1, price: "18500.00" }
      ]
    });
    setStatusMsg('⚡ Webhook triggered successfully! Order created & stock updated.');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Integrations & Communication Engine</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Shopify Webhooks, Meta WhatsApp Business API & Transactional Email Automation</p>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-fadeIn">
          {statusMsg}
        </div>
      )}

      {/* Integration Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Shopify Integration</h3>
            <span className="badge-status status-delivered">CONNECTED ✓</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Webhook HMAC Verification enabled. Auto order ingestion active.</p>
          <button
            onClick={handleSimulateShopify}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-600/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-semibold py-1.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Webhook Order</span>
          </button>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Meta WhatsApp API</h3>
            <span className="badge-status status-delivered">CONNECTED ✓</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Cloud API active. Automatic customer notifications enabled.</p>
          <div className="text-[11px] text-slate-500 font-mono">Provider: Meta Cloud API</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Transactional Email</h3>
            <span className="badge-status status-delivered">CONNECTED ✓</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">SMTP Queue active. Order updates & AWB details delivered.</p>
          <div className="text-[11px] text-slate-500 font-mono">Host: smtp.srkinnovations.com</div>
        </div>
      </div>

      {/* Automated Notification Logs Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-3 p-5">
        <h2 className="font-bold text-slate-900 dark:text-white text-base">Automated Customer Communication Logs</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Complete audit trail of all WhatsApp messages and emails sent to prevent duplicates.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">LOG ID</th>
                <th className="p-3">ORDER ID</th>
                <th className="p-3">CHANNEL</th>
                <th className="p-3">TEMPLATE</th>
                <th className="p-3">RECIPIENT</th>
                <th className="p-3">SENT AT</th>
                <th className="p-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {notificationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono text-slate-500 text-[11px]">{log.id}</td>
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{log.orderId}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{log.channel}</td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{log.template}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{log.recipient}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{log.sentAt}</td>
                  <td className="p-3 text-center">
                    <span className="badge-status status-delivered">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
