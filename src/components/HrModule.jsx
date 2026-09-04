import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  CalendarDays, 
  Receipt, 
  Clock, 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  DollarSign,
  UserPlus
} from 'lucide-react';

export const HrModule = () => {
  const { activeRole } = useApp();
  const [activeTab, setActiveTab] = useState('staff');

  // Seed Data: Staff Members
  const [employees, setEmployees] = useState([
    { id: 'EMP-101', name: 'Rohan Mehta', role: 'Sales Executive', dept: 'Sales', email: 'rohan@srkinnovation.com', phone: '+91 98123 45670', status: 'Active', joinDate: '12 Jan 2024' },
    { id: 'EMP-102', name: 'Priya Shah', role: 'Account Manager', dept: 'Sales', email: 'priya@srkinnovation.com', phone: '+91 98765 43210', status: 'Active', joinDate: '01 Mar 2024' },
    { id: 'EMP-103', name: 'Amit Verma', role: 'Logistics Lead', dept: 'Dispatch', email: 'amit@srkinnovation.com', phone: '+91 99887 76655', status: 'Active', joinDate: '15 Aug 2023' },
    { id: 'EMP-104', name: 'Sanjay Kumar', role: 'Procurement Spec.', dept: 'Procurement', email: 'sanjay@srkinnovation.com', phone: '+91 91234 56789', status: 'Active', joinDate: '10 Nov 2023' },
    { id: 'EMP-105', name: 'Neha Gupta', role: 'Accounts Officer', dept: 'Accounts', email: 'neha@srkinnovation.com', phone: '+91 97654 32109', status: 'Active', joinDate: '05 May 2024' }
  ]);

  // Seed Data: Leave Applications
  const [leaves, setLeaves] = useState([
    { id: 'LV-201', empName: 'Rohan Mehta', type: 'Casual Leave', dates: '26 Aug 2026 - 28 Aug 2026', days: 3, reason: 'Family event in hometown', status: 'PENDING' },
    { id: 'LV-202', empName: 'Neha Gupta', type: 'Sick Leave', dates: '24 Aug 2026', days: 1, reason: 'Medical appointment', status: 'APPROVED' },
    { id: 'LV-203', empName: 'Amit Verma', type: 'Earned Leave', dates: '01 Sep 2026 - 05 Sep 2026', days: 5, reason: 'Annual vacation', status: 'PENDING' }
  ]);

  // Seed Data: Expense Claims
  const [expenses, setExpenses] = useState([
    { id: 'EXP-301', empName: 'Rohan Mehta', category: 'Client Travel', amount: 3450, date: '22 Aug 2026', desc: 'Cab & travel expenses for client demo', status: 'APPROVED' },
    { id: 'EXP-302', empName: 'Amit Verma', category: 'Couriers & Logistics', amount: 1280, date: '23 Aug 2026', desc: 'Local urgent dispatch courier charges', status: 'PENDING' },
    { id: 'EXP-303', empName: 'Sanjay Kumar', category: 'Vendor Meeting', amount: 2100, date: '21 Aug 2026', desc: 'Dinner & discussion with RFID vendor', status: 'PENDING' }
  ]);

  // Seed Data: Timesheets
  const [timesheets, setTimesheets] = useState([
    { id: 'TS-401', empName: 'Rohan Mehta', date: '24 Aug 2026', hours: '8.5 hrs', project: 'Client Order Fulfillment', task: 'Address verification & client calls', status: 'SUBMITTED' },
    { id: 'TS-402', empName: 'Priya Shah', date: '24 Aug 2026', hours: '9.0 hrs', project: 'Enterprise Quotations', task: 'Drafted 3 commercial proposals', status: 'APPROVED' },
    { id: 'TS-403', empName: 'Amit Verma', date: '24 Aug 2026', hours: '8.0 hrs', project: 'Warehouse Operations', task: 'Barcode & RFID scanner tagging', status: 'APPROVED' }
  ]);

  // Seed Data: Recruitment Jobs
  const [jobs, setJobs] = useState([
    { id: 'JOB-501', title: 'Senior Sales Manager', dept: 'Sales', location: 'Pune / Remote', applicants: 14, status: 'OPEN' },
    { id: 'JOB-502', title: 'Embedded Electronics Tech', dept: 'RMA & Repairs', location: 'Pune Hub', applicants: 8, status: 'OPEN' },
    { id: 'JOB-503', title: 'Warehouse Associate', dept: 'Dispatch', location: 'Pune Hub', applicants: 19, status: 'FILLED' }
  ]);

  // Modals state
  const [addEmpModalOpen, setAddEmpModalOpen] = useState(false);
  const [addLeaveModalOpen, setAddLeaveModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

  // Form fields
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Sales');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');

  const [leaveEmp, setLeaveEmp] = useState('Rohan Mehta');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveDates, setLeaveDates] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');

  const [expEmp, setExpEmp] = useState('Rohan Mehta');
  const [expCategory, setExpCategory] = useState('Client Travel');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmpName) return;
    const item = {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: newEmpName,
      role: newEmpRole || 'Staff Associate',
      dept: newEmpDept,
      email: newEmpEmail || `${newEmpName.toLowerCase().replace(/\s+/g, '')}@srkinnovation.com`,
      phone: newEmpPhone || '+91 98000 00000',
      status: 'Active',
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setEmployees([item, ...employees]);
    setAddEmpModalOpen(false);
    setNewEmpName(''); setNewEmpRole(''); setNewEmpEmail(''); setNewEmpPhone('');
  };

  const handleAddLeave = (e) => {
    e.preventDefault();
    if (!leaveDates) return;
    const item = {
      id: `LV-${Math.floor(200 + Math.random() * 900)}`,
      empName: leaveEmp,
      type: leaveType,
      dates: leaveDates,
      days: Number(leaveDays || 1),
      reason: leaveReason || 'Personal work',
      status: 'PENDING'
    };
    setLeaves([item, ...leaves]);
    setAddLeaveModalOpen(false);
    setLeaveDates(''); setLeaveReason('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expAmount) return;
    const item = {
      id: `EXP-${Math.floor(300 + Math.random() * 900)}`,
      empName: expEmp,
      category: expCategory,
      amount: Number(expAmount),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      desc: expDesc || 'Office expense claim',
      status: 'PENDING'
    };
    setExpenses([item, ...expenses]);
    setAddExpenseModalOpen(false);
    setExpAmount(''); setExpDesc('');
  };

  const handleLeaveStatusChange = (id, newStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleExpenseStatusChange = (id, newStatus) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Human Resources (HRM)</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Employee Directory, Leave Approvals, Expense Reimbursements, Timesheets & Recruitment
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'staff' && (
            <button
              onClick={() => setAddEmpModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}

          {activeTab === 'leaves' && (
            <button
              onClick={() => setAddLeaveModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Apply Leave</span>
            </button>
          )}

          {activeTab === 'expenses' && (
            <button
              onClick={() => setAddExpenseModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 p-1.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto custom-scrollbar">
        {[
          { id: 'staff', label: `Staff Directory (${employees.length})`, icon: Users },
          { id: 'leaves', label: `Leave Requests (${leaves.filter(l => l.status === 'PENDING').length} Pending)`, icon: CalendarDays },
          { id: 'expenses', label: `Expense Claims (${expenses.filter(e => e.status === 'PENDING').length} Pending)`, icon: Receipt },
          { id: 'timesheets', label: 'Timesheets', icon: Clock },
          { id: 'recruitment', label: `Recruitment Jobs (${jobs.filter(j => j.status === 'OPEN').length} Open)`, icon: Briefcase }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Staff Directory */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(emp => (
            <div key={emp.id} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{emp.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                  {emp.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{emp.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{emp.role} • {emp.dept}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium truncate max-w-[170px]">{emp.email}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-medium">{emp.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Joined:</span>
                  <span className="font-medium">{emp.joinDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Leave Applications */}
      {activeTab === 'leaves' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Leave ID</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Dates & Duration</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {leaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{l.id}</td>
                    <td className="py-3 px-4 font-bold">{l.empName}</td>
                    <td className="py-3 px-4 font-medium">{l.type}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold">{l.dates}</span>
                      <span className="text-[11px] text-slate-400 block">({l.days} days)</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{l.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' :
                        l.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400 border border-red-300 dark:border-red-500/30' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {l.status === 'PENDING' && (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleLeaveStatusChange(l.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleLeaveStatusChange(l.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center space-x-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Expense Claims */}
      {activeTab === 'expenses' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Claim ID</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{e.id}</td>
                    <td className="py-3 px-4 font-bold">{e.empName}</td>
                    <td className="py-3 px-4 font-medium">{e.category}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-slate-100">Rs. {e.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[220px] truncate">{e.desc}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        e.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' :
                        e.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400 border border-red-300 dark:border-red-500/30' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {e.status === 'PENDING' && (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleExpenseStatusChange(e.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleExpenseStatusChange(e.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center space-x-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Timesheets */}
      {activeTab === 'timesheets' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Hours</th>
                  <th className="py-3.5 px-4">Project / Task</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {timesheets.map(t => (
                  <tr key={t.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{t.id}</td>
                    <td className="py-3 px-4 font-bold">{t.empName}</td>
                    <td className="py-3 px-4 font-medium">{t.date}</td>
                    <td className="py-3 px-4 font-extrabold text-blue-600 dark:text-blue-400">{t.hours}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{t.project}</span>
                      <span className="text-slate-500 text-[11px]">{t.task}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Recruitment Jobs */}
      {activeTab === 'recruitment' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{job.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  job.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {job.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{job.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.dept} • {job.location}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">{job.applicants} Applicants</span>
                <button className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                  View Candidates
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Add Employee */}
      {addEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleAddEmployee} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl">
            <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-800 pb-2">Add New Staff Member</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                <input required type="text" value={newEmpName} onChange={e => setNewEmpName(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="e.g. Vikas Sharma" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Role / Designation</label>
                <input type="text" value={newEmpRole} onChange={e => setNewEmpRole(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="e.g. Dispatch Officer" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Department</label>
                <select value={newEmpDept} onChange={e => setNewEmpDept(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">
                  <option value="Sales">Sales</option>
                  <option value="Dispatch">Dispatch</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Accounts">Accounts</option>
                  <option value="RMA & Service">RMA & Service</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setAddEmpModalOpen(false)} className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">Add Staff</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
