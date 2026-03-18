'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  MapPin,
  Users,
  Car,
  Calendar,
  UserCheck,
  Route,
  UserRound,
  Ban,
  List,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import BookingActions from '@/components/BookingActions';
import AssignBookingModal from '@/components/AssignBookingModal';
import SortButton from '@/components/SortButton';
import ExportBookingDoc from '@/components/ExportBookingDoc';
import type { BookingStatusIds } from '@/lib/booking-flow';

interface BookingListClientProps {
  initialBookings: BookingItem[];
  departments: Array<{ id: number; name: string }>;
  sort: string;
  order: string;
  statusIds: BookingStatusIds;
}

interface BookingItem {
  id: number;
  trip_id?: number | null;
  requester_name: string;
  requester_position?: string;
  department_name?: string | null;
  destination: string;
  distance?: number | string | null;
  purpose?: string | null;
  passengers?: number | string | null;
  start_date?: string | null;
  start_time: string;
  end_date?: string | null;
  car_id?: number | null;
  driver_id?: number | null;
  brand?: string | null;
  model?: string | null;
  license_plate?: string | null;
  driver_name?: string | null;
  status_id?: number | null;
  status_text?: string | null;
  trip_type_id?: number | null;
  trip_type_name?: string | null;
  end_time?: string | null;
  trip_start_date_time?: string | null;
}

type BookingTab = 'all' | 'pending' | 'assigned' | 'travelled' | 'cancelled';

const bookingTabs: Array<{ key: BookingTab; label: string; icon: typeof List }> = [
  { key: 'all', label: 'ทั้งหมด', icon: List },
  { key: 'pending', label: 'รอจัดรถ', icon: Calendar },
  { key: 'assigned', label: 'จัดรถแล้ว', icon: BadgeCheck },
  { key: 'travelled', label: 'เดินทางแล้ว', icon: Route },
  { key: 'cancelled', label: 'ยกเลิก', icon: Ban },
];

function isBookingTab(value: string | null): value is BookingTab {
  return value === 'all' || value === 'pending' || value === 'assigned' || value === 'travelled' || value === 'cancelled';
}

function getStatusBadgeClass(statusId: number | null | undefined, statusIds: BookingStatusIds) {
  if (statusId === statusIds.pending) return 'bg-amber-100 text-amber-700';
  if (statusId === statusIds.assigned) return 'bg-emerald-100 text-emerald-700';
  if (statusId === statusIds.completed) return 'bg-blue-100 text-blue-700';
  if (statusId === statusIds.rejected) return 'bg-rose-100 text-rose-700';
  if (statusId === statusIds.cancelled) return 'bg-slate-200 text-slate-700';
  return 'bg-slate-100 text-slate-700';
}

function getTripTypeBadgeClass(tripTypeName: string | null | undefined) {
  if (tripTypeName === 'ภายในจังหวัด') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (tripTypeName === 'ต่างจังหวัด') return 'border-violet-200 bg-violet-50 text-violet-700';
  return 'border-sky-200 bg-sky-50 text-sky-700';
}

function normalizeDatePart(value?: string | Date | null) {
  if (!value) return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    return value.toISOString().split('T')[0];
  }
  const normalizedValue = String(value);
  return normalizedValue.includes('T') ? normalizedValue.split('T')[0] : normalizedValue;
}

function normalizeTimePart(value?: string | Date | null) {
  if (!value) return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    return value.toTimeString().slice(0, 5);
  }
  const normalizedValue = String(value);
  return normalizedValue.length >= 5 ? normalizedValue.slice(0, 5) : normalizedValue;
}

