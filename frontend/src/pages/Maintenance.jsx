import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { PriorityBadge } from '../components/Badges';
import {
  Wrench,
  Plus,
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  AlertTriangle,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Maintenance = () => {
  const {
    maintenanceTickets,
    assets,
    addMaintenanceTicket,
    updateMaintenanceTicket
  } = useApp();

  const [searchParams] = useSearchParams();

  // Kanban Columns
  const columns = [
    { id: 'Pending', name: 'Pending Review', bg: 'bg-slate-100/50' },
    { id: 'Approved', name: 'Approved', bg: 'bg-blue-50/20' },
    { id: 'Technician Assigned', name: 'Tech Assigned', bg: 'bg-indigo-50/20' },
    { id: 'In Progress', name: 'In Progress', bg: 'bg-orange-50/20' },
    { id: 'Resolved', name: 'Resolved', bg: 'bg-green-50/20' }
  ];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  // Form State
  const [ticketForm, setTicketForm] = useState({
    assetTag: '',
    issue: '',
    priority: 'Medium',
    dueDate: '',
    technician: 'Alex Mercer (IT Tech)',
    notes: ''
  });

  // Watch URL params (e.g., from Dashboard quick actions)
  useEffect(() => {
    if (searchParams.get('openRequest') === 'true') {
      setIsModalOpen(true);
      const tagParam = searchParams.get('tag');
      if (tagParam) {
        setTicketForm(prev => ({ ...prev, assetTag: tagParam }));
      }
    }
  }, [searchParams]);

  // Kanban Drag & Drop event handlers
  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId) {
      updateMaintenanceTicket(ticketId, { status: targetStatus });
      toast.success(`Ticket status updated to ${targetStatus}`);
    }
  };

  // Click-based accessibility moves (in case drag-and-drop is tricky or for keyboards/tablets)
  const moveTicketStatus = (ticketId, currentStatus, direction) => {
    const statusOrder = ['Pending', 'Approved', 'Technician Assigned', 'In Progress', 'Resolved'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      const nextStatus = statusOrder[nextIndex];
      updateMaintenanceTicket(ticketId, { status: nextStatus });
      toast.success(`Ticket status updated to ${nextStatus}`);
    }
  };

  const handleTicketCreateSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.assetTag || !ticketForm.issue) {
      toast.error('Asset selection and Issue description are required.');
      return;
    }

    const targetAsset = assets.find(a => a.tag === ticketForm.assetTag);
    if (!targetAsset) {
      toast.error('Select a valid asset.');
      return;
    }

    addMaintenanceTicket({
      ...ticketForm,
      assetName: targetAsset.name
    });

    setIsModalOpen(false);
    // Reset Form
    setTicketForm({
      assetTag: '',
      issue: '',
      priority: 'Medium',
      dueDate: '',
      technician: 'Alex Mercer (IT Tech)',
      notes: ''
    });
  };

  const handleResolveTicket = (ticketId, remarkNotes) => {
    updateMaintenanceTicket(ticketId, { status: 'Resolved', notes: remarkNotes || 'Resolved successfully.' });
    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Maintenance Kanban</h1>
          <p className="text-slate-500 text-sm mt-1">Manage, approve, assign technicians, and track active repair requests.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" /> Raise Ticket
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto flex gap-6 pb-4 items-stretch min-h-0">
        {columns.map((col) => {
          const ticketsInCol = maintenanceTickets.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="w-80 shrink-0 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col max-h-full"
            >
              {/* Column Header */}
              <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-2xl shrink-0">
                <span className="font-bold text-slate-800 text-sm">{col.name}</span>
                <span className="bg-slate-100 text-slate-650 text-xs font-bold px-2 py-0.5 rounded-full">
                  {ticketsInCol.length}
                </span>
              </div>

              {/* Tickets list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {ticketsInCol.map((ticket) => (
                  <div
                    key={ticket.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ticket.id)}
                    onClick={() => { setActiveTicket(ticket); setIsDetailOpen(true); }}
                    className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group space-y-3 active:cursor-grabbing"
                  >
                    {/* Tag & Priority indicator */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-650 font-mono">{ticket.assetTag}</span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    {/* Asset Name & Issue */}
                    <div>
                      <p className="font-bold text-slate-800 text-xs leading-4 truncate group-hover:text-blue-600">{ticket.assetName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{ticket.issue}</p>
                    </div>

                    {/* Tech & Date details */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold border-t border-slate-50 pt-2.5">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {ticket.technician}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {ticket.dueDate}</span>
                    </div>

                    {/* Interactive Accessibility Shift State controls */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Move State</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => moveTicketStatus(ticket.id, ticket.status, -1)}
                          disabled={ticket.status === 'Pending'}
                          className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                          title="Move Left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <button
                          onClick={() => moveTicketStatus(ticket.id, ticket.status, 1)}
                          disabled={ticket.status === 'Resolved'}
                          className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                          title="Move Right"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
                {ticketsInCol.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400 select-none border border-dashed border-slate-200 rounded-xl">
                    Drop tickets here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TICKET CREATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Raise Asset Maintenance Ticket"
        size="md"
      >
        <form onSubmit={handleTicketCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-655 mb-1">Select Asset requiring service *</label>
            <select
              required
              value={ticketForm.assetTag}
              onChange={(e) => setTicketForm({ ...ticketForm, assetTag: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white font-semibold text-slate-700"
            >
              <option value="">-- Choose Asset Tag --</option>
              {assets.map(a => (
                <option key={a.tag} value={a.tag}>{a.tag} - {a.name} ({a.condition})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-655 mb-1">Issue / Fault Description *</label>
            <textarea
              required
              value={ticketForm.issue}
              onChange={(e) => setTicketForm({ ...ticketForm, issue: e.target.value })}
              rows="3"
              placeholder="Describe malfunction, paper jam, bulging batteries, liquid damage, diagnostic errors..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-655 mb-1">Priority Level *</label>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white"
              >
                <option value="Low">Low (Routine maintenance)</option>
                <option value="Medium">Medium (Disruptive but usable)</option>
                <option value="High">High (Immediate threat to ops/health)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-655 mb-1">Resolution Due Date</label>
              <input
                type="date"
                required
                value={ticketForm.dueDate}
                onChange={(e) => setTicketForm({ ...ticketForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-655 mb-1">Assign Technician / Workgroup</label>
            <select
              value={ticketForm.technician}
              onChange={(e) => setTicketForm({ ...ticketForm, technician: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white"
            >
              <option value="Alex Mercer (IT Tech)">Alex Mercer (IT Systems Support)</option>
              <option value="Brenda Jones (Office Systems)">Brenda Jones (Office Systems Tech)</option>
              <option value="Self (Assigned Manager)">Self (Assigned Manager Diagnostics)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer"
            >
              Raise Maintenance Order
            </button>
          </div>
        </form>
      </Modal>

      {/* TICKET DETAILS MODAL */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={activeTicket ? `Maintenance Ticket: ${activeTicket.id}` : 'Ticket Details'}
        size="md"
      >
        {activeTicket && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono font-bold text-xs text-blue-650">{activeTicket.assetTag}</span>
              <PriorityBadge priority={activeTicket.priority} />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asset Item</h4>
              <p className="text-sm font-semibold text-slate-800">{activeTicket.assetName}</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reported Issue</h4>
              <p className="text-xs text-slate-655 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{activeTicket.issue}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Technician</span>
                <span className="text-slate-700 mt-1 block flex items-center gap-1"><User className="w-3.5 h-3.5" /> {activeTicket.technician}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Due Date</span>
                <span className="text-slate-700 mt-1 block flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeTicket.dueDate}</span>
              </div>
            </div>

            {activeTicket.notes && (
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Technician Action Notes / Remarks</h4>
                <p className="text-xs text-slate-500 font-medium">{activeTicket.notes}</p>
              </div>
            )}

            {activeTicket.status !== 'Resolved' && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleResolveTicket(activeTicket.id, 'Repairs complete. Passed self-check diagnostics.')}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Mark as Resolved
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};
export default Maintenance;
