import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  History,
  Calendar,
  Wrench,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  FileSpreadsheet,
  ClipboardList,
  Clock,
  ArrowRightLeft,
  Users,
  Building2,
  ShieldCheck,
  Building,
  Settings as SettingsIcon,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const {
    user,
    assets,
    bookings,
    maintenanceTickets,
    history,
    departments,
    categories,
    employees,
    transferRequests,
    returnRequests,
    switchUser
  } = useApp();
  
  const navigate = useNavigate();

  // Dynamic calculations
  const totalAssets = assets.length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length;
  const lostCount = assets.filter(a => a.status === 'Lost').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'Approved').length;
  const pendingMaintenanceCount = maintenanceTickets.filter(m => m.status === 'Pending').length;
  const pendingTransfersCount = transferRequests.filter(t => t.status === 'Pending').length;

  const totalEmployees = employees.length;
  const totalDepts = departments.length;
  const orgUtilization = totalAssets > 0 ? Math.round((allocatedCount / totalAssets) * 100) : 0;
  const poorConditionCount = assets.filter(a => a.condition === 'Poor').length;

  // Chart Data Configurations
  // Chart 1: Department Assets (Dynamic)
  const deptAssetsData = departments.map(d => {
    const assignedCount = assets.filter(a => {
      if (!a.assignedTo) return false;
      const emp = employees.find(e => e.id === a.assignedTo);
      return emp?.department === d.code;
    }).length;
    return { name: d.code, Assets: assignedCount };
  });

  // Chart 2: Category Cost Breakdown
  const catColors = ['#2563EB', '#3B82F6', '#16A34A', '#F59E0B', '#DC2626', '#7C3AED', '#6B7280'];
  const categoryChartData = categories.map((c, idx) => {
    const cost = assets.filter(a => a.category === c.code).reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
    return { name: c.name, value: cost };
  });

  // Chart 3: Maintenance Trends
  const maintenanceTrendData = [
    { month: 'Jan', Tickets: 3 },
    { month: 'Feb', Tickets: 8 },
    { month: 'Mar', Tickets: 4 },
    { month: 'Apr', Tickets: 9 },
    { month: 'May', Tickets: 11 },
    { month: 'Jun', Tickets: maintenanceTickets.length }
  ];

  // Chart 4: Resource Booking Heatmap
  const bookingHeatmapData = [
    { time: '09:00', Bookings: 4 },
    { time: '11:00', Bookings: 9 },
    { time: '13:00', Bookings: 3 },
    { time: '15:00', Bookings: 8 },
    { time: '17:00', Bookings: 2 }
  ];

  // Filter local department assets for Department Head
  const localDeptCode = user ? user.department : 'ENG';
  const localDeptName = departments.find(d => d.code === localDeptCode)?.name || 'Engineering';
  const deptEmployeesList = employees.filter(e => e.department === localDeptCode).map(e => e.id);
  const deptAssets = assets.filter(a => a.assignedTo && deptEmployeesList.includes(a.assignedTo));
  const deptBookings = bookings.filter(b => b.employeeId && deptEmployeesList.includes(b.employeeId));
  const deptTickets = maintenanceTickets.filter(t => {
    const a = assets.find(as => as.tag === t.assetTag);
    return a && a.assignedTo && deptEmployeesList.includes(a.assignedTo);
  });

  // Filter employee personal assets
  const myAssets = assets.filter(a => a.assignedTo === user?.id);
  const myBookings = bookings.filter(b => b.employeeId === user?.id && b.status !== 'Cancelled');
  const myTickets = maintenanceTickets.filter(t => t.assetTag && assets.find(a => a.tag === t.assetTag)?.assignedTo === user?.id);

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      
      {/* Personalized Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Good Morning, {user.name}
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Role: <span className="font-bold text-blue-600">{user.role}</span> | Department: <span className="font-bold text-slate-800">{localDeptName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 p-3 rounded-xl">
          <span>📅 {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. ADMIN DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {user.role === 'Admin' && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Assets</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalAssets}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employees Enrolled</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalEmployees}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departments</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalDepts}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization Utilization</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">{orgUtilization}%</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Assets Near Retirement</span>
              <p className="text-2xl font-bold text-red-600 mt-1">{poorConditionCount}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Quick Setup Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button onClick={() => navigate('/organization-setup')} className="flex items-center justify-center gap-2 bg-blue-650 hover:bg-blue-750 text-white font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <Building2 className="w-4 h-4" /> Setup Department
              </button>
              <button onClick={() => navigate('/organization-setup')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <PlusCircle className="w-4 h-4 text-slate-400" /> Create Category
              </button>
              <button onClick={() => navigate('/organization-setup')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <Users className="w-4 h-4 text-slate-400" /> Add Employee
              </button>
              <button onClick={() => navigate('/settings')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <SettingsIcon className="w-4 h-4 text-slate-400" /> System Settings
              </button>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[340px] flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Department-wise Asset Distribution</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptAssetsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="Assets" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[340px] flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Category Financial Allocation</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={catColors[index % catColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`$${val?.toLocaleString()}`, 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ASSET MANAGER DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {user.role === 'Asset Manager' && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Assets</span>
                <p className="text-2xl font-bold text-green-700 mt-1">{availableCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocated Assets</span>
                <p className="text-2xl font-bold text-blue-700 mt-1">{allocatedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Package className="w-5 h-5" /></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Under Maintenance</span>
                <p className="text-2xl font-bold text-orange-700 mt-1">{maintenanceCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><Wrench className="w-5 h-5" /></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Transfer Requests</span>
                <p className="text-2xl font-bold text-purple-700 mt-1">{pendingTransfersCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><ArrowRightLeft className="w-5 h-5" /></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manager Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button onClick={() => navigate('/assets?openRegister=true')} className="flex items-center justify-center gap-2 bg-blue-650 hover:bg-blue-750 text-white font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <PlusCircle className="w-4 h-4" /> Register Asset
              </button>
              <button onClick={() => navigate('/allocation')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <ArrowRightLeft className="w-4 h-4 text-slate-400" /> Allocate / Transfer
              </button>
              <button onClick={() => navigate('/maintenance')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <Wrench className="w-4 h-4 text-slate-400" /> Raise Repairs Ticket
              </button>
              <button onClick={() => navigate('/reports')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <FileSpreadsheet className="w-4 h-4 text-slate-400" /> Export Reports
              </button>
            </div>
          </div>
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. DEPARTMENT HEAD DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {user.role === 'Department Head' && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Assets</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{deptAssets.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {transferRequests.filter(t => t.status === 'Pending' && t.requesterId !== user.id).length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Bookings</span>
              <p className="text-2xl font-bold text-purple-700 mt-1">{deptBookings.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Repairs Tickets</span>
              <p className="text-2xl font-bold text-orange-700 mt-1">{deptTickets.length}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => navigate('/allocation-requests')} className="flex items-center justify-center gap-2 bg-blue-650 hover:bg-blue-750 text-white font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <CheckCircle2 className="w-4 h-4" /> Review Transfer Requests
              </button>
              <button onClick={() => navigate('/resource-booking?openBook=true')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <Calendar className="w-4 h-4 text-slate-400" /> Book Shared Resource
              </button>
              <button onClick={() => navigate('/reports')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <FileSpreadsheet className="w-4 h-4 text-slate-400" /> Department Reports
              </button>
            </div>
          </div>
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. EMPLOYEE DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {user.role === 'Employee' && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Assigned Assets</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{myAssets.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Active Bookings</span>
              <p className="text-2xl font-bold text-purple-700 mt-1">{myBookings.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raised Repair Tickets</span>
              <p className="text-2xl font-bold text-orange-700 mt-1">{myTickets.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {transferRequests.filter(t => t.requesterId === user.id && t.status === 'Pending').length}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Self Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button onClick={() => navigate('/resource-booking?openBook=true')} className="flex items-center justify-center gap-2 bg-blue-650 hover:bg-blue-750 text-white font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <Calendar className="w-4 h-4" /> Book Room / Vehicle
              </button>
              <button onClick={() => navigate('/maintenance?openRequest=true')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <Wrench className="w-4 h-4 text-slate-400" /> Raise Maintenance Issue
              </button>
              <button onClick={() => navigate('/assets')} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3.5 px-4 rounded-xl cursor-pointer">
                <Package className="w-4 h-4 text-slate-400" /> View My Assets
              </button>
            </div>
          </div>
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* GENERAL SHARED FEED & DETAILS LISTS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Activities timeline */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-4 shrink-0 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-slate-450" /> System-Wide Activity Log
            </h3>
            <span className="text-xs text-slate-400 font-medium">Logged in real-time</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {history.slice(0, 8).map((h, idx) => (
              <div key={idx} className="flex gap-3 relative">
                {idx < history.slice(0, 8).length - 1 && (
                  <span className="absolute left-[15px] top-[26px] bottom-[-22px] w-[1px] bg-slate-100" />
                )}
                <div className="w-[30px] h-[30px] rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-150 text-xs">
                  {h.type === 'Registration' ? '🆕' : h.type === 'Allocation' ? '📥' : h.type === 'Maintenance' ? '🔧' : '🔄'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{h.title}</p>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">{h.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{h.notes}</p>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Authorised by: {h.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Scheduler mini widget */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-4 shrink-0 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-450" /> Resources Schedule
            </h3>
            <Link to="/resource-booking" className="text-xs text-blue-600 font-semibold hover:underline">
              View Calendar
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {bookings.slice(0, 4).map((b, idx) => (
              <div key={idx} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="truncate">{b.assetName}</span>
                  <span className="text-blue-600 text-[10px] shrink-0">
                    {b.startTime.split('T')[1]} - {b.endTime.split('T')[1]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">Purpose: {b.purpose}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100/50 mt-1">
                  <span>Reserved: {b.employeeName}</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[8px] ${
                    b.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-slate-400 text-center py-12 text-xs">No active resource reservations logged.</p>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};
export default Dashboard;
