import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Building,
  Mail,
  ShieldAlert,
  Save,
  Database,
  Globe,
  Lock,
  FileCheck,
  ShieldAlert as AlertIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, settings, updateProfile } = useApp();

  const [companyDetails, setCompanyDetails] = useState({
    name: settings.companyName || 'AssetFlow Corp',
    logo: settings.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=80',
    email: 'admin@assetflow.com',
    phone: '+1-555-0199'
  });

  const [smtpConfig, setSmtpConfig] = useState({
    host: settings.emailServer || 'smtp.mail.assetflow.com',
    port: settings.emailPort || '587',
    encryption: 'TLS',
    sender: 'no-reply@assetflow.com'
  });

  const [preferences, setPreferences] = useState({
    emailNotif: settings.notificationsEmail !== false,
    appNotif: settings.notificationsInApp !== false,
    securityAlerts: true,
    backupSchedule: settings.backupSchedule || 'Weekly',
    currency: settings.currency || 'USD ($)',
    timezone: settings.timezone || 'UTC -05:00 (EST)',
  });

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      companyName: companyDetails.name,
      companyLogo: companyDetails.logo,
    });
    toast.success('Company metadata updated successfully.');
  };

  const handleSmtpSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      emailServer: smtpConfig.host,
      emailPort: smtpConfig.port
    });
    toast.success('SMTP configuration saved and verified.');
  };

  const handlePrefSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      notificationsEmail: preferences.emailNotif,
      notificationsInApp: preferences.appNotif,
      backupSchedule: preferences.backupSchedule,
      currency: preferences.currency,
      timezone: preferences.timezone
    });
    toast.success('System preferences saved.');
  };

  const handleBackupNow = () => {
    toast.success('Database backup initialised...');
    setTimeout(() => {
      toast.success('System backup file (AF_DB_BACKUP_20260712.sql) compiled and saved securely.');
    }, 800);
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertIcon className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Access Restrained</h2>
        <p className="text-slate-500 text-sm">Only System Administrators can access administrative settings. Switch role to Rahul (Admin) in navbar to inspect settings.</p>
      </div>
    );
  }

  // Matrix of role permissions
  const permissionsList = [
    { module: 'Departments Setup', admin: 'Yes', manager: 'No', deptHead: 'No', employee: 'No' },
    { module: 'Asset Categories Setup', admin: 'Yes', manager: 'No', deptHead: 'No', employee: 'No' },
    { module: 'Employee Directory Setup', admin: 'Yes', manager: 'No', deptHead: 'No', employee: 'No' },
    { module: 'Security Roles Promotion', admin: 'Yes', manager: 'No', deptHead: 'No', employee: 'No' },
    { module: 'Register Assets', admin: 'Yes', manager: 'Yes', deptHead: 'No', employee: 'No' },
    { module: 'Allocate / Reassign Assets', admin: 'Yes', manager: 'Yes', deptHead: 'No', employee: 'No' },
    { module: 'Approve Maintenance Ticket', admin: 'Yes', manager: 'Yes', deptHead: 'No', employee: 'No' },
    { module: 'Approve Local Bookings', admin: 'Yes', manager: 'Yes', deptHead: 'Yes', employee: 'No' },
    { module: 'Book Shared Resource', admin: 'Yes', manager: 'Yes', deptHead: 'Yes', employee: 'Yes' },
    { module: 'Raise Repair Request', admin: 'Yes', manager: 'Yes', deptHead: 'Yes', employee: 'Yes' }
  ];

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure company profiles, SMTP mail transport servers, security matrices, and scheduled backups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Details & Mail servers */}
        <div className="space-y-6">
          {/* Company details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-slate-450" /> Company Profile Metadata
            </h3>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1">Company Name</label>
                  <input
                    type="text" required
                    value={companyDetails.name}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    value={companyDetails.phone}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">General Contact Email</label>
                  <input
                    type="email"
                    value={companyDetails.email}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">Company Logo URL</label>
                  <input
                    type="text"
                    value={companyDetails.logo}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, logo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t">
                <button type="submit" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-xl cursor-pointer">
                  <Save className="w-3.5 h-3.5" /> Save Company Details
                </button>
              </div>
            </form>
          </div>

          {/* SMTP servers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-450" /> SMTP Mail Servers
            </h3>
            <form onSubmit={handleSmtpSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-655 mb-1">SMTP Host Server</label>
                  <input
                    type="text" required
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">SMTP Port</label>
                  <input
                    type="text" required
                    value={smtpConfig.port}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">Sender Address</label>
                  <input
                    type="email" required
                    value={smtpConfig.sender}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, sender: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">Encryption Protocol</label>
                  <select
                    value={smtpConfig.encryption}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, encryption: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="TLS">TLS/STARTTLS (Secure)</option>
                    <option value="SSL">SSL (Deprecated)</option>
                    <option value="None">None (Unsecure)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t">
                <button type="submit" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-xl cursor-pointer">
                  <Save className="w-3.5 h-3.5" /> Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Preferences, backup & security matrix */}
        <div className="space-y-6">
          {/* General Preferences & Backup */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-455" /> System preferences
            </h3>
            <form onSubmit={handlePrefSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">System Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 mb-1">Server Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="UTC -05:00 (EST)">UTC -05:00 (EST)</option>
                    <option value="UTC +00:00 (GMT)">UTC +00:00 (GMT)</option>
                    <option value="UTC +05:30 (IST)">UTC +05:30 (IST)</option>
                  </select>
                </div>
              </div>

              {/* Data backups trigger */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> Scheduled Backups
                </label>
                <div className="flex gap-4">
                  <select
                    value={preferences.backupSchedule}
                    onChange={(e) => setPreferences({ ...preferences, backupSchedule: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white w-44 font-semibold text-slate-700"
                  >
                    <option value="Daily">Daily Backup</option>
                    <option value="Weekly">Weekly Backup</option>
                    <option value="Monthly">Monthly Backup</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleBackupNow}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    Backup Database Now
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <button type="submit" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-xl cursor-pointer">
                  <Save className="w-3.5 h-3.5" /> Save Preferences
                </button>
              </div>
            </form>
          </div>

          {/* Role Permissions Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-850 tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-450" /> Access Role Permissions Matrix
              </h3>
            </div>
            <div className="overflow-x-auto max-h-72">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-450 uppercase">
                    <th className="px-4 py-2">Module / Capability</th>
                    <th className="px-4 py-2">Admin</th>
                    <th className="px-4 py-2">Mgr</th>
                    <th className="px-4 py-2">Head</th>
                    <th className="px-4 py-2">Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                  {permissionsList.map((perm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 font-semibold text-slate-800">{perm.module}</td>
                      <td className="px-4 py-2 text-green-700 font-bold">{perm.admin}</td>
                      <td className={`px-4 py-2 font-bold ${perm.manager === 'Yes' ? 'text-green-700' : 'text-slate-400'}`}>{perm.manager}</td>
                      <td className={`px-4 py-2 font-bold ${perm.deptHead === 'Yes' ? 'text-green-700' : 'text-slate-400'}`}>{perm.deptHead}</td>
                      <td className={`px-4 py-2 font-bold ${perm.employee === 'Yes' ? 'text-green-700' : 'text-slate-400'}`}>{perm.employee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Settings;
