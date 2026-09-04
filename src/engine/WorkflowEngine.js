// SRK Innovations Workflow State Machine & SLA Engine

export const ORDER_STATUSES = [
  'NEW',
  'SALES_REVIEW',
  'CONFIRMED',
  'STOCK_CHECK',
  'STOCK_AVAILABLE',
  'PROCUREMENT_REQUIRED',
  'PROCUREMENT_IN_PROGRESS',
  'MATERIAL_INCOMING',
  'MATERIAL_RECEIVED',
  'READY_TO_FULFILL',
  'PACKING',
  'QC',
  'READY_TO_DISPATCH',
  'DISPATCHED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'ON_HOLD',
  'CANCELLED'
];

export const getStatusLabel = (statusKey) => {
  return statusKey.replace(/_/g, ' ').toUpperCase();
};

export const calculateSlaStatus = (order) => {
  if (order.status === 'DELIVERED' || order.status === 'COMPLETED' || order.status === 'CANCELLED') {
    return { isDelayed: false, badgeText: 'Completed', colorClass: 'text-emerald-400' };
  }

  const createdTime = new Date(order.createdDate || Date.now()).getTime();
  const now = Date.now();
  const hoursElapsed = (now - createdTime) / (1000 * 60 * 60);

  if (order.status === 'PROCUREMENT_REQUIRED' && hoursElapsed > 4) {
    return { isDelayed: true, badgeText: '⚠️ Procurement Delayed (>4h)', colorClass: 'text-rose-400' };
  }

  if (order.status === 'NEW' && hoursElapsed > 2) {
    return { isDelayed: true, badgeText: '⚠️ Sales Review Pending (>2h)', colorClass: 'text-amber-400' };
  }

  if (hoursElapsed > 48) {
    return { isDelayed: true, badgeText: '⚠️ SLA Breach (>48h)', colorClass: 'text-rose-400' };
  }

  return { isDelayed: false, badgeText: 'On Schedule', colorClass: 'text-blue-400' };
};

export const calculateItemFulfillmentSummary = (items = []) => {
  const totalOrdered = items.reduce((sum, item) => sum + (item.qty || 0), 0);
  const totalShortage = items.reduce((sum, item) => sum + (item.shortageQty || 0), 0);
  const totalReserved = items.reduce((sum, item) => sum + (item.stockAvailable || 0), 0);

  return {
    totalOrdered,
    totalShortage,
    totalReserved,
    isFullyStocked: totalShortage === 0
  };
};
