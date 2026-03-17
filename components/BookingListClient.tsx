'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Car, 
  Calendar,
  Search,
  UserCheck,
  CalendarDays,
  Route,
  UserRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import BookingActions from '@/components/BookingActions';
import AssignBookingModal from '@/components/AssignBookingModal';
import SortButton from '@/components/SortButton';
import ExportBookingDoc from '@/components/ExportBookingDoc';
import { createPortal } from 'react-dom';

interface BookingListClientProps {
  initialBookings: BookingItem[];
  sort: string;
  order: string;
}

interface BookingItem {
  id: number;
  trip_id?: number | null;
  requester_name: string;
  owner_name?: string;
  requester_position?: string;
  destination: string;
  distance?: number | string | null;
  purpose?: string | null;
  passengers?: number | string | null;
  start_time: string;
  car_id?: number | null;
  driver_id?: number | null;
  brand?: string | null;
  model?: string | null;
  license_plate?: string | null;
  driver_name?: string | null;
  status_code: string;
  status_text?: string | null;
  trip_type: 'internal' | 'external';
}

export default function BookingListClient({ initialBookings, sort, order }: BookingListClientProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingItem | null>(null);
  const pendingBookings = initialBookings.filter((booking) => booking.status_code === '001');

  const getBookingDateKey = (startTime: string) => {
    const date = new Date(startTime);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  };

  const toggleSelect = (id: number) => {
    const booking = initialBookings.find((item) => item.id === id);
    if (!booking || booking.status_code !== '001') return;

    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }

      if (prev.length === 0) {
        return [id];
      }

      const firstSelectedBooking = initialBookings.find((item) => item.id === prev[0]);
      if (!firstSelectedBooking) {
        return [id];
      }

      const selectedDateKey = getBookingDateKey(firstSelectedBooking.start_time);
      const currentDateKey = getBookingDateKey(booking.start_time);

      if (!selectedDateKey || !currentDateKey || selectedDateKey !== currentDateKey) {
        return prev;
      }

      return [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length > 0) {
      setSelectedIds([]);
    } else {
      const firstPendingBooking = pendingBookings[0];
      if (!firstPendingBooking) {
        return;
      }

      const firstDateKey = getBookingDateKey(firstPendingBooking.start_time);
      setSelectedIds(
        pendingBookings
          .filter((booking) => getBookingDateKey(booking.start_time) === firstDateKey)
          .map((booking) => booking.id)
      );
    }
  };

  const handleBulkAssign = () => {
    if (selectedIds.length === 0) return;
    const firstId = selectedIds[0];
    const firstBooking = initialBookings.find(b => b.id === firstId);
    if (!firstBooking) return;
    setActiveBooking(firstBooking);
    setIsModalOpen(true);
  };

  const shouldShowBulkAction = selectedIds.length > 0;

  const bulkAssignButtonDesktop = shouldShowBulkAction ? (
    <button
      onClick={handleBulkAssign}
      className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold shadow-sm bg-[#23b35b] text-white hover:bg-[#1ea651] transition-all"
    >
      <Car className="mr-2 w-4 h-4" />
      จัดรถ ({selectedIds.length})
    </button>
  ) : null;

  const bulkAssignButtonMobile = shouldShowBulkAction ? (
    <button
      onClick={handleBulkAssign}
      className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold shadow-sm bg-[#23b35b] text-white hover:bg-[#1ea651] transition-all"
    >
      <Car className="mr-1.5 w-4 h-4" />
      จัดรถ ({selectedIds.length})
    </button>
  ) : null;

  const headerActionContainer = typeof document !== 'undefined' ? document.getElementById('header-extra-actions') : null;
  const headerActionMobileContainer = typeof document !== 'undefined' ? document.getElementById('header-extra-actions-mobile') : null;

  const desktopPortal = headerActionContainer && bulkAssignButtonDesktop
    ? createPortal(bulkAssignButtonDesktop, headerActionContainer)
    : null;

  const mobilePortal = headerActionMobileContainer && bulkAssignButtonMobile
    ? createPortal(bulkAssignButtonMobile, headerActionMobileContainer)
    : null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {desktopPortal}
      {mobilePortal}

      <div className="bg-white rounded-[1.25rem] shadow-sm border border-[#cfead5] overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#d9efdd] bg-[#f1fbf2] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex space-x-6 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
            {['ทั้งหมด', 'รอจัดรถ', 'จัดรถแล้ว', 'ยกเลิก'].map((tab, i) => (
              <button key={i} className={cn(
                "whitespace-nowrap pb-2 text-sm font-bold uppercase tracking-widest transition-all relative",
                i === 0 ? "text-[#1c6436]" : "text-[#6f9b79] hover:text-[#2a7a45]"
              )}>
                {tab}
                {i === 0 && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#36b564] rounded-full"></span>}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6ca77b]" />
            <input 
              type="text" 
              placeholder="ค้นหาตามชื่อผู้ขอ..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#cbe7d1] rounded-xl text-sm focus:ring-2 focus:ring-[#9ee0ae] focus:border-[#9ee0ae] transition-all shadow-none"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f7fbf7]">
                <th className="px-8 py-5 text-left w-12">
                   <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.every((id) => {
                      const booking = pendingBookings.find((item) => item.id === id);
                      if (!booking || pendingBookings.length === 0) return false;
                      return getBookingDateKey(booking.start_time) === getBookingDateKey(pendingBookings[0].start_time);
                    })}
                    onChange={toggleSelectAll}
                    disabled={pendingBookings.length === 0}
                    className="w-4 h-4 rounded border-[#b9e1c2] text-[#23b35b] focus:ring-[#23b35b] cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-left text-[11px] font-medium text-[#5f8f6b] uppercase tracking-widest w-16">
                  <SortButton column="id" label="#" currentSort={sort} currentOrder={order} />
                </th>
                <th className="px-8 py-4 text-left text-[11px] font-medium text-[#5f8f6b] uppercase tracking-widest">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /><SortButton column="start_time" label="วันเดินทาง" currentSort={sort} currentOrder={order} /></span>
                </th>
                <th className="px-8 py-4 text-left text-[11px] font-medium text-[#5f8f6b] uppercase tracking-widest"><span className="inline-flex items-center gap-1.5"><UserRound className="w-3.5 h-3.5" />ผู้ขอ</span></th>
                <th className="px-8 py-4 text-left text-[11px] font-medium text-[#5f8f6b] uppercase tracking-widest"><span className="inline-flex items-center gap-1.5"><Route className="w-3.5 h-3.5" />สถานที่ไป</span></th>
                <th className="px-8 py-4 text-left text-[11px] font-medium text-[#5f8f6b] uppercase tracking-widest">รถ</th>
                <th className="px-8 py-4 text-center text-[11px] font-medium text-[#5f8f6b] uppercase tracking-widest">เอกสาร</th>
                <th className="px-8 py-4 text-right text-[11px] font-medium text-[#5f8f6b] uppercase tracking-widest">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5ef]">
              {initialBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-24 text-center">
                    <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-emerald-300" />
                    </div>
                    <h3 className="text-xl font-medium text-emerald-950">ไม่พบรายการขอใช้รถ</h3>
                  </td>
                </tr>
              ) : (
                initialBookings.map((b) => {
                  const isSelected = selectedIds.includes(b.id);
                  const displayName = b.requester_name || b.owner_name || '-';
                  const firstSelectedBooking = selectedIds.length > 0
                    ? initialBookings.find((item) => item.id === selectedIds[0])
                    : null;
                  const isSameTripDate = !firstSelectedBooking || getBookingDateKey(firstSelectedBooking.start_time) === getBookingDateKey(b.start_time);
                  let passengerCount = typeof b.passengers === 'number' ? b.passengers : 0;
                  try {
                    // If passengers is stored as integer, use it directly
                    if (typeof b.passengers === 'number') {
                      passengerCount = b.passengers;
                    } else if (typeof b.passengers === 'string') {
                      // Handle legacy string format
                      const parsed = JSON.parse(b.passengers);
                      passengerCount = Array.isArray(parsed) ? parsed.length : (b.passengers.split(/[,\n]/).filter(Boolean).length || 0);
                    }
                  } catch {
                    // Fallback for string format
                    if (typeof b.passengers === 'string') {
                      passengerCount = b.passengers.split(/[,\n]/).filter(Boolean).length || 0;
                    }
                  }

                  return (
                    <tr key={b.id} className={cn(
                      "hover:bg-[#f6fbf7] transition-colors group",
                      isSelected ? "bg-[#eefaf0]" : ""
                    )}>
                      <td className="px-8 py-6">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(b.id)}
                          disabled={b.status_code !== '001' || (!isSelected && !isSameTripDate)}
                          className="w-4 h-4 rounded border-[#b9e1c2] text-[#23b35b] focus:ring-[#23b35b] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-6">
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-slate-400">{b.id}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-nowrap">
                        <div className="text-sm font-medium text-slate-800">{new Date(b.start_time).toLocaleDateString('th-TH')}</div>
                        <div className="text-[11px] font-medium text-slate-400">{new Date(b.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-medium text-slate-900">{displayName}</div>
                        <div className="text-[10px] font-medium text-slate-400 uppercase">{b.requester_position || 'ไม่ระบุตำแหน่ง'}</div>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <div className="flex items-center text-sm font-medium text-slate-800 mb-1">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                          <span className="truncate mr-2">{b.destination}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-[10px] text-slate-400 font-medium uppercase">{b.distance} กม.</div>
                          {passengerCount > 0 && (
                            <div className="flex items-center text-[10px] text-emerald-600 font-medium uppercase">
                              <Users className="w-3 h-3 mr-1" /> {passengerCount} คน
                            </div>
                          )}
                        </div>
                        {b.purpose && (
                          <div className="mt-2 text-[11px] text-[#6d8974] font-medium line-clamp-2 italic bg-[#f7fbf7] p-2 rounded-lg border border-[#e4f1e7]">
                            &quot;{b.purpose}&quot;
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {b.car_id ? (
                          <div>
                            <div className="text-sm font-medium text-slate-800">{b.brand} {b.model}</div>
                            <div className="text-[11px] font-medium text-[#2f9c55] uppercase">{b.license_plate}</div>
                            <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                              <UserCheck className="w-3 h-3 mr-1" /> {b.driver_name || 'รอมอบหมาย'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#6d9878] font-medium italic bg-[#f4fbf5] px-3 py-1.5 rounded-lg border border-dashed border-[#cbe7d1] inline-block">
                            รอจัดสรรรถ
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-center">
                        {b.car_id ? (
                          <div className="inline-flex items-center justify-center">
                            <ExportBookingDoc booking={b} />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <BookingActions booking={b} view="desktop" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-[#edf5ef]">
          {initialBookings.length === 0 ? (
            <div className="px-8 py-24 text-center">
              <Calendar className="mx-auto w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium italic">ไม่พบรายการขอใช้รถ</p>
            </div>
          ) : (
            initialBookings.map((b) => {
              const isSelected = selectedIds.includes(b.id);
              const displayName = b.requester_name || b.owner_name || '-';
              const firstSelectedBooking = selectedIds.length > 0
                ? initialBookings.find((item) => item.id === selectedIds[0])
                : null;
              const isSameTripDate = !firstSelectedBooking || getBookingDateKey(firstSelectedBooking.start_time) === getBookingDateKey(b.start_time);
              return (
                <div key={b.id} className={cn("p-6 space-y-6 transition-colors", isSelected ? "bg-[#eefaf0]" : "")}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(b.id)}
                        disabled={b.status_code !== '001' || (!isSelected && !isSameTripDate)}
                        className="w-4 h-4 rounded border-[#b9e1c2] text-[#23b35b] focus:ring-[#23b35b] cursor-pointer"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {displayName}
                          <span className="ml-1.5 text-[10px] text-slate-400 font-bold italic">{b.id}</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{b.requester_position || 'ไม่ระบุตำแหน่ง'}</div>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest",
                      b.status_code === '001' ? 'bg-amber-100 text-amber-600' : 
                      b.status_code === '002' ? 'bg-emerald-100 text-emerald-600' : 
                      b.status_code === '004' ? 'bg-blue-100 text-blue-600' :
                      b.status_code === '003' ? 'bg-rose-100 text-rose-600' :
                      'bg-slate-100 text-slate-600'
                    )}>
                       {b.status_text || 'ไม่ระบุ'}
                    </span>
                  </div>

                  <div className="bg-[#f4fbf5] rounded-2xl p-4 space-y-3 border border-[#dfeee2]">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-rose-500" />
                        <span className="truncate max-w-[150px]">{b.destination}</span>
                      </div>
                    </div>
                    {b.purpose && (
                      <div className="text-[10px] text-emerald-700/80 font-medium italic border-l-2 border-emerald-300 pl-2 py-1">
                        {b.purpose}
                      </div>
                    )}
                    {b.car_id && (
                      <div className="flex items-center text-[10px] text-emerald-700 font-bold">
                        <Car className="w-3 h-3 mr-1" />
                        <span>{b.brand} {b.model} • {b.driver_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-500 capitalize">
                      {new Date(b.start_time).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} • 
                      <span className="ml-1 text-slate-900">{new Date(b.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <BookingActions booking={b} view="mobile" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {activeBooking && (
        <AssignBookingModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setActiveBooking(null);
            setSelectedIds([]);
          }} 
          booking={{
            ...activeBooking,
            requester_name: activeBooking.requester_name || activeBooking.owner_name || '',
            trip_id: activeBooking.trip_id ?? null,
            car_id: activeBooking.car_id ?? null,
            driver_id: activeBooking.driver_id ?? null,
            driver_name: activeBooking.driver_name ?? null,
          }} 
          allowTripMerge={true}
          initialOtherIds={selectedIds.filter(id => id !== activeBooking.id)}
        />
      )}
    </div>
  );
}
