import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge, ConditionBadge } from '../components/Badges';
import {
  ArrowLeft,
  Calendar,
  Wrench,
  ArrowRightLeft,
  Download,
  FileText,
  History,
  Info,
  MapPin,
  Tag,
  ShieldCheck,
  Building2,
  DollarSign,
  Plus,
  Percent,
  Activity,
  CalendarCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AssetDetails = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { assets, employees, categories, history, departments, user } = useApp();

  const asset = assets.find(a => a.tag === tag);
  const assetHistory = history.filter(h => h.tag === tag);

  // Fallback documents state
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Purchase_Invoice.pdf', size: '342 KB', date: '2025-03-10' },
    { id: 2, name: 'Warranty_Agreement.pdf', size: '1.2 MB', date: '2025-03-10' },
    { id: 3, name: 'User_Quickstart_Guide.pdf', size: '2.5 MB', date: '2025-03-12' },
  ]);

  if (!asset) {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Asset Record Not Found</h2>
        <p className="text-slate-500 text-sm">The asset tag <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">{tag}</code> does not match any items in the active ERP inventory database.</p>
        <Link
          to="/assets"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  const assignedEmployee = employees.find(e => e.id === asset.assignedTo);
  const categoryObj = categories.find(c => c.code === asset.category);

  // 1. Calculations: Dynamic Depreciation & Warranty Remaining
  const getAssetAgeInYears = () => {
    if (!asset.purchaseDate) return 0;
    const pDate = new Date(asset.purchaseDate);
    const currentDate = new Date('2026-07-12'); // Local current time as mock baseline
    const diffTime = Math.abs(currentDate - pDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return parseFloat((diffDays / 365).toFixed(2));
  };

  const calculateDepreciatedValue = () => {
    const age = getAssetAgeInYears();
    const lifetime = categoryObj?.assetLifetime || 5;
    const cost = asset.purchaseCost || 0;
    if (age >= lifetime) return 0;
    const residualVal = cost * (1 - (age / lifetime));
    return Math.round(residualVal);
  };

  const getWarrantyRemainingLabel = () => {
    if (!asset.warrantyEnd) return 'Expired / N/A';
    const wEnd = new Date(asset.warrantyEnd);
    const currentDate = new Date('2026-07-12');
    if (wEnd < currentDate) return 'Expired';
    
    const diffTime = Math.abs(wEnd - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    return `${months} Months remaining`;
  };

  const age = getAssetAgeInYears();
  const currentResidualValue = calculateDepreciatedValue();
  const warrantyRemaining = getWarrantyRemainingLabel();

  // 2. Stepper States Definition
  const lifecycleStates = [
    { label: 'Available', desc: 'Ready for use' },
    { label: 'Allocated', desc: 'Assigned to personnel' },
    { label: 'Reserved', desc: 'Booked' },
    { label: 'Maintenance', desc: 'Under active repair' },
    { label: 'Lost', desc: 'Missing' },
    { label: 'Disposed', desc: 'Retired/Scrapped' }
  ];

  const getActiveStepperIndex = () => {
    const status = asset.status;
    return lifecycleStates.findIndex(s => s.label.toLowerCase() === status.toLowerCase());
  };

  const activeStepIdx = getActiveStepperIndex();

  const handleActionClick = (type) => {
    if (type === 'allocate' || type === 'transfer' || type === 'return') {
      navigate(`/allocation?tag=${asset.tag}&action=${type}`);
    } else if (type === 'maintenance') {
      navigate(`/maintenance?openRequest=true&tag=${asset.tag}`);
    }
  };

  const handleDocumentUpload = () => {
    toast.success('Simulation: File uploaded successfully.');
    const newDoc = {
      id: documents.length + 1,
      name: 'Diagnostics_Report.pdf',
      size: '185 KB',
      date: new Date().toISOString().split('T')[0]
    };
    setDocuments([...documents, newDoc]);
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 shrink-0">
        <Link
          to="/assets"
          className="p-2 border border-slate-200 hover:bg-slate-100 bg-white text-slate-655 hover:text-slate-850 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{asset.name}</h1>
            <StatusBadge status={asset.status} />
          </div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Asset Tag: <span className="text-slate-800 font-bold font-mono">{asset.tag}</span></p>
        </div>
      </div>

      {/* Visual Stepper Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Asset Lifecycle Tracker</h3>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-2">
          {/* Horizontal line for stepper on larger screens */}
          <span className="hidden md:block absolute left-[5%] right-[5%] top-[14px] h-0.5 bg-slate-150 z-0" />
          
          {lifecycleStates.map((step, idx) => {
            const isCompleted = idx < activeStepIdx;
            const isActive = idx === activeStepIdx;

            return (
              <div key={idx} className="flex flex-col items-center text-center z-10 w-40 relative">
                <div
                  className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : isCompleted
                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`text-xs font-bold mt-2.5 ${isActive ? 'text-blue-600' : 'text-slate-800'}`}>{step.label}</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5 leading-relaxed">{step.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details layout grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: Stats & details (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Statistics summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Depreciated Value</span>
              <p className="text-xl font-bold text-slate-800 mt-1">${currentResidualValue?.toLocaleString()} USD</p>
              <span className="text-[9px] text-slate-400 font-medium">Original cost: ${asset.purchaseCost}</span>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Total Allocations</span>
              <p className="text-xl font-bold text-slate-800 mt-1">{asset.allocationCount || 0} Times</p>
              <span className="text-[9px] text-slate-400 font-medium">Assigned logs</span>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Repairs Count</span>
              <p className="text-xl font-bold text-slate-850 mt-1">{asset.maintenanceCount || 0} Tickets</p>
              <span className="text-[9px] text-slate-400 font-medium">Total tickets resolved</span>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Warranty Remaining</span>
              <p className="text-xl font-bold text-slate-800 mt-1 truncate">{warrantyRemaining}</p>
              <span className="text-[9px] text-slate-400 font-medium">Contract status</span>
            </div>
          </div>

          {/* Profile metadata */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Equipment Profile Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Brand</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{asset.brand || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Model No</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{asset.model || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Serial Number (S/N)</span>
                  <span className="font-mono text-slate-700 mt-0.5 block">{asset.serial || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Category</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{categoryObj?.name || asset.category}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Default Location</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" /> {asset.location}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Acquisition Cost</span>
                  <span className="font-semibold text-slate-750 mt-0.5 block flex items-center text-emerald-700">
                    <DollarSign className="w-3.5 h-3.5 shrink-0" /> {asset.purchaseCost?.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Acquisition & Warranties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Acquisition Date</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{asset.purchaseDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Warranty Start Date</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{asset.warrantyStart || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Warranty Expiration</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{asset.warrantyEnd || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Holder information */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Active Custody Information</h3>
              {assignedEmployee ? (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={assignedEmployee.photo} alt="" className="w-11 h-11 rounded-full object-cover border" />
                    <div>
                      <p className="font-bold text-slate-800">{assignedEmployee.name}</p>
                      <p className="text-slate-500 mt-0.5">{assignedEmployee.designation}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dept: {departments.find(d => d.code === assignedEmployee.department)?.name}</p>
                    </div>
                  </div>
                  <div className="text-right text-slate-500 font-medium">
                    <p>Phone: {assignedEmployee.phone}</p>
                    <p className="font-mono mt-0.5">{assignedEmployee.email}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-blue-800">
                    <p className="font-bold">Available Shared Resource</p>
                    <p className="mt-0.5">This asset is not assigned to a dedicated person. Employees can book it for meeting rooms or operations under **Resource Booking**.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline events */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-450" /> Lifecycle Events Timeline
            </h3>

            <div className="space-y-6 pl-4 border-l border-slate-200 relative text-xs">
              {assetHistory.map((h, idx) => (
                <div key={idx} className="relative group">
                  <span className={`absolute -left-[21px] top-[2.5px] w-3 h-3 rounded-full border-2 border-white z-10 ${
                    h.type === 'Registration' ? 'bg-blue-600' : h.type === 'Allocation' ? 'bg-green-600' : 'bg-orange-500'
                  }`} />
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-semibold text-slate-700">{h.title}</p>
                      <p className="text-slate-500 mt-0.5 leading-relaxed">{h.notes}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Authorised by: {h.user}</p>
                    </div>
                    <span className="text-[10px] text-slate-450 font-bold shrink-0">{h.date}</span>
                  </div>
                </div>
              ))}
              {assetHistory.length === 0 && (
                <p className="text-slate-400 text-center py-4">No events logged for this asset tag.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right pane: Image & secondary actions (col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
            <img src={asset.image} alt="" className="w-full h-44 object-cover rounded-xl border" />
            
            <div className="w-full mt-4 text-xs font-semibold space-y-3.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Condition Rating:</span>
                <ConditionBadge condition={asset.condition} />
              </div>
              <div className="flex justify-between border-t border-slate-50 pt-2.5">
                <span className="text-slate-500">Shared Resource:</span>
                <span className="font-bold text-slate-700">{asset.shared ? 'Yes (Bookable)' : 'No'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-50 pt-2.5">
                <span className="text-slate-500">Last Audited:</span>
                <span className="font-bold text-slate-700">{asset.lastAudit || '2026-06-15'}</span>
              </div>
            </div>
          </div>

          {/* Quick Lifecycle actions hidden for Employees */}
          {user.role !== 'Employee' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Lifecycle Actions</h3>
              {asset.status === 'Available' && (
                <button
                  onClick={() => handleActionClick('allocate')}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Allocate Asset
                </button>
              )}
              {asset.status === 'Allocated' && (
                <>
                  <button
                    onClick={() => handleActionClick('transfer')}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Transfer Custody
                  </button>
                  <button
                    onClick={() => handleActionClick('return')}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Return to Pool
                  </button>
                </>
              )}
              <button
                onClick={() => handleActionClick('maintenance')}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Raise Repair Ticket
              </button>
            </div>
          )}

          {/* Documents attachments */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contractual Documents</h3>
              <button
                onClick={handleDocumentUpload}
                className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-blue-650 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Upload File
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {documents.map(doc => (
                <div key={doc.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-semibold text-slate-700 truncate">{doc.name}</span>
                  </div>
                  <button
                    onClick={() => toast.success(`Downloading ${doc.name}...`)}
                    className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssetDetails;
