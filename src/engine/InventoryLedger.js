// SRK Innovations Multi-Location Inventory Ledger Engine

export const recordInventoryTransaction = (currentLedger, {
  productId,
  productSku,
  transactionType,
  fromLocationId,
  toLocationId,
  quantity,
  referenceId, // Order ID, PO ID, Transfer ID
  user
}) => {
  const transaction = {
    id: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    productId,
    productSku,
    transactionType, // STOCK_IN | STOCK_OUT | RESERVATION | RELEASE_RESERVATION | PURCHASE_RECEIPT | TRANSFER_OUT | TRANSFER_IN | DISPATCH
    fromLocationId: fromLocationId || 'EXTERNAL',
    toLocationId: toLocationId || 'EXTERNAL',
    quantity,
    referenceId,
    user: user || 'System Ledger'
  };

  return [transaction, ...currentLedger];
};

export const performAutomatedStockCheck = (orderItems, productsList) => {
  let hasShortage = false;
  const updatedItems = orderItems.map(item => {
    const product = productsList.find(p => p.sku === item.sku || p.id === item.id);
    if (!product) {
      return { ...item, stockAvailable: 0, shortageQty: item.qty, fulfillmentStatus: 'PROCUREMENT_REQUIRED' };
    }

    const availableStock = Object.entries(product.stockByLocation || {})
      .filter(([loc]) => loc !== 'Reserved' && loc !== 'LOC-TRANSIT')
      .reduce((sum, [, qty]) => sum + qty, 0);

    if (availableStock < item.qty) {
      hasShortage = true;
      const shortageQty = item.qty - availableStock;
      return {
        ...item,
        stockAvailable: availableStock,
        shortageQty,
        fulfillmentStatus: 'PROCUREMENT_REQUIRED'
      };
    } else {
      return {
        ...item,
        stockAvailable: item.qty,
        shortageQty: 0,
        fulfillmentStatus: 'READY_TO_FULFILL'
      };
    }
  });

  return {
    hasShortage,
    updatedItems
  };
};
