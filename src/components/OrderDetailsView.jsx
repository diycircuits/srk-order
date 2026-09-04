import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Package, 
  Truck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Boxes, 
  MessageSquare, 
  ExternalLink, 
  Download, 
  Printer, 
  UserCheck, 
  RefreshCw,
  QrCode,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Paperclip,
  Flag,
  User,
  Plus,
  Send,
  Building,
  Mail,
  Phone,
  CreditCard,
  Upload,
  Trash2
} from 'lucide-react';
import { calculateSlaStatus } from '../engine/WorkflowEngine';

const WORKFLOW_NODES = [
  { key: "New Order", label: "New", short: "New" },
  { key: "Address Confirmation", label: "Address", short: "Address" },
  { key: "Payment Follow-up", label: "Payment", short: "Payment" },
  { key: "Invoice", label: "Invoice", short: "Invoice" },
  { key: "Vendor Purchase", label: "Vendor", short: "Vendor" },
  { key: "Ready to Dispatch", label: "Ready", short: "Ready" },
  { key: "Dispatched", label: "Dispatched", short: "Dispatched" },
  { key: "In Transit", label: "Transit", short: "Transit" },
  { key: "Delivered", label: "Delivered", short: "Delivered" },
  { key: "Closed", label: "Closed", short: "Closed" }
];

