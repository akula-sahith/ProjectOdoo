import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Settings as SettingsIcon,
  Bell,
  Clock,
  History,
  Lock,
  Globe,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const {
    user,
    settings,
    updateProfile,
    history,
    departments
  } = useApp();

  const [formSettings, setFormSettings] = useState({
    currency: settings.currency || 'USD ($)',
    timezone: settings.timezone || 'UTC -05:00 (EST)',
    dateFormat: settings.dateFormat || 'YYYY-MM-DD',
    notificationsEmail: settings.notificationsEmail !== false,
    notificationsInApp: settings.notificationsInApp !== false,
    backupSchedule: settings.backupSchedule || 'Weekly'
  });

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  // Get user specific events in log
  const userActivities = history.filter(h => 
    h.user.toLowerCase() === user?.name?.toLowerCase() ||
    h.notes.toLowerCase().includes(user?.name?.toLowerCase())
  );

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateProfile(formSettings);
    toast.success('Local preferences successfully saved.');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      toast.error('All fields are required.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    toast.success('Simulation: Password updated successfully.');
    setPasswordForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings & Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Configure default ERP locales, review credentials, and inspect security logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: User Card & Activity Feed (Col Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* User Profile Card */}
          {user && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <img
                src={user.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                alt=""
                className="w-24 h-24 rounded-full object-cover border border-slate-200 shadow-xs mb-4"
              />
              <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-xs text-slate-450 font-semibold mt-0.5">{user.designation}</p>

              <div className="w-full border-t border-slate-100 mt-6 pt-5 space-y-3.5 text-left text-xs leading-4">
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-600">{user.email}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">{user.phone}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">
                    {departments.find(d => d.code === user.department)?.name || user.department} Department
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded border border-blue-150">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* User Activity feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col max-h-[360px] overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 shrink-0">
              <History className="w-4 h-4" /> Personal Action Log
            </h3>
            <div className="space-y-4 pl-3 border-l border-slate-200 relative text-xs">
              {userActivities.slice(0, 5).map((act, index) => (
                <div key={index} className="relative group">
                  <span className="absolute -left-[17px] top-[2.5px] w-2.5 h-2.5 rounded-full bg-blue-600 border border-white" />
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-slate-700">{act.title}</p>
                      <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">{act.notes}</p>
                      {act.tag && <span className="text-[10px] font-bold text-blue-650 font-mono mt-0.5 block">{act.tag}</span>}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">{act.date}</span>
                  </div>
                </div>
              ))}
              {userActivities.length === 0 && (
                <p className="text-slate-450 text-center py-4">No recent activities logged.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Preferences Form & Security (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Settings form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 tracking-tight mb-5 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-slate-450" /> System Preferences
            </h3>

            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Currency Format
                  </label>
                  <select
                    value={formSettings.currency}
                    onChange={(e) => setFormSettings({ ...formSettings, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white font-semibold text-slate-750"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Standard Timezone
                  </label>
                  <select
                    value={formSettings.timezone}
                    onChange={(e) => setFormSettings({ ...formSettings, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white font-semibold text-slate-755"
                  >
                    <option value="UTC -05:00 (EST)">UTC -05:00 (EST)</option>
                    <option value="UTC +00:00 (GMT)">UTC +00:00 (GMT)</option>
                    <option value="UTC +05:30 (IST)">UTC +05:30 (IST)</option>
                    <option value="UTC +08:00 (SGT)">UTC +08:00 (SGT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Date Syntax
                  </label>
                  <select
                    value={formSettings.dateFormat}
                    onChange={(e) => setFormSettings({ ...formSettings, dateFormat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white font-semibold text-slate-755"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-slate-400" /> Notifications Routing
                </label>
                
                <div className="flex items-center">
                  <input
                    id="emailNotif"
                    type="checkbox"
                    checked={formSettings.notificationsEmail}
                    onChange={(e) => setFormSettings({ ...formSettings, notificationsEmail: e.target.checked })}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <label htmlFor="emailNotif" className="ml-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                    Send reports and alerts to my corporate email address
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="appNotif"
                    type="checkbox"
                    checked={formSettings.notificationsInApp}
                    onChange={(e) => setFormSettings({ ...formSettings, notificationsInApp: e.target.checked })}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <label htmlFor="appNotif" className="ml-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                    Enable real-time push alerts inside the navbar drawer
                  </label>
                </div>
              </div>

              {/* System Backups */}
              <div className="border-t border-slate-100 pt-5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-400" /> Data Backups
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={formSettings.backupSchedule}
                    onChange={(e) => setFormSettings({ ...formSettings, backupSchedule: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white font-semibold text-slate-755 w-44"
                  >
                    <option value="Daily">Daily Scheduled</option>
                    <option value="Weekly">Weekly Scheduled</option>
                    <option value="Monthly">Monthly Scheduled</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => toast.success('Immediate database backup snapshot created successfully.')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    Backup Database Now
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer shadow-xs"
                >
                  Save System Preferences
                </button>
              </div>
            </form>
          </div>

          {/* Password credentials change form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 tracking-tight mb-5 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-450" /> Security & Passwords
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-655 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.next}
                    onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-sm cursor-pointer shadow-xs"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Profile;
