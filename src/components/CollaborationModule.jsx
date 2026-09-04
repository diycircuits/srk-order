import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  CheckSquare, 
  FolderKanban, 
  MessageSquare, 
  HelpCircle, 
  Plus, 
  Clock, 
  Download, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const CollaborationModule = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  // Seed Data: Company Calendar Events
  const [events, setEvents] = useState([
    { id: 'EVT-101', title: 'Monthly Sales & Order Dispatch Sync', date: '26 Aug 2026', time: '10:30 AM', location: 'Main Conference Room / Teams', organizer: 'Rohan Mehta', category: 'Meeting' },
    { id: 'EVT-102', title: 'RFID Scanner Firmware Upgrade Demo', date: '28 Aug 2026', time: '02:00 PM', location: 'Dispatch & Testing Lab', organizer: 'Amit Verma', category: 'Training' },
    { id: 'EVT-103', title: 'Quarterly Inventory Audit', date: '01 Sep 2026', time: '09:00 AM', location: 'Pune Warehouse', organizer: 'Sanjay Kumar', category: 'Audit' }
  ]);

  // Seed Data: Projects & Tasks
  const [projects, setProjects] = useState([
    { id: 'PRJ-201', name: 'Q3 Enterprise RFID Expansion', lead: 'Rohan Mehta', status: 'IN_PROGRESS', progress: 65, tasksCount: 12, dueDate: '15 Sep 2026' },
    { id: 'PRJ-202', name: 'Zoho Books Realtime Integration', lead: 'Neha Gupta', status: 'COMPLETED', progress: 100, tasksCount: 8, dueDate: '20 Aug 2026' },
    { id: 'PRJ-203', name: 'Barcoding Warehouse Automation', lead: 'Amit Verma', status: 'IN_PROGRESS', progress: 40, tasksCount: 15, dueDate: '30 Sep 2026' }
  ]);

  // Seed Data: Internal Support Tickets & Knowledgebase
  const [tickets, setTickets] = useState([
    { id: 'TKT-301', subject: 'Printer alignment issue for shipping AWBs', requester: 'Amit Verma', dept: 'Dispatch', priority: 'HIGH', status: 'OPEN', date: '24 Aug 2026' },
    { id: 'TKT-302', subject: 'Request for secondary barcode scanner unit', requester: 'Sanjay Kumar', dept: 'Procurement', priority: 'MEDIUM', status: 'RESOLVED', date: '23 Aug 2026' }
  ]);

  // Download iCal calendar file
  const handleExportICal = () => {
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SRK Innovations ERP//Calendar//EN
${events.map(e => `BEGIN:VEVENT
SUMMARY:${e.title}
DESCRIPTION:${e.category} - ${e.location}
STATUS:CONFIRMED
END:VEVENT`).join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'srk-erp-company-agenda.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Collaboration & Projects Hub</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Shared Agenda Calendar, Company Projects, Task Board & Helpdesk Knowledgebase
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'calendar' && (
            <button
              onClick={handleExportICal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export iCal Calendar (.ics)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 p-1.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto custom-scrollbar">
        {[
          { id: 'calendar', label: 'Company Agenda & Events', icon: Calendar },
          { id: 'projects', label: `Projects & Tasks (${projects.length})`, icon: FolderKanban },
          { id: 'tickets', label: `Helpdesk Tickets (${tickets.filter(t => t.status === 'OPEN').length} Open)`, icon: HelpCircle }
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

      {/* Tab 1: Shared Calendar Events */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map(evt => (
              <div key={evt.id} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{evt.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    {evt.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{evt.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">📍 {evt.location}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{evt.date} • {evt.time}</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">{evt.organizer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Projects & Tasks */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{p.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30'
                }`}>
                  {p.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{p.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lead: {p.lead} • Due: {p.dueDate}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Helpdesk Tickets */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{t.id}</td>
                  <td className="py-3 px-4 font-bold">{t.subject}</td>
                  <td className="py-3 px-4">{t.requester} ({t.dept})</td>
                  <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">{t.priority}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
