import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge, ConditionBadge } from '../components/Badges';
import {
  UserCheck,
  ArrowRightLeft,
  ArrowDownLeft,
  Search,
  Package,
  Calendar,
  MapPin,
  Clipboard,
  History,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Allocation = () => {
  const {
    assets,
    employees,
    departments,
    history,
    allocateAsset,
    transferAsset,
    returnAsset
  } = useApp();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected Asset state
  const [selectedAssetTag, setSelectedAssetTag] = useState(searchParams.get('tag') || '');
  const [activeFormTab, setActiveFormTab] = useState(searchParams.get('action') || 'allocate');

  // Select asset details
  const currentAsset = assets.find(a => a.tag === selectedAssetTag);
  const assetHistory = history.filter(h => h.tag === selectedAssetTag);
  const assignedEmployee = currentAsset ? employees.find(e => e.id === currentAsset.assignedTo) : null;

  // Form states
  // 1. Allocate
  const [allocateForm, setAllocateForm] = useState({ employeeId: '', location: '', notes: '', expectedReturn: '' });
  // 2. Transfer
  const [transferForm, setTransferForm] = useState({ newEmployeeId: '', newLocation: '', notes: '' });
  // 3. Return
  const [returnForm, setReturnForm] = useState({ condition: 'Good', notes: '' });

  // Sync tab options based on asset status if changed manually
  useEffect(() => {
    if (currentAsset) {
      if (currentAsset.status === 'Allocated') {
        setActiveFormTab(prev => prev === 'allocate' ? 'transfer' : prev);
      } else if (currentAsset.status === 'Available') {
        setActiveFormTab(prev => prev !== 'allocate' ? 'allocate' : prev);
      }
    }
  }, [selectedAssetTag, currentAsset]);

  // Validation messages helper
  const getValidationWarning = () => {
    if (!currentAsset) return null;
    
    if (activeFormTab === 'allocate') {
      if (currentAsset.status === 'Allocated') {
        return { type: 'error', text: 'This asset is currently Allocated. Use the Transfer tab to reassign or Return tab to check it back in.' };
      }
      if (currentAsset.status === 'Maintenance') {
        return { type: 'error', text: 'Asset is currently undergoing Maintenance. Resolving the maintenance ticket will make it Available.' };
      }
      if (currentAsset.status === 'Lost') {
        return { type: 'error', text: 'This asset is flagged as Lost. Verify it physically during an Audit before allocation.' };
      }
      if (currentAsset.status === 'Disposed') {
        return { type: 'error', text: 'This asset has been Disposed. No further allocations permitted.' };
      }
    }

    if (activeFormTab === 'transfer') {
      if (currentAsset.status !== 'Allocated') {
        return { type: 'error', text: 'Only Allocated assets can be transferred. Allocate this asset first.' };
      }
    }

    if (activeFormTab === 'return') {
      if (currentAsset.status === 'Available') {
        return { type: 'warning', text: 'This asset is already marked as Available in inventory.' };
      }
      if (currentAsset.status === 'Disposed') {
        return { type: 'error', text: 'Asset has already been retired and disposed.' };
      }
    }

    return null;
  };

  const warning = getValidationWarning();

  // Submission actions
  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (warning?.type === 'error') {
      toast.error('Cannot proceed. Fix validation issues first.');
      return;
    }
    if (!allocateForm.employeeId) {
      toast.error('Select an Employee.');
      return;
    }

    const res = allocateAsset(selectedAssetTag, allocateForm.employeeId, allocateForm.location, allocateForm.notes);
    if (res.success) {
      toast.success('Asset successfully allocated.');
      setAllocateForm({ employeeId: '', location: '', notes: '', expectedReturn: '' });
    } else {
      toast.error(res.message);
    }
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (warning?.type === 'error') {
      toast.error('Cannot proceed. Fix validation issues first.');
      return;
    }
    if (!transferForm.newEmployeeId) {
      toast.error('Select the target Employee.');
      return;
    }

    const res = transferAsset(selectedAssetTag, transferForm.newEmployeeId, transferForm.newLocation, transferForm.notes);
    if (res.success) {
      toast.success('Asset ownership transferred successfully.');
      setTransferForm({ newEmployeeId: '', newLocation: '', notes: '' });
    } else {
      toast.error(res.message);
    }
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (warning?.type === 'error') {
      toast.error('Cannot proceed. Fix validation issues first.');
      return;
    }

    const res = returnAsset(selectedAssetTag, returnForm.condition, returnForm.notes);
    if (res.success) {
      toast.success('Asset successfully checked back into inventory.');
      setReturnForm({ condition: 'Good', notes: '' });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Allocation & Transfers</h1>
        <p className="text-slate-500 text-sm mt-1">Assign equipment to staff members, handle inter-departmental transfers, or log return returns.</p>
      </div>

      {/* Split Pane Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Asset Selector & Metadata Card (Col Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Asset Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Inventory Asset</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedAssetTag}
                onChange={(e) => setSelectedAssetTag(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 bg-white font-semibold text-slate-700"
              >
                <option value="">-- Choose Asset Tag / Name --</option>
                {assets.map(a => (
                  <option key={a.tag} value={a.tag}>
                    {a.tag} - {a.name} ({a.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Asset Information Display */}
          {currentAsset ? (
            <>
              {/* Asset Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={currentAsset.image}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=60';
                    }}
                  />
                  <div className="min-w-0">
                    <Link to={`/assets/${currentAsset.tag}`} className="font-bold text-slate-800 hover:text-blue-600 hover:underline block truncate">
                      {currentAsset.name}
                    </Link>
                    <p className="text-xs text-slate-450 mt-0.5 font-semibold font-mono">Tag: {currentAsset.tag}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Status</span>
                    <div className="mt-1"><StatusBadge status={currentAsset.status} /></div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Condition</span>
                    <div className="mt-1"><ConditionBadge condition={currentAsset.condition} /></div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Current Location</span>
                    <span className="font-bold text-slate-700 block mt-1">{currentAsset.location || 'HQ Storage'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Hold Assigned</span>
                    <span className="font-bold text-slate-700 block mt-1">
                      {assignedEmployee ? assignedEmployee.name : 'Shared Pool'}
                    </span>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-h-[350px] overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4" /> Allocation Logs ({selectedAssetTag})
                </h3>
                <div className="space-y-4 pl-3 border-l border-slate-200 relative text-xs">
                  {assetHistory.map((h, idx) => (
                    <div key={idx} className="relative group">
                      <span className="absolute -left-[17px] top-[2px] w-2 h-2 rounded-full bg-slate-350 border border-white" />
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-semibold text-slate-700">{h.title}</p>
                          <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">{h.notes}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">User: {h.user}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-bold">{h.date}</span>
                      </div>
                    </div>
                  ))}
                  {assetHistory.length === 0 && (
                    <p className="text-slate-400 text-center py-4">No allocations logged.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-100 border border-dashed border-slate-300 p-8 rounded-2xl text-center text-slate-500">
              <Package className="w-10 h-10 text-slate-350 mx-auto mb-2" />
              <p className="text-sm font-semibold">Select an asset from the list above to proceed with allocation/transfer.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Transaction Forms & Validation Pane (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Tabs header */}
            <div className="flex border-b border-slate-150 bg-slate-50/50 p-2 shrink-0">
              <button
                onClick={() => setActiveFormTab('allocate')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeFormTab === 'allocate' 
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-4.5 h-4.5" /> Allocate
              </button>
              <button
                onClick={() => setActiveFormTab('transfer')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeFormTab === 'transfer' 
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ArrowRightLeft className="w-4.5 h-4.5" /> Transfer
              </button>
              <button
                onClick={() => setActiveFormTab('return')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeFormTab === 'return' 
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ArrowDownLeft className="w-4.5 h-4.5" /> Return
              </button>
            </div>

            {/* Validation Panel */}
            {warning && (
              <div className={`px-6 py-3.5 border-b flex items-start gap-3 text-xs leading-4 ${
                warning.type === 'error' 
                  ? 'bg-red-50 border-red-100 text-red-800' 
                  : 'bg-amber-50 border-amber-100 text-amber-800'
              }`}>
                {warning.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold">{warning.type === 'error' ? 'Allocation Intercepted' : 'Attention Required'}</p>
                  <p className="mt-0.5">{warning.text}</p>
                </div>
              </div>
            )}

            {/* Form containers */}
            <div className="p-6">
              {!currentAsset ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Info className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">Select an asset from the left panel to display transaction actions.</p>
                </div>
              ) : (
                <>
                  {activeFormTab === 'allocate' && (
                    <form onSubmit={handleAllocateSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Allocate To Employee *</label>
                          <select
                            required
                            disabled={warning?.type === 'error'}
                            value={allocateForm.employeeId}
                            onChange={(e) => setAllocateForm({ ...allocateForm, employeeId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="">Select Employee</option>
                            {employees.map(e => (
                              <option key={e.id} value={e.id}>{e.name} ({e.id} - {e.designation})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Return Date</label>
                          <input
                            type="date"
                            disabled={warning?.type === 'error'}
                            value={allocateForm.expectedReturn}
                            onChange={(e) => setAllocateForm({ ...allocateForm, expectedReturn: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:bg-slate-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Assignment Location</label>
                        <input
                          type="text"
                          disabled={warning?.type === 'error'}
                          value={allocateForm.location}
                          onChange={(e) => setAllocateForm({ ...allocateForm, location: e.target.value })}
                          placeholder="e.g. HQ-Floor 3-Rm 302"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Notes</label>
                        <textarea
                          disabled={warning?.type === 'error'}
                          value={allocateForm.notes}
                          onChange={(e) => setAllocateForm({ ...allocateForm, notes: e.target.value })}
                          rows="3"
                          placeholder="State conditions, peripherals issued (chargers, adapters), or delivery status..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={warning?.type === 'error'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer disabled:opacity-50"
                      >
                        Commit Allocation
                      </button>
                    </form>
                  )}

                  {activeFormTab === 'transfer' && (
                    <form onSubmit={handleTransferSubmit} className="space-y-4">
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs text-slate-655 space-y-1">
                        <p className="font-bold text-slate-755 mb-1.5 uppercase">Current Allocation</p>
                        <p>Assigned Employee: <span className="font-bold text-slate-800">{assignedEmployee?.name || 'Unassigned'}</span></p>
                        <p>Current Location: <span className="font-bold text-slate-800">{currentAsset.location || 'HQ Storage'}</span></p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Transfer To Employee *</label>
                          <select
                            required
                            disabled={warning?.type === 'error'}
                            value={transferForm.newEmployeeId}
                            onChange={(e) => setTransferForm({ ...transferForm, newEmployeeId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="">Select Target Employee</option>
                            {employees.filter(e => e.id !== currentAsset.assignedTo).map(e => (
                              <option key={e.id} value={e.id}>{e.name} ({e.id} - {e.designation})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">New Target Location</label>
                          <input
                            type="text"
                            disabled={warning?.type === 'error'}
                            value={transferForm.newLocation}
                            onChange={(e) => setTransferForm({ ...transferForm, newLocation: e.target.value })}
                            placeholder="e.g. Offsite Clinic"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:bg-slate-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Transfer Rationale / Notes</label>
                        <textarea
                          disabled={warning?.type === 'error'}
                          value={transferForm.notes}
                          onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                          rows="3"
                          placeholder="Log transfer details or specific authorization reference..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={warning?.type === 'error'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer disabled:opacity-50"
                      >
                        Authorize & Transfer Asset
                      </button>
                    </form>
                  )}

                  {activeFormTab === 'return' && (
                    <form onSubmit={handleReturnSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Return Condition *</label>
                          <select
                            value={returnForm.condition}
                            disabled={warning?.type === 'error'}
                            onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white disabled:bg-slate-50"
                          >
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Return Checklist / Diagnostics</label>
                        <textarea
                          disabled={warning?.type === 'error'}
                          value={returnForm.notes}
                          onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                          rows="3"
                          placeholder="Log defects, hardware wear and tear, or peripheral checks (e.g., returned charger)..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 disabled:bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={warning?.type === 'error'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer disabled:opacity-50"
                      >
                        Confirm Pool Return
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
export default Allocation;