export const OrderDetailsView = () => {
  const { 
    orderDetailsOrder, 
    setOrderDetailsOrder, 
    updateOrderStatus, 
    deleteOrder,
    forwardOrder,
    updateOrderPriority,
    addOrderNote,
    addOrderAttachment,
    setViewInvoiceOrder,
    activeRole
  } = useApp();

  const [activeTab, setActiveTab] = useState('pipeline');
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [toStageInput, setToStageInput] = useState('');
  const [remarksInput, setRemarksInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('Medium');
  const [fileNameInput, setFileNameInput] = useState('');

  if (!orderDetailsOrder) return null;

  const ord = orderDetailsOrder;
  const sla = calculateSlaStatus(ord);

  // Normalize current stage
  const getNormalizedStage = (order) => {
    const status = order.stage || order.status || "New Order";
    const found = WORKFLOW_NODES.find(n => n.key === status);
    if (found) return found.key;
    const lower = String(status).toLowerCase();
    if (lower.includes('confirm') || lower.includes('address')) return "Address Confirmation";
    if (lower.includes('payment') || lower.includes('unpaid')) return "Payment Follow-up";
    if (lower.includes('invoice')) return "Invoice";
    if (lower.includes('procurement') || lower.includes('vendor')) return "Vendor Purchase";
    if (lower.includes('ready') || lower.includes('packing')) return "Ready to Dispatch";
    if (lower.includes('transit')) return "In Transit";
    if (lower.includes('dispatch')) return "Dispatched";
    if (lower.includes('deliver')) return "Delivered";
    if (lower.includes('closed') || lower.includes('complete')) return "Closed";
    return "New Order";
  };

  const currentStageKey = getNormalizedStage(ord);
  const currentIdx = WORKFLOW_NODES.findIndex(n => n.key === currentStageKey);

  const getNextStage = () => {
    if (currentIdx >= 0 && currentIdx < WORKFLOW_NODES.length - 1) {
      return WORKFLOW_NODES[currentIdx + 1].key;
    }
    return WORKFLOW_NODES[0].key;
  };

  const handleForwardSubmit = async () => {
    const targetStage = toStageInput || getNextStage();
    const orderId = ord.id || ord.orderId;
    if (forwardOrder) {
      await forwardOrder(orderId, currentStageKey, targetStage, remarksInput, activeRole || "Super Admin");
    } else if (updateOrderStatus) {
      updateOrderStatus(orderId, targetStage, remarksInput);
    }
    setForwardModalOpen(false);
    setRemarksInput('');
  };

  const handleNoteSubmit = () => {
    if (!noteInput.trim()) return;
    const orderId = ord.id || ord.orderId;
    if (addOrderNote) addOrderNote(orderId, noteInput);
    setNoteModalOpen(false);
    setNoteInput('');
  };

  const handlePrioritySubmit = () => {
    const orderId = ord.id || ord.orderId;
    if (updateOrderPriority) updateOrderPriority(orderId, priorityInput);
    setPriorityModalOpen(false);
  };

  const handleAttachmentSubmit = () => {
    if (!fileNameInput.trim()) return;
    const orderId = ord.id || ord.orderId;
    if (addOrderAttachment) addOrderAttachment(orderId, { name: fileNameInput, url: '#' });
    setAttachModalOpen(false);
    setFileNameInput('');
  };

  const getInitials = (name) => {
    return String(name || 'SA').split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  };

  const formattedAmount = (val) => {
    const num = Number(val || 0);
    return `Rs. ${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 px-6 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setOrderDetailsOrder(null)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span>← Back to Orders</span>
            </button>

            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-tight">
                {ord.id || ord.orderId || 'SRK-1001'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentStageKey}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center space-x-1">
                <span>↓ {ord.priority || 'Low'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setToStageInput(getNextStage()); setForwardModalOpen(true); }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Forward Stage</span>
            </button>

            <button
              onClick={() => setNoteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Add Note</span>
            </button>

            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center space-x-1.5 border border-red-200 dark:border-red-500/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => setOrderDetailsOrder(null)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center space-x-1 px-6 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold py-2">
          {[
            { id: 'pipeline', label: '1. Workflow Stepper' },
            { id: 'overview', label: '2. General Details' },
            { id: 'items', label: '3. Order Breakdown' },
            { id: 'notes', label: `4. Notes (${(ord.notes || []).length})` },
            { id: 'invoice', label: '5. Tax Invoice' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 dark:bg-blue-500 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-slate-900 custom-scrollbar">
          
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              
              {/* 10-NODE STAGE PROGRESS STEPPER BAR */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between overflow-x-auto pb-2 custom-scrollbar">
                  {WORKFLOW_NODES.map((node, i) => {
                    const isDone = i < currentIdx;
                    const isActive = i === currentIdx;

                    return (
                      <React.Fragment key={node.key}>
                        <div className="flex flex-col items-center space-y-2 min-w-[54px] shrink-0">
                          <div 
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                              isDone 
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                                : isActive 
                                ? 'bg-blue-600 dark:bg-blue-500 text-white border-2 border-blue-400 shadow-md ring-4 ring-blue-500/20' 
                                : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : (i + 1)}
                          </div>
                          <span className={`text-[10px] font-bold text-center ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : isDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {node.short}
                          </span>
                        </div>

                        {i < WORKFLOW_NODES.length - 1 && (
                          <div 
                            className={`h-[2px] flex-1 min-w-[20px] mx-1 mt-[-18px] transition-colors ${
                              i < currentIdx ? 'bg-emerald-500' : i === currentIdx ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Main Grid: Client Information (Left) + Assignment & Actions (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Card: Client Information */}
                <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                  <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">Client Information</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">ORDER DATE</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.orderDate || ord.createdDate || '23 Aug 2026'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">SOURCE / PI</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.source || ord.piNumber || ord.id || 'PI-2707'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">SALES PERSON</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.salesPerson || ord.assignedTo || 'Priya Shah'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">CLIENT NAME</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{ord.clientName || ord.customerName || 'JM Enterprises'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">EMAIL</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{ord.clientEmail || ord.customerEmail || 'contact7@example.com'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">PHONE</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.clientPhone || ord.customerPhone || '+91 9813123420'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">CITY</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.city || 'Delhi'}</span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">ADDRESS</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 line-clamp-2">{ord.address || ord.shippingAddress || 'Industrial Area, Pune, Maharashtra 411018'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">PRODUCT</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.product || (ord.items && ord.items[0]?.name) || 'Windshield Tag'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">QTY</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.qty || ord.totalOrderedQty || '176'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">AMOUNT</span>
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">{formattedAmount(ord.amount || ord.totalAmount || 218320)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">ADVANCE</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formattedAmount(ord.advance || ord.paidAmount || 0)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">BALANCE</span>
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{formattedAmount(ord.balance || ord.dueAmount || 218320)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">INVOICE NO.</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.invoiceNo || 'Pending'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">VENDOR</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.vendorDetails || ord.vendorName || 'ID Tech'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">VENDOR INVOICE/DOCKET</span>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{ord.vendorInvoiceDocket || '-'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">ADDRESS CONFIRMATION</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.addressConfirmation || 'Yes'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">COURIER</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ord.courierName || ord.courierDetails?.courierName || 'Tirupati'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">TRACKING NO.</span>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{ord.trackingNo || ord.courierDetails?.awbNumber || 'Not assigned'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">DISPATCH STATUS</span>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{ord.dispatchStatus || '-'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-1">DISPATCH DATE</span>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{ord.dispatchDate || '-'}</span>
                    </div>
                  </div>

                  {/* Product Details / Material Text Section */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                      PRODUCT DETAILS / MATERIAL
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                      {ord.itemsDescription || ord.product || 'Barcode Scanner MT9054 - 17'}
                    </p>
                  </div>

                  {/* Order Attachments List */}
                  {(ord.attachments && ord.attachments.length > 0) && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                        ATTACHED DOCUMENTS ({ord.attachments.length})
                      </span>
                      <div className="space-y-1.5">
                        {ord.attachments.map(att => (
                          <div key={att.id || att.name} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                              <span className="font-bold text-slate-800 dark:text-slate-200">{att.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{att.uploadedBy || 'Admin'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Assignment + Quick Actions */}
                <div className="space-y-6">
                  
                  {/* Assignment Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">Assignment</h3>
                    </div>

                    <div className="flex items-center space-x-3.5 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="w-11 h-11 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md shrink-0">
                        {getInitials(ord.assignedTo || 'Rohan Mehta')}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{ord.assignedTo || 'Rohan Mehta'}</h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Sales</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs pt-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">CURRENT STAGE</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{currentStageKey}</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">DEPARTMENT</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Sales</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">CREATED</span>
                        <span className="font-medium text-slate-500 dark:text-slate-400">{ord.orderDate || ord.createdDate || '23 Aug 2026'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <span className="text-blue-600 dark:text-blue-400">⚡</span>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">Quick Actions</h3>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <button
                        onClick={() => { setToStageInput(getNextStage()); setForwardModalOpen(true); }}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Forward to Next Stage</span>
                      </button>

                      <button
                        onClick={() => setNoteModalOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Add Internal Note</span>
                      </button>

                      <button
                        onClick={() => { setPriorityInput(ord.priority || 'Medium'); setPriorityModalOpen(true); }}
                        className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        <Flag className="w-3.5 h-3.5 text-yellow-500" />
                        <span>Change Priority</span>
                      </button>

                      <button
                        onClick={() => setAttachModalOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-purple-500" />
                        <span>Attach File</span>
                      </button>

                      <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center space-x-2 border border-red-200 dark:border-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Delete Order</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">ERP Overview & Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-bold block mb-1">TOTAL BOOKING VALUE</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{formattedAmount(ord.amount || ord.totalAmount)}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-bold block mb-1">BALANCE DUE</span>
                  <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{formattedAmount(ord.balance || ord.dueAmount)}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-bold block mb-1">COURIER TRACKING</span>
                  <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400 block">{ord.trackingNo || ord.courierDetails?.awbNumber || 'Not assigned'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Ordered Items Breakdown</h3>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-slate-800 dark:text-slate-200 font-mono">{ord.itemsDescription || ord.product || 'Product details breakdown'}</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Internal Order Notes</h3>
                <button
                  onClick={() => setNoteModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </div>

              {(ord.notes && ord.notes.length > 0) ? (
                <div className="space-y-2">
                  {ord.notes.map(n => (
                    <div key={n.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">{n.author}</span>
                        <span className="text-slate-400">{new Date(n.timestamp).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 text-xs font-medium">{n.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
                  No internal notes recorded yet.
                </div>
              )}
            </div>
          )}

          {activeTab === 'invoice' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Tax Invoice Generator</h3>
                <button
                  onClick={() => setViewInvoiceOrder(ord)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: Forward to Next Stage */}
        {forwardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">Forward Order {ord.id || ord.orderId}</h3>
                <button onClick={() => setForwardModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">Target Stage</label>
                  <select
                    value={toStageInput}
                    onChange={(e) => setToStageInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                  >
                    {WORKFLOW_NODES.map(n => (
                      <option key={n.key} value={n.key}>{n.key}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">Transition Remarks / Notes</label>
                  <textarea
                    placeholder="Enter stage transition notes..."
                    value={remarksInput}
                    onChange={(e) => setRemarksInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium h-24 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setForwardModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForwardSubmit}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  Forward Stage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add Internal Note */}
        {noteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">Add Internal Note</h3>
                <button onClick={() => setNoteModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block text-slate-500 dark:text-slate-400 font-bold">Internal Remark / Log</label>
                <textarea
                  placeholder="Type internal note here..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium h-24 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setNoteModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNoteSubmit}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Change Priority */}
        {priorityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">Change Priority Level</h3>
                <button onClick={() => setPriorityModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block text-slate-500 dark:text-slate-400 font-bold">Select Priority</label>
                <select
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setPriorityModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrioritySubmit}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  Update Priority
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Attach File */}
        {attachModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">Attach Document / File</h3>
                <button onClick={() => setAttachModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">Document Title / File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. PO_Confirmation_Doc.pdf"
                    value={fileNameInput}
                    onChange={(e) => setFileNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setAttachModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAttachmentSubmit}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  Attach File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Delete Order Confirmation */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Delete Order {ord.id || ord.orderId}</span>
                </div>
                <button onClick={() => setDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>Are you sure you want to permanently delete order <strong className="text-slate-900 dark:text-white">{ord.id || ord.orderId}</strong> for customer <strong className="text-slate-900 dark:text-white">{ord.customerName || ord.clientName}</strong>?</p>
                <p className="text-[11px] text-red-500 font-semibold">This action will remove the record from SQLite database and cannot be undone.</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const orderId = ord.id || ord.orderId;
                    if (deleteOrder) deleteOrder(orderId);
                    setDeleteModalOpen(false);
                    setOrderDetailsOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
