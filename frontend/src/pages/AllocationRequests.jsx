import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRightLeft,
  Wrench,
  Package,
  MessageSquare,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../components/Modal';

export const AllocationRequests = () => {
  const {
    transferRequests,
    returnRequests,
    maintenanceTickets,
    user,
    approveTransferRequest,
    rejectTransferRequest,
    approveReturnRequest,
    rejectReturnRequest,
    approveMaintenanceTicket,
    rejectMaintenanceTicket,
    employees
  } = useApp();

  const [activeTab, setActiveTab] = useState('transfers');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [comments, setComments] = useState('');

  // Access control
  if (user?.role !== 'Admin' && user?.role !== 'Asset Manager' && user?.role !== 'Department Head') {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-655" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Restricted Action Portal</h2>
        <p className="text-slate-500 text-sm">You do not possess the required management clearance level to access approval queues.</p>
      </div>
    );
  }

  // Filter transfers: Dept heads see transfers related to their department, managers/admin see all
  const filteredTransfers = transferRequests.filter(req => {
    if (user.role === 'Department Head') {
      const reqEmp = employees.find(e => e.id === req.requesterId);
      const tarEmp = employees.find(e => e.id === req.targetEmployeeId);
      return reqEmp?.department === user.department || tarEmp?.department === user.department;
    }
    return true;
  });

  const pendingTransfers = filteredTransfers.filter(r => r.status === 'Pending');
  const pastTransfers = filteredTransfers.filter(r => r.status !== 'Pending');

  // Return requests
  const pendingReturns = returnRequests.filter(r => r.status === 'Pending');
  const pastReturns = returnRequests.filter(r => r.status !== 'Pending');

  // Maintenance approvals
  const pendingMaintenance = maintenanceTickets.filter(t => t.status === 'Pending');
  const pastMaintenance = maintenanceTickets.filter(t => t.status !== 'Pending');

  const openCommentModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setComments('');
    setCommentModalOpen(true);
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    if (activeTab === 'transfers') {
      if (actionType === 'approve') {
        approveTransferRequest(selectedRequest.id, comments);
        toast.success(`Transfer Request ${selectedRequest.id} Approved.`);
      } else {
        rejectTransferRequest(selectedRequest.id, comments);
        toast.error(`Transfer Request ${selectedRequest.id} Rejected.`);
      }
    } else if (activeTab === 'returns') {
      if (actionType === 'approve') {
        approveReturnRequest(selectedRequest.id, comments);
        toast.success(`Return Request ${selectedRequest.id} Approved.`);
      } else {
        rejectReturnRequest(selectedRequest.id, comments);
        toast.error(`Return Request ${selectedRequest.id} Rejected.`);
      }
    } else if (activeTab === 'maintenance') {
      if (actionType === 'approve') {
        approveMaintenanceTicket(selectedRequest.id, comments);
        toast.success(`Maintenance Ticket MNT ${selectedRequest.id} Approved.`);
      } else {
        rejectMaintenanceTicket(selectedRequest.id, comments);
        toast.error(`Maintenance Ticket MNT ${selectedRequest.id} Rejected.`);
      }
    }

    setCommentModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Approvals & Workflow Controls</h1>
        <p className="text-slate-500 text-sm mt-1">Review custodian transfers, equipment return inspections, and pending repair tickets.</p>
      </div>

      {/* Tabs list */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold tracking-tight shrink-0">
        <button
          onClick={() => setActiveTab('transfers')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'transfers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowRightLeft className="w-4.5 h-4.5" /> Transfer Requests ({pendingTransfers.length})
        </button>

        {user.role !== 'Department Head' && (
          <>
            <button
              onClick={() => setActiveTab('returns')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'returns' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-4.5 h-4.5" /> Returns Queue ({pendingReturns.length})
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'maintenance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wrench className="w-4.5 h-4.5" /> Repairs Tickets ({pendingMaintenance.length})
            </button>
          </>
        )}
      </div>

      {/* Approvals table grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pending queue (col span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" /> Pending Action Queue
          </h3>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {activeTab === 'transfers' && (
              <div className="divide-y divide-slate-100">
                {pendingTransfers.map((req) => (
                  <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1.5 text-xs text-slate-655">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{req.assetName} ({req.assetTag})</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold font-mono text-[9px] border border-blue-150">{req.id}</span>
                      </div>
                      <p>Requester: <span className="font-bold text-slate-700">{req.requesterName}</span> ➔ Target User: <span className="font-bold text-slate-700">{req.targetEmployeeName}</span></p>
                      <p className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Justification: "{req.comments}"</p>
                    </div>
                    <div className="flex gap-2.5 md:self-center shrink-0 text-xs">
                      <button
                        onClick={() => openCommentModal(req, 'reject')}
                        className="px-4 py-2 border border-slate-200 hover:bg-red-50 text-slate-700 hover:text-red-655 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-red-500" /> Reject
                      </button>
                      <button
                        onClick={() => openCommentModal(req, 'approve')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4 text-white" /> Approve
                      </button>
                    </div>
                  </div>
                ))}
                {pendingTransfers.length === 0 && (
                  <p className="p-8 text-center text-xs text-slate-400">No pending transfer requests.</p>
                )}
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="divide-y divide-slate-100">
                {pendingReturns.map((req) => (
                  <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1.5 text-xs text-slate-655">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{req.assetName} ({req.assetTag})</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold font-mono text-[9px] border">{req.id}</span>
                      </div>
                      <p>Employee Returning: <span className="font-bold text-slate-700">{req.employeeName}</span></p>
                      <p>Return Condition: <span className="font-bold text-slate-800">{req.returnCondition}</span></p>
                      <p className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Remarks: "{req.notes || 'No comments'}"</p>
                    </div>
                    <div className="flex gap-2.5 shrink-0 text-xs">
                      <button
                        onClick={() => openCommentModal(req, 'reject')}
                        className="px-4 py-2 border border-slate-200 hover:bg-red-50 text-slate-700 hover:text-red-655 font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-red-500" /> Reject
                      </button>
                      <button
                        onClick={() => openCommentModal(req, 'approve')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4 text-white" /> Approve Return
                      </button>
                    </div>
                  </div>
                ))}
                {pendingReturns.length === 0 && (
                  <p className="p-8 text-center text-xs text-slate-450">No pending returns in queue.</p>
                )}
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="divide-y divide-slate-100">
                {pendingMaintenance.map((t) => (
                  <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1.5 text-xs text-slate-655">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{t.assetName} ({t.assetTag})</span>
                        <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-bold font-mono text-[9px] border border-orange-150">{t.id}</span>
                      </div>
                      <p>Issue Reported: <span className="font-bold text-slate-800">{t.issue}</span></p>
                      <p>Priority Level: <span className={`font-bold ${t.priority === 'High' ? 'text-red-600' : 'text-slate-600'}`}>{t.priority}</span></p>
                      <p>Report Date: <span className="font-semibold text-slate-700">{t.createdDate}</span></p>
                    </div>
                    <div className="flex gap-2.5 shrink-0 text-xs">
                      <button
                        onClick={() => openCommentModal(t, 'reject')}
                        className="px-4 py-2 border border-slate-200 hover:bg-red-50 text-slate-700 hover:text-red-655 font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-red-500" /> Reject
                      </button>
                      <button
                        onClick={() => openCommentModal(t, 'approve')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4 text-white" /> Approve Repair
                      </button>
                    </div>
                  </div>
                ))}
                {pendingMaintenance.length === 0 && (
                  <p className="p-8 text-center text-xs text-slate-450">No pending repairs tickets.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Approval History logs (col span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-slate-400" /> Past Approved / Rejected Decisions
          </h3>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs max-h-[480px] overflow-y-auto space-y-4">
            {activeTab === 'transfers' && (
              <>
                {pastTransfers.map(t => (
                  <div key={t.id} className="p-3 border rounded-xl bg-slate-50 text-xs flex flex-col gap-1">
                    <div className="flex justify-between font-bold">
                      <span className="truncate max-w-[70%]">{t.assetName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        t.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>{t.status}</span>
                    </div>
                    <p className="text-slate-500">Asset Tag: {t.assetTag}</p>
                    <p className="text-slate-500">Requested to: {t.targetEmployeeName}</p>
                    {t.comments && <p className="text-[10px] text-slate-450 italic mt-0.5">Comments: "{t.comments}"</p>}
                    <div className="text-[9px] text-slate-400 font-bold border-t pt-1 mt-1 flex justify-between">
                      <span>Date: {t.date}</span>
                    </div>
                  </div>
                ))}
                {pastTransfers.length === 0 && <p className="text-center text-slate-400 text-xs py-8">No past decisions logged.</p>}
              </>
            )}

            {activeTab === 'returns' && (
              <>
                {pastReturns.map(r => (
                  <div key={r.id} className="p-3 border rounded-xl bg-slate-50 text-xs flex flex-col gap-1">
                    <div className="flex justify-between font-bold">
                      <span className="truncate max-w-[70%]">{r.assetName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        r.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>{r.status}</span>
                    </div>
                    <p className="text-slate-500">Tag: {r.assetTag}</p>
                    <p className="text-slate-500">Returned by: {r.employeeName}</p>
                    <div className="text-[9px] text-slate-400 font-bold border-t pt-1 mt-1">
                      <span>Date: {r.date}</span>
                    </div>
                  </div>
                ))}
                {pastReturns.length === 0 && <p className="text-center text-slate-400 text-xs py-8">No past returns registered.</p>}
              </>
            )}

            {activeTab === 'maintenance' && (
              <>
                {pastMaintenance.map(m => (
                  <div key={m.id} className="p-3 border rounded-xl bg-slate-50 text-xs flex flex-col gap-1">
                    <div className="flex justify-between font-bold">
                      <span className="truncate max-w-[70%]">{m.assetName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        m.status === 'Resolved' || m.status === 'Approved' || m.status === 'In Progress' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>{m.status}</span>
                    </div>
                    <p className="text-slate-500">Tag: {m.assetTag}</p>
                    <p className="text-slate-500">Issue: {m.issue}</p>
                    <div className="text-[9px] text-slate-400 font-bold border-t pt-1 mt-1">
                      <span>Reported: {m.createdDate}</span>
                    </div>
                  </div>
                ))}
                {pastMaintenance.length === 0 && <p className="text-center text-slate-400 text-xs py-8">No past repairs tickets logged.</p>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* COMMENT DIALOG MODAL */}
      <Modal isOpen={commentModalOpen} onClose={() => setCommentModalOpen(false)} title="Approval Verification Panel">
        {selectedRequest && (
          <form onSubmit={handleActionSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border text-xs text-slate-655">
              <p className="font-bold text-slate-800">Confirming operational status for: {selectedRequest.assetTag} - {selectedRequest.assetName}</p>
              <p className="mt-1">Action: <span className={`font-bold capitalize ${actionType === 'approve' ? 'text-green-700' : 'text-red-700'}`}>{actionType}</span></p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sign-off Comments / Notes</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="3"
                placeholder="Write verification or rejection reasons..."
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button type="button" onClick={() => setCommentModalOpen(false)} className="px-4 py-2 border rounded-xl text-sm cursor-pointer">Cancel</button>
              <button
                type="submit"
                className={`px-5 py-2.5 text-white font-bold rounded-xl text-sm cursor-pointer ${
                  actionType === 'approve' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-650 hover:bg-red-750'
                }`}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
export default AllocationRequests;
