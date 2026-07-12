import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle,
  Wrench,
  Calendar,
  ArrowRightLeft,
  ShieldCheck,
  CheckCheck,
  Trash2,
  Inbox
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Notifications = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();

  const [activeNotifTab, setActiveNotifTab] = useState('All');

  // Tabs count configurations
  const getTabCount = (type) => {
    if (type === 'All') return notifications.length;
    return notifications.filter(n => n.type === type).length;
  };

  const getUnreadTabCount = (type) => {
    if (type === 'All') return notifications.filter(n => !n.read).length;
    return notifications.filter(n => n.type === type && !n.read).length;
  };

  // Filtered Notifications list
  const filteredNotifications = notifications.filter(n => {
    if (activeNotifTab === 'All') return true;
    return n.type === activeNotifTab;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Transfers':
        return <ArrowRightLeft className="w-5 h-5 text-blue-600" />;
      case 'Maintenance':
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'Bookings':
        return <Calendar className="w-5 h-5 text-purple-650" />;
      case 'Approvals':
        return <ShieldCheck className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success('All notifications marked as read.');
  };

  const formatTimestamp = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" /> Notification Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Audit warnings, booking confirmations, maintenance notifications, and transfer requests.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Tabs Layout */}
      <div className="flex bg-white border border-slate-200 p-2 rounded-2xl shadow-xs overflow-x-auto">
        {['All', 'Approvals', 'Maintenance', 'Bookings', 'Transfers'].map((tab) => {
          const totalInTab = getTabCount(tab);
          const unreadInTab = getUnreadTabCount(tab);
          const isSelected = activeNotifTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveNotifTab(tab)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{tab === 'All' ? 'All Alerts' : tab}</span>
              {totalInTab > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                  isSelected 
                    ? 'bg-white text-blue-600' 
                    : unreadInTab > 0 
                      ? 'bg-red-500 text-white' 
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  {totalInTab}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification Listings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markNotificationRead(notif.id)}
            className={`p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer ${
              !notif.read ? 'bg-blue-50/10' : ''
            }`}
          >
            {/* Left Type Icon */}
            <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl shrink-0">
              {getNotificationIcon(notif.type)}
            </div>

            {/* Middle Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <p className="font-bold text-slate-800 text-sm">{notif.title}</p>
                <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                  {notif.type}
                </span>
              </div>
              <p className="text-xs text-slate-655 mt-1 leading-relaxed">{notif.message}</p>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                {formatTimestamp(notif.time)}
              </span>
            </div>

            {/* Right Read Indicators */}
            <div className="shrink-0 flex items-center justify-center">
              {!notif.read ? (
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" title="Unread notification" />
              ) : (
                <span className="text-[10px] text-slate-400 font-medium select-none">Read</span>
              )}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">Inbox Zero! No alerts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Notifications;
