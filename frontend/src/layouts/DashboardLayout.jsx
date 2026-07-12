import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowLeftRight,
  Calendar,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings as SettingsIcon,
  Menu,
  X,
  Search,
  LogOut,
  ChevronDown,
  User,
  Users,
  Building,
  UserSquare2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
  const { user, switchUser, logout, notifications, markNotificationRead, employees } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = notifications.filter(n => !n.read);

  // Dynamic Sidebar Menu Items based on active role
  const getMenuItems = () => {
    if (!user) return [];
    
    const baseItems = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    if (user.role === 'Admin') {
      return [
        ...baseItems,
        { name: 'Organization Setup', path: '/organization-setup', icon: Building2 },
        { name: 'Assets Directory', path: '/assets', icon: Package },
        { name: 'Audit', path: '/audit', icon: ClipboardCheck },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications.length },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    if (user.role === 'Asset Manager') {
      return [
        ...baseItems,
        { name: 'Assets', path: '/assets', icon: Package },
        { name: 'Allocation & Transfer', path: '/allocation', icon: ArrowLeftRight },
        { name: 'Resource Booking', path: '/resource-booking', icon: Calendar },
        { name: 'Maintenance', path: '/maintenance', icon: Wrench },
        { name: 'Audit', path: '/audit', icon: ClipboardCheck },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications.length },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    if (user.role === 'Department Head') {
      return [
        ...baseItems,
        { name: 'Department Assets', path: '/assets', icon: Package },
        { name: 'Allocation Requests', path: '/allocation-requests', icon: ArrowLeftRight },
        { name: 'Resource Booking', path: '/resource-booking', icon: Calendar },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications.length },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    // Default Employee
    return [
      ...baseItems,
      { name: 'My Assets', path: '/assets', icon: Package },
      { name: 'Bookings', path: '/resource-booking', icon: Calendar },
      { name: 'Maintenance Requests', path: '/maintenance', icon: Wrench },
      { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications.length },
      { name: 'Profile', path: '/profile', icon: User },
    ];
  };

  const menuItems = getMenuItems();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/assets?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleRoleSwap = (userId) => {
    switchUser(userId);
    setRoleSwitcherOpen(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
          sidebarOpen ? 'w-[280px]' : 'w-[80px]'
        } sticky top-0 h-screen overflow-y-auto z-20`}
      >
        {/* Brand Logo Header */}
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
          {sidebarOpen ? (
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-blue-600">AssetFlow</span>
              <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Enterprise Asset ERP</span>
            </div>
          ) : (
            <span className="font-bold text-lg text-blue-600 mx-auto">AF</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-slate-100 text-slate-500 hidden md:block cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-semibold text-base leading-5 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {sidebarOpen && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {sidebarOpen && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Card */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-slate-150 shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <img
                src={user.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'}
                alt=""
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-sm text-slate-500 truncate">{user.designation}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[280px] max-w-sm bg-white h-full flex flex-col z-10 shadow-2xl"
            >
              <div className="h-[72px] flex items-center justify-between px-6 border-b border-slate-200">
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-blue-600">AssetFlow</span>
                  <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Enterprise Asset ERP</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-semibold text-base ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {user && (
                <div className="p-4 border-t border-slate-200 flex items-center gap-3">
                  <img
                    src={user.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'}
                    alt=""
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-sm text-slate-500 truncate">{user.designation}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10 shadow-xs">
          {/* Left Side: Mobile Menu Button & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-1 rounded hover:bg-slate-100 text-slate-500 md:hidden cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative w-72 md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Global Search tags, assets, serials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all bg-slate-50/50"
              />
            </form>
          </div>

          {/* Right Side: Demo switcher, notifications & profile */}
          <div className="flex items-center gap-4">
            {/* Dynamic Role Switcher (Hackathon Impress Button) */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-sm font-bold rounded-xl cursor-pointer transition-colors"
                title="Switch role for demo"
              >
                <UserSquare2 className="w-4 h-4" />
                <span className="hidden sm:inline">Swap Role</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {roleSwitcherOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setRoleSwitcherOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-150 overflow-hidden z-30"
                    >
                      <div className="p-3 border-b border-slate-100 bg-slate-50/55">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demo Swapping Engine</span>
                        <p className="text-sm text-slate-500 mt-0.5">Test individual role dashboards & security walls.</p>
                      </div>
                      <div className="py-1.5 divide-y divide-slate-50 max-h-80 overflow-y-auto">
                        {employees.map((emp) => (
                          <button
                            key={emp.id}
                            onClick={() => handleRoleSwap(emp.id)}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <img src={emp.photo} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-800 leading-3">{emp.name}</p>
                              <p className="text-xs text-slate-500 mt-1">{emp.designation}</p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 ${
                              emp.role === 'Admin' 
                                ? 'bg-red-50 text-red-700 border-red-150' 
                                : emp.role === 'Asset Manager' 
                                  ? 'bg-blue-50 text-blue-700 border-blue-150' 
                                  : emp.role === 'Department Head' 
                                    ? 'bg-purple-50 text-purple-700 border-purple-150' 
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {emp.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setNotifDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">Recent Alerts</span>
                        <Link
                          to="/notifications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs text-blue-600 font-medium hover:underline"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              navigate('/notifications');
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                              !n.read ? 'bg-blue-50/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-950">{n.title}</span>
                              {!n.read && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                          <div className="p-8 text-center text-xs text-slate-400">
                            No notifications to display
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <img
                    src={user.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'}
                    alt=""
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-slate-800 leading-3">{user.name}</p>
                    <p className="text-xs text-slate-450 mt-0.5 font-bold uppercase">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30"
                      >
                        <div className="p-4 border-b border-slate-150 bg-slate-50/50">
                          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            My Profile
                          </Link>
                          {user.role === 'Admin' && (
                            <Link
                              to="/settings"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <SettingsIcon className="w-4 h-4 text-slate-400" />
                              System Settings
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-655 hover:bg-rose-50 border-t border-slate-100 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Breadcrumbs tracker */}
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
