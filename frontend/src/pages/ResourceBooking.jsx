import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ResourceBooking = () => {
  const {
    assets,
    bookings,
    addBooking,
    cancelBooking,
    user
  } = useApp();

  const [searchParams] = useSearchParams();

  // Calendar View settings
  const [calendarView, setCalendarView] = useState('list'); // 'month' | 'week' | 'day' | 'list'
  const [selectedAssetFilter, setSelectedAssetFilter] = useState('');
  
  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  
  // Form states
  const [bookingForm, setBookingForm] = useState({
    assetTag: '',
    purpose: '',
    startTime: '',
    endTime: ''
  });

  // Watch URL params (e.g. from Dashboard quick action)
  useEffect(() => {
    if (searchParams.get('openBook') === 'true') {
      setIsBookModalOpen(true);
    }
  }, [searchParams]);

  // Derived list of shared/bookable assets
  const bookableAssets = assets.filter(a => a.shared === true && a.status !== 'Lost' && a.status !== 'Disposed');

  // Find asset detail helper
  const getAssetDetails = (tag) => assets.find(a => a.tag === tag);

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesAsset = selectedAssetFilter ? b.assetTag === selectedAssetFilter : true;
    return matchesAsset && b.status !== 'Cancelled';
  });

  // Check conflicts in real-time as user types
  const checkLiveConflict = () => {
    if (!bookingForm.assetTag || !bookingForm.startTime || !bookingForm.endTime) return false;
    const start = new Date(bookingForm.startTime).getTime();
    const end = new Date(bookingForm.endTime).getTime();

    if (start >= end) return false;

    return bookings.some(b => {
      if (b.assetTag !== bookingForm.assetTag || b.status === 'Cancelled') return false;
      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      return (start < bEnd && end > bStart);
    });
  };

  const isConflict = checkLiveConflict();

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const start = new Date(bookingForm.startTime).getTime();
    const end = new Date(bookingForm.endTime).getTime();
    
    if (start >= end) {
      toast.error('End Time must be after Start Time.');
      return;
    }

    const chosenAsset = bookableAssets.find(a => a.tag === bookingForm.assetTag);
    if (!chosenAsset) {
      toast.error('Select a valid shared resource.');
      return;
    }

    const res = addBooking({
      ...bookingForm,
      assetName: chosenAsset.name
    });

    if (res.success) {
      toast.success('Resource booking approved and confirmed.');
    } else {
      toast.error('Booking conflict detected. Awaiting approval by Dept Head.');
    }
    
    setIsBookModalOpen(false);
    setBookingForm({ assetTag: '', purpose: '', startTime: '', endTime: '' });
  };

  const handleCancelBooking = (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(id);
      toast.success('Booking cancelled.');
    }
  };

  // Mock Calendar Dates for July 2026
  const getDaysInMonth = () => {
    const arr = [];
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2026-07-${String(i).padStart(2, '0')}`;
      const dayBookings = bookings.filter(b => 
        b.status !== 'Cancelled' && 
        b.startTime.startsWith(dateStr) &&
        (selectedAssetFilter ? b.assetTag === selectedAssetFilter : true)
      );
      arr.push({ day: i, dateStr, bookings: dayBookings });
    }
    return arr;
  };

  const days = getDaysInMonth();

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resource Booking</h1>
          <p className="text-slate-500 text-sm mt-1">Reserve company cars, shared presentation projectors, meeting rooms, or lab devices.</p>
        </div>
        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" /> Book Shared Resource
        </button>
      </div>

      {/* Toolbar / Filters row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Toggle Calendar View */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setCalendarView('list')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              calendarView === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Schedule List
          </button>
          <button
            onClick={() => setCalendarView('month')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              calendarView === 'month' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Month View
          </button>
        </div>

        {/* Filter by Bookable Assets */}
        <div className="relative w-full md:w-80">
          <select
            value={selectedAssetFilter}
            onChange={(e) => setSelectedAssetFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 bg-white font-semibold text-slate-700"
          >
            <option value="">Filter by Shared Asset (All)</option>
            {bookableAssets.map(a => (
              <option key={a.tag} value={a.tag}>{a.name} ({a.tag})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Calendar Body */}
      {calendarView === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Resource / Asset</th>
                  <th className="px-6 py-4">Reserved By</th>
                  <th className="px-6 py-4">Usage Purpose</th>
                  <th className="px-6 py-4">Date & Time Range</th>
                  <th className="px-6 py-4">Audit Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredBookings.map((b) => {
                  const assetInfo = getAssetDetails(b.assetTag);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{b.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={assetInfo?.image}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 block truncate">{b.assetName}</span>
                            <span className="text-[10px] text-slate-450 font-bold block mt-0.5">{b.assetTag}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-700">{b.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{b.purpose}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        <div className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> {b.startTime.split('T')[0]}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5"><Clock className="w-3.5 h-3.5 text-slate-350" /> {b.startTime.split('T')[1]} - {b.endTime.split('T')[1]}</div>
                      </td>
                      <td className="px-6 py-4">
                        {b.status === 'Approved' ? (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-250 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Conflict Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.employeeId === user?.id || user?.role === 'Admin' ? (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Locked</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400 font-medium">No active resource bookings logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Month View Calendar */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">July 2026</h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Scheduled Slots Highlighted</span>
          </div>

          <div className="grid grid-cols-7 gap-3 text-center font-bold text-xs text-slate-450 uppercase mb-2">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-3 min-h-[380px]">
            {days.map((d, index) => {
              const hasBookings = d.bookings.length > 0;
              const hasConflict = d.bookings.some(b => b.conflictDetected);

              return (
                <div
                  key={index}
                  className={`p-2.5 rounded-xl border flex flex-col items-start min-h-[70px] relative transition-colors ${
                    hasBookings
                      ? hasConflict 
                        ? 'bg-amber-50 border-amber-200 text-amber-900' 
                        : 'bg-blue-50/50 border-blue-150 text-blue-900 font-bold'
                      : 'bg-white border-slate-150 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-semibold select-none">{d.day}</span>
                  
                  {/* Miniature Booking details */}
                  <div className="w-full mt-1.5 space-y-1 overflow-hidden flex-1">
                    {d.bookings.slice(0, 2).map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className={`text-[9px] px-1 py-0.5 rounded truncate font-medium text-left ${
                          b.status === 'Approved' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                        }`}
                        title={`${b.assetName} - ${b.purpose}`}
                      >
                        {b.startTime.split('T')[1]} {b.assetName}
                      </div>
                    ))}
                    {d.bookings.length > 2 && (
                      <div className="text-[8px] font-bold text-slate-400 text-left">
                        +{d.bookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RESOURCE BOOKING MODAL */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Shared Resource Reservation"
        size="md"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-655 mb-1.5">Select Shared Resource *</label>
            <select
              required
              value={bookingForm.assetTag}
              onChange={(e) => setBookingForm({ ...bookingForm, assetTag: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-white font-semibold text-slate-700"
            >
              <option value="">-- Choose Bookable Equipment --</option>
              {bookableAssets.map(a => (
                <option key={a.tag} value={a.tag}>{a.name} ({a.tag})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-655 mb-1.5">Reservation Start Time *</label>
              <input
                type="datetime-local"
                required
                value={bookingForm.startTime}
                onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-655 mb-1.5">Reservation End Time *</label>
              <input
                type="datetime-local"
                required
                value={bookingForm.endTime}
                onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 bg-slate-50"
              />
            </div>
          </div>

          {/* Conflict warnings panel */}
          {isConflict && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-3 text-xs leading-4 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider">Warning: Double Booking Conflict</p>
                <p className="mt-0.5">This resource is already reserved during this window. If submitted, this booking will save as **Pending Approval** requiring review by a Department Head.</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-655 mb-1.5">Purpose / Meeting Title *</label>
            <input
              type="text"
              required
              value={bookingForm.purpose}
              onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
              placeholder="e.g. Sales Q3 Review Pitch"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ResourceBooking;
