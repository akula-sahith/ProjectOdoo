import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  TrendingUp,
  Wrench,
  Calendar,
  Building,
  ClipboardCheck,
  BarChart4,
  DollarSign,
  TrendingDown,
  PieChart as PieIcon,
  Layers,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import toast from 'react-hot-toast';

export const Reports = () => {
  const {
    assets,
    categories,
    departments,
    bookings,
    maintenanceTickets,
    auditItems,
    employees
  } = useApp();

  const [activeTab, setActiveTab] = useState('assets');

  const simulateExport = (format, reportName) => {
    toast.loading(`Compiling ${reportName} query...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Downloaded ${reportName}.${format === 'csv' ? 'csv' : 'xlsx'} successfully.`);
    }, 1000);
  };

  // 1. Calculations: Valuation & Depreciation over years
  const totalValuation = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
  
  // Linear depreciation estimate
  const currentDepreciatedValuation = assets.reduce((sum, a) => {
    const cat = categories.find(c => c.code === a.category);
    const lifetime = cat?.assetLifetime || 5;
    
    // Age calculation
    if (!a.purchaseDate) return sum + (a.purchaseCost || 0);
    const pDate = new Date(a.purchaseDate);
    const currentDate = new Date('2026-07-12');
    const ageInDays = Math.ceil(Math.abs(currentDate - pDate) / (1000 * 60 * 60 * 24));
    const age = ageInDays / 365;
    
    if (age >= lifetime) return sum;
    return sum + Math.round(a.purchaseCost * (1 - (age / lifetime)));
  }, 0);

  // Valuation Area Chart data
  const valuationTrendData = [
    { year: '2022', Valuation: totalValuation * 0.4 },
    { year: '2023', Valuation: totalValuation * 0.6 },
    { year: '2024', Valuation: totalValuation * 0.8 },
    { year: '2025', Valuation: totalValuation * 0.95 },
    { year: '2026 (Current)', Valuation: totalValuation },
    { year: '2026 (Depreciated)', Valuation: currentDepreciatedValuation }
  ];

  // Maintenance Category Counts
  const maintenanceCatData = categories.map(c => {
    const count = maintenanceTickets.filter(t => {
      const a = assets.find(as => as.tag === t.assetTag);
      return a && a.category === c.code;
    }).length;
    return { name: c.name, Tickets: count };
  });

  // Resource Booking metrics
  const resourceBookingMetrics = categories.filter(c => c.warrantyRequired).map(c => {
    const bkgs = bookings.filter(b => {
      const a = assets.find(as => as.tag === b.assetTag);
      return a && a.category === c.code;
    }).length;
    return { name: c.name, Volume: bkgs };
  });

  // Department Allocation analysis
  const deptSummaryData = departments.map(d => {
    const deptAssets = assets.filter(a => {
      if (!a.assignedTo) return false;
      const emp = employees.find(e => e.id === a.assignedTo);
      return emp?.department === d.code;
    });
    const cost = deptAssets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
    return { name: d.name, code: d.code, count: deptAssets.length, cost };
  });

  // Audit Discrepancies listing
  const verifiedCount = auditItems.filter(i => i.status === 'Verified').length;
  const missingCount = auditItems.filter(i => i.status === 'Missing').length;
  const damagedCount = auditItems.filter(i => i.status === 'Damaged').length;
  const totalAuditItems = auditItems.length;
  const auditProgress = totalAuditItems > 0 ? Math.round(((verifiedCount + missingCount + damagedCount) / totalAuditItems) * 100) : 0;

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Corporate Reports & Audits Ledger</h1>
          <p className="text-slate-500 text-sm mt-1">Review ledger spreadsheets, physical audit discrepancies, and department-wise cost indexes.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => simulateExport('csv', `${activeTab}_report`)}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => simulateExport('xlsx', `${activeTab}_report`)}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold tracking-tight shrink-0">
        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'assets' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5" /> Asset Valuation
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'maintenance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4.5 h-4.5" /> Repairs Costs
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" /> Bookings Summaries
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'departments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4.5 h-4.5" /> Dept Ledger
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`pb-3.5 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'audits' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardCheck className="w-4.5 h-4.5" /> Audit Cycles
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. ASSET VALUATION TAB */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[420px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Capital Valuation Asset Depreciation Chart</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={valuationTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} formatter={(value) => `$${value / 1000}k`} />
                  <Tooltip formatter={(value) => [`$${value?.toLocaleString()} USD`, 'Valuation']} />
                  <Area type="monotone" dataKey="Valuation" stroke="#2563EB" fillOpacity={0.06} fill="#2563EB" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Financial Ledger</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3 text-sm">
                <span className="text-slate-500 font-semibold">Total Purchase Cost:</span>
                <span className="font-extrabold text-slate-800 text-base">${totalValuation?.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between border-b pb-3 text-sm">
                <span className="text-slate-500 font-semibold">Residual Valuation:</span>
                <span className="font-extrabold text-emerald-700 text-base">${currentDepreciatedValuation?.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between border-b pb-3 text-sm">
                <span className="text-slate-500 font-semibold">Average Depreciation:</span>
                <span className="font-extrabold text-slate-800 text-base">
                  {Math.round(((totalValuation - currentDepreciatedValuation) / totalValuation) * 100)}%
                </span>
              </div>
            </div>
            <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start gap-2 leading-relaxed">
              <Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
              <span>Asset depreciations are calculated dynamically utilizing standard linear depreciation models matching asset lifetime configurations.</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. REPAIRS MAINTENANCE TAB */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[420px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Repairs Ticket Frequencies per Category</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceCatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="Tickets" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repairs Operations summary</h3>
            <div className="space-y-3.5 text-xs text-slate-655 font-semibold">
              <div className="flex justify-between border-b pb-2">
                <span>Active Tickets:</span>
                <span className="font-bold text-slate-800">{maintenanceTickets.filter(t => t.status !== 'Resolved').length}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Total Resolved:</span>
                <span className="font-bold text-slate-800">{maintenanceTickets.filter(t => t.status === 'Resolved').length}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Fault Rate Ratio:</span>
                <span className="font-bold text-red-655">
                  {Math.round((maintenanceTickets.length / assets.length) * 100)}% of assets
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOOKINGS SUMMARIES TAB */}
      {activeTab === 'bookings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[420px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Resource Booking Volume Analysis</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resourceBookingMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Volume" stroke="#7C3AED" fillOpacity={0.06} fill="#7C3AED" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Schedules metrics</h3>
            <div className="space-y-3.5 text-xs text-slate-655 font-semibold">
              <div className="flex justify-between border-b pb-2">
                <span>Active Reservations:</span>
                <span className="font-bold text-slate-800">{bookings.filter(b => b.status === 'Approved').length}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Pending Approvals:</span>
                <span className="font-bold text-slate-800">{bookings.filter(b => b.status === 'Pending').length}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Cancelled Bookings:</span>
                <span className="font-bold text-slate-800">{bookings.filter(b => b.status === 'Cancelled').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DEPT LEDGER TAB */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-800">Department Cost Allocation Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Allocated Equipment Count</th>
                  <th className="px-6 py-4">Total Inventory cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-655 font-semibold">
                {deptSummaryData.map((d, index) => (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-800 font-bold">{d.name}</td>
                    <td className="px-6 py-4 font-mono">{d.code}</td>
                    <td className="px-6 py-4">{d.count} Units</td>
                    <td className="px-6 py-4 text-emerald-700 font-bold">${d.cost?.toLocaleString()} USD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. AUDIT CYCLES TAB */}
      {activeTab === 'audits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Active Audit Cycle: H1 Annual IT Audit</h3>
                <p className="text-xs text-slate-500 mt-1">Auditor: Rahul (System Admin) | Department: All</p>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 font-bold rounded border border-green-150 text-xs">Active Cycle</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Cycle Completion</span>
                <span>{auditProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${auditProgress}%` }} />
              </div>
            </div>

            {/* Audit discrepancy list */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-slate-400" /> Discrepancies & Flagged Items
              </h4>

              <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden bg-slate-50/50">
                {auditItems.filter(i => i.status === 'Missing' || i.status === 'Damaged').map((item, idx) => (
                  <div key={idx} className="p-3.5 flex justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.assetName} ({item.assetTag})</p>
                      <p className="text-slate-500 mt-0.5">Location: {item.location} | Expected Assignee: {item.expectedAssignee}</p>
                      {item.notes && <p className="text-[10px] text-slate-400 mt-1">Audit log: "{item.notes}"</p>}
                    </div>
                    <span className={`px-2 py-0.5 rounded font-extrabold uppercase h-5 leading-relaxed text-[9px] ${
                      item.status === 'Missing' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit cycle metrics</h3>
            <div className="space-y-3.5 text-xs text-slate-655 font-semibold">
              <div className="flex justify-between border-b pb-2">
                <span>Total Scope Items:</span>
                <span className="font-bold text-slate-850">{totalAuditItems}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Verified Physically:</span>
                <span className="font-bold text-green-700">{verifiedCount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Confirmed Missing:</span>
                <span className="font-bold text-red-655">{missingCount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Reported Damaged:</span>
                <span className="font-bold text-orange-700">{damagedCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Reports;
