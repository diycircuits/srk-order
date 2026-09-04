// SRK Innovations Integration Adapters (Shopify, Zoho Books, WhatsApp Cloud API, Email)

export class NotificationService {
  constructor() {
    this.sentNotificationKeys = new Set();
  }

  interpolateTemplate(templateText, variables) {
    let result = templateText;
    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, val || '');
    });
    return result;
  }

  sendWhatsAppNotification({ orderId, customerName, phone, templateType, variables }) {
    const idempotencyKey = `WA-${orderId}-${templateType}`;
    if (this.sentNotificationKeys.has(idempotencyKey)) {
      return { status: 'SKIPPED_DUPLICATE', message: 'Notification already sent (Idempotent)' };
    }

    let templateText = "";
    if (templateType === 'ORDER_CONFIRMED') {
      templateText = "Hello {{customer_name}}, Your SRK Innovations order {{order_number}} has been received & confirmed. Track: {{tracking_url}}";
    } else if (templateType === 'ORDER_DISPATCHED') {
      templateText = "Hello {{customer_name}}, Your SRK Innovations order {{order_number}} has been dispatched via {{courier_name}}. AWB: {{awb_number}}. Track: {{tracking_url}}";
    } else if (templateType === 'ORDER_DELIVERED') {
      templateText = "Hello {{customer_name}}, Your SRK Innovations order {{order_number}} has been delivered successfully. Thank you for choosing SRK Innovations!";
    } else {
      templateText = "Hello {{customer_name}}, Update for your order {{order_number}}. Status: {{order_status}}.";
    }

    const messageBody = this.interpolateTemplate(templateText, variables);
    this.sentNotificationKeys.add(idempotencyKey);

    return {
      id: `WA-MSG-${Date.now()}`,
      orderId,
      customerName,
      channel: 'WhatsApp',
      template: templateType,
      recipient: phone,
      sentAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'DELIVERED',
      messageBody
    };
  }

  sendEmailNotification({ orderId, customerName, email, templateType, variables }) {
    const idempotencyKey = `EMAIL-${orderId}-${templateType}`;
    if (this.sentNotificationKeys.has(idempotencyKey)) {
      return { status: 'SKIPPED_DUPLICATE', message: 'Email already sent (Idempotent)' };
    }

    const subject = `SRK Innovations Update: ${templateType.replace(/_/g, ' ')} for ${variables.order_number}`;
    const body = `Dear ${customerName},\n\nThis is an automated update regarding your order ${variables.order_number}.\nCourier: ${variables.courier_name || 'N/A'}\nAWB: ${variables.awb_number || 'N/A'}\n\nTrack: ${variables.tracking_url || 'https://track.srkinnovations.com'}\n\nRegards,\nSRK Innovations Team`;

    this.sentNotificationKeys.add(idempotencyKey);

    return {
      id: `EMAIL-MSG-${Date.now()}`,
      orderId,
      customerName,
      channel: 'Email',
      template: templateType,
      recipient: email,
      sentAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'DELIVERED',
      messageBody: `Subject: ${subject}\n\n${body}`
    };
  }
}

export const shopifyWebhookAdapter = {
  parseWebhookPayload: (rawPayload) => {
    return {
      shopifyOrderId: String(rawPayload.id || Math.floor(100000 + Math.random() * 900000)),
      source: 'Shopify',
      customerName: rawPayload.customer?.first_name ? `${rawPayload.customer.first_name} ${rawPayload.customer.last_name}` : "Shopify Customer",
      customerEmail: rawPayload.email || "customer@shopifystore.com",
      customerPhone: rawPayload.phone || rawPayload.customer?.phone || "+91 98765 00000",
      totalAmount: parseFloat(rawPayload.total_price || 4200.00),
      shippingAddress: rawPayload.shipping_address?.address1 || "Shopify Customer Address, Mumbai, MH",
      items: (rawPayload.line_items || []).map(li => ({
        sku: li.sku || "SRK-RFID-TAG-UHF",
        name: li.title || "SRK UHF RFID Tag",
        qty: li.quantity || 1,
        unitPrice: parseFloat(li.price || 35.00)
      }))
    };
  }
};

export const zohoBooksAdapter = {
  syncInvoiceRef: (orderId, totalAmount) => {
    const randomInvNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      invoiceId: `ZOHO-INV-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceNumber: randomInvNum,
      invoiceDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'ISSUED',
      paymentStatus: 'Unpaid',
      balance: totalAmount,
      zohoUrl: `https://books.zoho.com/app#/invoices/ZOHO-INV-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }
};