function buildBookingDateTime(date?: string | Date | null, time?: string | Date | null) {
  const normalizedDate = normalizeDatePart(date);
  const normalizedTime = normalizeTimePart(time);
  if (!normalizedDate || !normalizedTime) return null;
  
  // Parse date and time separately to avoid timezone issues
  const [year, month, day] = normalizedDate.split('-').map(Number);
  const [hours, minutes] = normalizedTime.split(':').map(Number);
  
  if (![year, month, day, hours, minutes].every((item) => Number.isFinite(item))) {
    return null;
  }
  
  // Create date using local timezone
  const parsed = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function BookingListClient({ initialBookings, departments, sort, order, statusIds }: BookingListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<BookingTab>(() => {
    const tabParam = searchParams.get('tab');
    return isBookingTab(tabParam) ? tabParam : 'all';
  });
  const [departmentFilter, setDepartmentFilter] = useState(searchParams.get('department') ?? '');
  const [travelDateFilter, setTravelDateFilter] = useState(searchParams.get('date') ?? '');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingItem | null>(null);

  const departmentOptions = useMemo(
    () => departments.map((department) => department.name),
    [departments]
  );

  const getBookingDateKey = (booking: BookingItem) => {
    const date = buildBookingDateTime(booking.start_date, booking.start_time);
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isPastTravelDate = (booking: BookingItem) => {
    const bookingDate = buildBookingDateTime(booking.start_date, booking.start_time);
    if (!bookingDate) return false;
    bookingDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate < today;
  };

  const matchesTab = (booking: BookingItem) => {
    const isCancelled = booking.status_id === statusIds.rejected || booking.status_id === statusIds.cancelled;
    const isTravelled = !isCancelled && isPastTravelDate(booking);

    switch (activeTab) {
      case 'pending':
        return booking.status_id === statusIds.pending && !isTravelled;
      case 'assigned':
        return booking.status_id === statusIds.assigned && !isTravelled;
      case 'travelled':
        return isTravelled;
      case 'cancelled':
        return isCancelled;
      default:
        return !isTravelled;
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    setActiveTab(isBookingTab(tabParam) ? tabParam : 'all');
    setDepartmentFilter(searchParams.get('department') ?? '');
    setTravelDateFilter(searchParams.get('date') ?? '');
  }, [searchParams]);

  useEffect(() => {
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
    const eventSource = new EventSource('/api/bookings/stream');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type?: string };
        if (payload.type === 'connected' || payload.type === 'heartbeat') {
          return;
        }
      } catch {
      }

      if (refreshTimeout) {
        return;
      }

      refreshTimeout = setTimeout(() => {
        refreshTimeout = null;
        router.refresh();
      }, 150);
    };

    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      eventSource.close();
    };
  }, [router]);

  const createFilterQueryString = useMemo(
    () => (nextDepartment: string, nextDate: string, nextTab: BookingTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextTab !== 'all') {
        params.set('tab', nextTab);
      } else {
        params.delete('tab');
      }
      if (nextDepartment.trim()) {
        params.set('department', nextDepartment.trim());
      } else {
        params.delete('department');
      }
      if (nextDate) {
        params.set('date', nextDate);
      } else {
        params.delete('date');
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateFilters = (nextDepartment: string, nextDate: string, nextTab: BookingTab = activeTab) => {
    setDepartmentFilter(nextDepartment);
    setTravelDateFilter(nextDate);
    setActiveTab(nextTab);
    setSelectedIds([]);
    const queryString = createFilterQueryString(nextDepartment, nextDate, nextTab);
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const filteredBookings = initialBookings.filter((booking) => {
    if (!matchesTab(booking)) return false;
    if (travelDateFilter && getBookingDateKey(booking) !== travelDateFilter) return false;
    if (departmentFilter && booking.department_name !== departmentFilter) return false;
    return true;
  });

  const pendingBookings = filteredBookings.filter((booking) => booking.status_id === statusIds.pending);

  const toggleSelect = (id: number) => {
    const booking = filteredBookings.find((item) => item.id === id);
    if (!booking || booking.status_id !== statusIds.pending) return;

    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((itemId) => itemId !== id);
      if (prev.length === 0) return [id];

      const firstSelectedBooking = filteredBookings.find((item) => item.id === prev[0]);
      if (!firstSelectedBooking) return [id];

      const selectedDateKey = getBookingDateKey(firstSelectedBooking);
      const currentDateKey = getBookingDateKey(booking);

      if (!selectedDateKey || !currentDateKey || selectedDateKey !== currentDateKey) return prev;
      return [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length > 0) {
      setSelectedIds([]);
      return;
    }
    const firstPendingBooking = pendingBookings[0];
    if (!firstPendingBooking) return;
    const firstDateKey = getBookingDateKey(firstPendingBooking);
    setSelectedIds(
      pendingBookings
        .filter((booking) => getBookingDateKey(booking) === firstDateKey)
        .map((booking) => booking.id)
    );
  };

  const handleBulkAssign = () => {
    if (selectedIds.length === 0) return;
    const firstId = selectedIds[0];
    const firstBooking =
      filteredBookings.find((booking) => booking.id === firstId) ||
      initialBookings.find((booking) => booking.id === firstId);
    if (!firstBooking) return;
    setActiveBooking(firstBooking);
    setIsModalOpen(true);
  };

  const selectedMergeBookings = selectedIds
    .filter((id) => activeBooking ? id !== activeBooking.id : true)
    .map((id) => {
      const booking = filteredBookings.find((item) => item.id === id) || initialBookings.find((item) => item.id === id);
      if (!booking) return null;

      const passengers =
        typeof booking.passengers === 'number'
          ? booking.passengers
          : typeof booking.passengers === 'string'
            ? Number(booking.passengers) || booking.passengers.split(/[\n,]/).filter(Boolean).length
            : 0;

      return {
        id: booking.id,
        trip_id: booking.trip_id ?? null,
        requester_name: booking.requester_name,
        destination: booking.destination,
        start_date: booking.start_date ?? null,
        start_time: booking.start_time,
        end_date: booking.end_date ?? booking.start_date ?? null,
        end_time: booking.end_time ?? booking.start_time,
        trip_type_id: booking.trip_type_id ?? null,
        passengers,
      };
    })
    .filter((booking): booking is NonNullable<typeof booking> => booking !== null);

  const shouldShowBulkAction = selectedIds.length > 0;

  const bulkAssignButtonDesktop = shouldShowBulkAction ? (
    <button
      onClick={handleBulkAssign}
      className="inline-flex items-center rounded-xl bg-[#23b35b] px-3 py-1.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1ea651]"
    >
      <Car className="mr-2 h-4 w-4" />
      จัดรถ ({selectedIds.length})
    </button>
  ) : null;

  const bulkAssignButtonMobile = shouldShowBulkAction ? (
    <button
      onClick={handleBulkAssign}
      className="inline-flex items-center rounded-lg bg-[#23b35b] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1ea651]"
    >
      <Car className="mr-1.5 h-4 w-4" />
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
    <div className="animate-in slide-in-from-right-4 space-y-8 duration-500">
      {desktopPortal}
      {mobilePortal}

      <div className="overflow-hidden rounded-[1.25rem] border border-[#cfead5] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 border-b border-[#d9efdd] bg-[#f1fbf2] p-5 md:flex-row md:items-center md:p-6">
          <div className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar md:pb-0">
            {bookingTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    updateFilters('', '', tab.key);
                  }}
                  className={cn(
                    'relative inline-flex items-center gap-1.5 whitespace-nowrap pb-2 text-sm font-bold uppercase tracking-widest transition-all',
                    activeTab === tab.key ? 'text-[#1c6436]' : 'text-[#6f9b79] hover:text-[#2a7a45]'
                  )}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.key && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#36b564]" />}
                </button>
              );
            })}
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="w-full max-w-xs">
              <select
                value={departmentFilter}
                onChange={(event) => {
                  updateFilters(event.target.value, travelDateFilter);
                }}
                className="w-full rounded-xl border border-[#cbe7d1] bg-white px-4 py-3 text-sm shadow-none transition-all focus:border-[#9ee0ae] focus:ring-2 focus:ring-[#9ee0ae]"
              >
                <option value="">ทุกกลุ่มงาน</option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
            <div className="relative w-full md:w-[190px]">
              <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6ca77b]" />
              <input
                type="date"
                value={travelDateFilter}
                onChange={(event) => {
                  updateFilters(departmentFilter, event.target.value);
                }}
                className="w-full rounded-xl border border-[#cbe7d1] bg-white py-3 pl-12 pr-4 text-sm shadow-none transition-all focus:border-[#9ee0ae] focus:ring-2 focus:ring-[#9ee0ae]"
              />
            </div>
            <button
              type="button"
              onClick={() => updateFilters('', '')}
              className="inline-flex h-[46px] items-center justify-center rounded-xl border border-[#cbe7d1] bg-white px-4 text-sm font-bold text-[#4f7d5c] transition-all hover:border-[#9ee0ae] hover:text-[#245239]"
            >
              ล้าง
            </button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-[#f7fbf7]">
                <th className="w-10 px-3 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.every((id) => {
                      const booking = pendingBookings.find((item) => item.id === id);
                      if (!booking || pendingBookings.length === 0) return false;
                      return getBookingDateKey(booking) === getBookingDateKey(pendingBookings[0]);
                    })}
                    onChange={toggleSelectAll}
                    disabled={pendingBookings.length === 0}
                    className="h-4 w-4 cursor-pointer rounded border-[#b9e1c2] text-[#23b35b] focus:ring-[#23b35b]"
                  />
                </th>
                <th className="w-12 px-3 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">
                  <SortButton column="id" label="#" currentSort={sort} currentOrder={order} />
                </th>
                <th className="w-28 px-3 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <SortButton column="start_time" label="วันเดินทาง" currentSort={sort} currentOrder={order} />
                  </span>
                </th>
                <th className="w-32 px-3 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">
                  <span className="inline-flex items-center gap-1.5">
                    <Route className="h-3.5 w-3.5" />
                    ประเภททริป
                  </span>
                </th>
                <th className="w-40 px-3 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5" />
                    ผู้ขอ
                  </span>
                </th>
                <th className="w-[22%] px-3 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    เส้นทาง / วัตถุประสงค์
                  </span>
                </th>
                <th className="w-[18%] px-3 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">
                  <span className="inline-flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5" />
                    รถ / คนขับ
                  </span>
                </th>
                <th className="w-28 px-3 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">สถานะ</th>
                <th className="w-24 px-3 py-4 text-right text-[11px] font-medium uppercase tracking-widest text-[#5f8f6b]">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5ef]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-8 py-24 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-200" />
                    <p className="font-medium text-slate-400">ไม่พบรายการขอใช้รถ</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isSelected = selectedIds.includes(b.id);
                  const displayName = b.requester_name || '-';
                  const bookingStartDateTime = buildBookingDateTime(b.start_date, b.start_time);
                  const firstSelectedBooking = selectedIds.length > 0
                    ? filteredBookings.find((item) => item.id === selectedIds[0])
                    : null;
                  const isSameTripDate = !firstSelectedBooking || getBookingDateKey(firstSelectedBooking) === getBookingDateKey(b);
                  const passengerCount = typeof b.passengers === 'number'
                    ? b.passengers
                    : typeof b.passengers === 'string'
                      ? Number(b.passengers) || b.passengers.split(/[\n,]/).filter(Boolean).length
                      : 0;

                  return (
                    <tr key={b.id} className={cn('group transition-colors hover:bg-[#f6fbf7]', isSelected && 'bg-[#eefaf0]')}>
                      <td className="px-3 py-5 align-top">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(b.id)}
                          disabled={b.status_id !== statusIds.pending || (!isSelected && !isSameTripDate)}
                          className="h-4 w-4 cursor-pointer rounded border-[#b9e1c2] text-[#23b35b] focus:ring-[#23b35b]"
                        />
                      </td>
                      <td className="px-3 py-5 align-top">
                        <div className="text-xs font-medium text-slate-400">{b.id}</div>
                      </td>
                      <td className="px-3 py-5 align-top">
                        <div className="text-sm font-medium text-slate-800">
                          {b.start_date ? (() => {
                            if ((b.start_date as any) instanceof Date) {
                              return (b.start_date as unknown as Date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
                            }
                            const dateStr = String(b.start_date);
                            if (dateStr.includes('-')) {
                              const [year, month, day] = dateStr.split('-').map(Number);
                              const date = new Date(year, month - 1, day);
                              return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
                            }
                            return '-';
                          })() : '-'}
                        </div>
                        <div className="text-[11px] font-medium text-slate-400">
                          {b.start_time ? b.start_time.slice(0, 5) : '-'}
                        </div>
                      </td>
                      <td className="px-3 py-5 align-top">
                        <div className={cn('inline-flex max-w-full items-center rounded-lg border px-3 py-1.5 text-xs font-medium', getTripTypeBadgeClass(b.trip_type_name))}>
                          <Route className="mr-1.5 h-3.5 w-3.5" />
                          <span className="truncate">{b.trip_type_name || 'ไม่ระบุ'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-5 align-top">
                        <div className="truncate text-sm font-medium text-slate-900">{displayName}</div>
                        <div className="truncate text-[10px] font-medium uppercase text-slate-400">{b.department_name || b.requester_position || 'ไม่ระบุหน่วยงาน'}</div>
                      </td>
                      <td className="px-3 py-5 align-top">
                        <div className="mb-1 flex items-center text-sm font-medium text-slate-800">
                          <MapPin className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
                          <span className="mr-2 line-clamp-2 break-words">{b.destination}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div className="text-[10px] font-medium uppercase text-slate-400">{b.distance} กม.</div>
                          {passengerCount > 0 && (
                            <div className="flex items-center text-[10px] font-medium uppercase text-emerald-600">
                              <Users className="mr-1 h-3 w-3" /> {passengerCount} คน
                            </div>
                          )}
                        </div>
                        {b.purpose && (
                          <div className="mt-2 line-clamp-2 rounded-lg border border-[#e4f1e7] bg-[#f7fbf7] p-2 text-[11px] font-medium text-[#6d8974]">
                            &quot;{b.purpose}&quot;
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-5 align-top">
                        {b.car_id ? (
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-slate-800">{b.brand} {b.model}</div>
                            <div className="truncate text-[11px] font-medium uppercase text-[#2f9c55]">{b.license_plate}</div>
                            <div className="mt-1 flex items-center text-[10px] text-slate-400">
                              <UserCheck className="mr-1 h-3 w-3 shrink-0" />
                              <span className="truncate">{b.driver_name || '-'}</span>
                            </div>
                            {b.trip_start_date_time && (
                              <div className="mt-1 text-[10px] font-bold uppercase tracking-tight text-slate-500">
                                ออก-{new Date(b.trip_start_date_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-3 py-5 align-top">
                        <div className="flex flex-col items-start gap-2">
                          <span className={cn('inline-flex rounded-lg px-2.5 py-1 text-[10px] font-bold', getStatusBadgeClass(b.status_id, statusIds))}>
                            {b.status_text || 'ไม่ระบุ'}
                          </span>
                          {b.car_id && (
                            <div className="inline-flex items-center justify-center">
                              <ExportBookingDoc booking={b} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-5 text-right align-top">
                        <BookingActions booking={b} view="desktop" statusIds={statusIds} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-[#edf5ef] lg:hidden">
          {filteredBookings.length === 0 ? (
            <div className="px-8 py-24 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-200" />
              <p className="font-medium text-slate-400">ไม่พบรายการขอใช้รถ</p>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isSelected = selectedIds.includes(b.id);
              const displayName = b.requester_name || '-';
              const bookingStartDateTime = buildBookingDateTime(b.start_date, b.start_time);
              const firstSelectedBooking = selectedIds.length > 0
                ? filteredBookings.find((item) => item.id === selectedIds[0])
                : null;
              const isSameTripDate = !firstSelectedBooking || getBookingDateKey(firstSelectedBooking) === getBookingDateKey(b);

              return (
                <div key={b.id} className={cn('space-y-6 p-6 transition-colors', isSelected && 'bg-[#eefaf0]')}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(b.id)}
                        disabled={b.status_id !== statusIds.pending || (!isSelected && !isSameTripDate)}
                        className="h-4 w-4 cursor-pointer rounded border-[#b9e1c2] text-[#23b35b] focus:ring-[#23b35b]"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {displayName}
                          <span className="ml-1.5 text-[10px] font-bold text-slate-400">{b.id}</span>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-tight text-slate-400">{b.requester_position || 'ไม่ระบุตำแหน่ง'}</div>
                      </div>
                    </div>
                    <span className={cn('rounded-md px-3 py-1 text-[9px] font-bold uppercase tracking-widest', getStatusBadgeClass(b.status_id, statusIds))}>
                      {b.status_text || 'ไม่ระบุ'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={cn('inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium', getTripTypeBadgeClass(b.trip_type_name))}>
                      <Route className="mr-1 h-3 w-3" />
                      {b.trip_type_name || 'ไม่ระบุ'}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-[#dfeee2] bg-[#f4fbf5] p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-rose-500" />
                        <span className="max-w-[150px] truncate">{b.destination}</span>
                      </div>
                    </div>
                    {b.purpose && (
                      <div className="border-l-2 border-emerald-300 py-1 pl-2 text-[10px] font-medium text-emerald-700/80">
                        {b.purpose}
                      </div>
                    )}
                    {b.car_id && (
                      <div className="flex items-center text-[10px] font-bold text-emerald-700">
                        <Car className="mr-1 h-3 w-3" />
                        <span>{b.brand} {b.model} • {b.driver_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold capitalize text-slate-500">
                      {b.start_date ? (() => {
                        if ((b.start_date as any) instanceof Date) {
                          return (b.start_date as unknown as Date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
                        }
                        const dateStr = String(b.start_date);
                        if (dateStr.includes('-')) {
                          const [year, month, day] = dateStr.split('-').map(Number);
                          const date = new Date(year, month - 1, day);
                          return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
                        }
                        return '-';
                      })() : '-'} •
                      <span className="ml-1 text-slate-900">
                        {b.start_time ? String(b.start_time).slice(0, 5) : '-'}
                      </span>
                    </div>
                    <BookingActions booking={b} view="mobile" statusIds={statusIds} />
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
            requester_name: activeBooking.requester_name || '',
            trip_id: activeBooking.trip_id ?? null,
            car_id: activeBooking.car_id ?? null,
            driver_id: activeBooking.driver_id ?? null,
            start_date: activeBooking.start_date ?? null,
            end_date: activeBooking.end_date ?? activeBooking.start_date ?? null,
          }}
          allowTripMerge={true}
          initialOtherIds={selectedIds.filter((id) => id !== activeBooking.id)}
          initialMergeBookings={selectedMergeBookings}
        />
      )}
    </div>
  );
}
