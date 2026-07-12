import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Search,
  SlidersHorizontal,
  RefreshCw,
  FileSpreadsheet,
  Download,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Audit = () => {
  const {
    auditItems,
    updateAuditItemStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedItemNotes, setSelectedItemNotes] = useState('');
  const [activeItemForNotes, setActiveItemForNotes] = useState(null);

  // Calculations
  const totalItems = auditItems.length;
  const verifiedCount = auditItems.filter(item => item.status === 'Verified').length;
  const missingCount = auditItems.filter(item => item.status === 'Missing').length;
  const damagedCount = auditItems.filter(item => item.status === 'Damaged').length;
  const pendingCount = auditItems.filter(item => item.status === 'Pending').length;

  const progressPercentage = Math.round((verifiedCount / totalItems) * 100) || 0;

  // Filtered Checklist
  const filteredChecklist = auditItems.filter(item => {
    const matchesSearch = 
      item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.expectedAssignee.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Action Triggers
  const handleVerify = (tag) => {
    updateAuditItemStatus(tag, 'Verified', 'Verified physically by manager.');
    toast.success(`Asset ${tag} verified.`);
  };

  const handleMissing = (tag) => {
    updateAuditItemStatus(tag, 'Missing', 'Could not locate during physical audit.');
    toast.error(`Asset ${tag} marked as MISSING.`);
  };

  const handleDamagedClick = (item) => {
    setActiveItemForNotes(item);
    setSelectedItemNotes(item.notes || '');
  };

  const handleDamagedSubmit = (e) => {
    e.preventDefault();
    if (activeItemForNotes) {
      updateAuditItemStatus(activeItemForNotes.assetTag, 'Damaged', selectedItemNotes || 'Damaged reported during audit.');
      toast.warning(`Asset ${activeItemForNotes.assetTag} flagged as DAMAGED.`);
      setActiveItemForNotes(null);
      setSelectedItemNotes('');
    }
  };

  const generateReport = () => {
    const discrepancies = auditItems.filter(item => item.status === 'Missing' || item.status === 'Damaged');
    if (discrepancies.length === 0) {
      toast.success('Zero discrepancies detected! All audited assets are verified.');
      return;
    }
    toast.success(`Discrepancy Report generated. ${discrepancies.length} faults flagged.`);
  };

  const handleExport = () => {
    toast.success('Simulation: Audit logs exported to Excel format.');
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Audit & Compliance</h1>
          <p className="text-slate-500 text-sm mt-1">Verify physical hardware presence, track missing items, and generate discrepancy reports.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={generateReport}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" /> Generate Discrepancy Report
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm py-2 px-4 rounded-xl transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4.5 h-4.5 text-slate-450" /> Export Excel
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Progress Bar Column */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-slate-800">Annual IT Audit 2026</span>
            <span className="font-bold text-blue-600">{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-450 font-semibold">
            {verifiedCount} of {totalItems} verified. {pendingCount} assets pending physical verification.
          </p>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-3 gap-4 md:col-span-2">
          <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-center">
            <span className="text-[10px] font-bold text-green-700 uppercase block">Verified</span>
            <span className="text-xl font-bold text-green-800 mt-1 block">{verifiedCount}</span>
          </div>
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
            <span className="text-[10px] font-bold text-red-700 uppercase block">Missing</span>
            <span className="text-xl font-bold text-red-800 mt-1 block">{missingCount}</span>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-center">
            <span className="text-[10px] font-bold text-orange-700 uppercase block">Damaged</span>
            <span className="text-xl font-bold text-orange-800 mt-1 block">{damagedCount}</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Tag, Location, Assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 font-bold uppercase hidden sm:inline"><SlidersHorizontal className="w-4 h-4 inline mr-1" /> Filter Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white text-slate-700 font-semibold"
          >
            <option value="">All Verification States</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Missing">Missing</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider">
                <th className="px-6 py-4">Asset Tag</th>
                <th className="px-6 py-4">Asset Name / Model</th>
                <th className="px-6 py-4">Expected Location</th>
                <th className="px-6 py-4">Expected Assignee</th>
                <th className="px-6 py-4">Status Check</th>
                <th className="px-6 py-4">Audit Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredChecklist.map((item) => (
                <tr key={item.assetTag} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.assetTag}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-700">{item.assetName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{item.category}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{item.location}</td>
                  <td className="px-6 py-4 text-slate-550">{item.expectedAssignee}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                      item.status === 'Verified' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : item.status === 'Missing' 
                          ? 'bg-red-100 text-red-800 border-red-200' 
                          : item.status === 'Damaged' 
                            ? 'bg-orange-100 text-orange-850 border-orange-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                    {item.notes && <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Remarks: {item.notes}</p>}
                  </td>
                  <td className="px-6 py-4 space-x-1.5">
                    {item.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(item.assetTag)}
                          className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Verify Presence
                        </button>
                        <button
                          onClick={() => handleDamagedClick(item)}
                          className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Flag Damaged
                        </button>
                        <button
                          onClick={() => handleMissing(item.assetTag)}
                          className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Flag Missing
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateAuditItemStatus(item.assetTag, 'Pending', '')}
                        className="flex items-center justify-center gap-1 text-[11px] text-blue-650 hover:underline font-semibold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Re-audit Item
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredChecklist.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 font-medium">No audit items match selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flag Damaged modal remark collector */}
      {activeItemForNotes && (
        <Modal
          isOpen={true}
          onClose={() => setActiveItemForNotes(null)}
          title={`Flag Damaged: ${activeItemForNotes.assetTag}`}
          size="md"
        >
          <form onSubmit={handleDamagedSubmit} className="space-y-4">
            <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-start gap-2 text-xs text-orange-850">
              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <p>Warning: Flagging this asset as Damaged will immediately update its core inventory condition rating to **Poor**.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-655 mb-1.5">Diagnostic notes *</label>
              <textarea
                required
                value={selectedItemNotes}
                onChange={(e) => setSelectedItemNotes(e.target.value)}
                rows="3"
                placeholder="Specify broken parts, cracks, keyboard malfunctions, screen issues..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveItemForNotes(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-sm cursor-pointer"
              >
                Flag Damaged Condition
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default Audit;
