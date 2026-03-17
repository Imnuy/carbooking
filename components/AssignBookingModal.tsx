'use client';

import { useEffect, useMemo, useState } from 'react';
import { Car, Check, Loader2, Plus, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const EMPTY_OTHER_IDS: number[] = [];

interface AssignModalProps {
  booking: {
    id: number;
    trip_id?: number | null;
    requester_name: string;
    destination: string;
    trip_type_id?: number | null;
    start_time?: string;
    car_id: number | null;
    driver_id?: number | null;
    status_id?: number | null;
  };
  isOpen: boolean;
  onClose: () => void;
  initialOtherIds?: number[];
  initialMergeBookings?: PendingBooking[];
  allowTripMerge?: boolean;
}

interface CarOption {
  id: number;
  brand: string;
  model: string;
  license_plate: string;
}

interface DriverOption {
  id: number;
  fullname: string;
}

interface TripTypeOption {
  id: number;
  name: string;
}

interface PendingBooking {
  id: number;
  trip_id?: number | null;
  requester_name: string;
  destination: string;
  start_time: string;
  end_time: string;
  trip_type_id: number | null;
  passengers: number;
}

interface TripBookingItem extends PendingBooking {
  locked?: boolean;
}

export default function AssignBookingModal({ booking, isOpen, onClose, initialOtherIds, initialMergeBookings, allowTripMerge = false }: AssignModalProps) {
  const router = useRouter();
  const otherIdsKey = (initialOtherIds ?? EMPTY_OTHER_IDS).join(',');
  const [loading, setLoading] = useState(false);
  const [fetchingCars, setFetchingCars] = useState(false);
  const [fetchingDrivers, setFetchingDrivers] = useState(false);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [tripTypes, setTripTypes] = useState<TripTypeOption[]>([]);
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [selectedOtherIds, setSelectedOtherIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    car_id: booking.car_id ? String(booking.car_id) : '',
    driver_id: booking.driver_id ? String(booking.driver_id) : '',
  });

  const tripTypeMap = useMemo(() => new Map(tripTypes.map((item) => [item.id, item.name])), [tripTypes]);

  const getBookingDateKey = (startTime?: string) => {
    if (!startTime) return '';
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const parsedOtherIds = allowTripMerge && otherIdsKey
      ? otherIdsKey.split(',').map((value) => Number(value)).filter((value) => Number.isFinite(value))
      : [];

    setFormData({
      car_id: booking.car_id ? String(booking.car_id) : '',
      driver_id: booking.driver_id ? String(booking.driver_id) : '',
    });
    setSelectedOtherIds(parsedOtherIds);
    setPendingBookings(allowTripMerge ? (initialMergeBookings ?? []) : []);

    fetch('/api/trip-types')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTripTypes(data.filter((item): item is TripTypeOption => typeof item?.id === 'number' && typeof item?.name === 'string'));
        }
      })
      .catch((error) => console.error(error));

    setFetchingCars(true);
    fetch('/api/cars/available')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCars(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setFetchingCars(false));

    setFetchingDrivers(true);
    fetch('/api/drivers/active')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDrivers(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setFetchingDrivers(false));

  }, [allowTripMerge, booking.car_id, booking.driver_id, initialMergeBookings, isOpen, otherIdsKey]);

  const tripBookings: TripBookingItem[] = [
    {
      id: booking.id,
      trip_id: booking.trip_id ?? null,
      requester_name: booking.requester_name,
      destination: booking.destination,
      start_time: booking.start_time ?? '',
      end_time: booking.start_time ?? '',
      trip_type_id: booking.trip_type_id ?? null,
      passengers: 0,
      locked: true,
    },
    ...pendingBookings,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: formData.car_id ? Number(formData.car_id) : null,
          driver_id: formData.driver_id ? Number(formData.driver_id) : null,
          other_ids: allowTripMerge ? selectedOtherIds : [],
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to assign booking');
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถจัดรถและพนักงานขับรถได้');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white font-sans shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">จัดรถและพนักงานขับรถ</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">ทริป {booking.trip_id ? `#${booking.trip_id}` : 'ใหม่'}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition-all hover:bg-white hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <Car className="mr-1 h-3 w-3" /> รถที่ต้องการจัดให้
                </label>
                <select
                  required
                  value={formData.car_id}
                  onChange={(e) => setFormData((current) => ({ ...current, car_id: e.target.value }))}
                  className="w-full rounded-2xl bg-slate-50 px-5 py-4 font-bold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">เลือกรถ</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>{car.brand} {car.model} ({car.license_plate})</option>
                  ))}
                </select>
                {fetchingCars && <p className="text-xs text-slate-400">กำลังดึงข้อมูลรถที่ว่างงาน...</p>}
              </div>

              <div className="space-y-2">
                <label className="ml-1 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <User className="mr-1 h-3 w-3" /> พนักงานขับรถ
                </label>
                <select
                  required
                  value={formData.driver_id}
                  onChange={(e) => setFormData((current) => ({ ...current, driver_id: e.target.value }))}
                  className="w-full rounded-2xl bg-slate-50 px-5 py-4 font-bold text-slate-700 outline-none transition-all focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">เลือกพนักงานขับรถ</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.fullname}</option>
                  ))}
                </select>
                {fetchingDrivers && <p className="text-xs text-slate-400">กำลังดึงข้อมูลพนักงานขับรถ...</p>}
              </div>
            </div>

            {allowTripMerge && tripBookings.length > 0 ? (
              <div className="flex min-h-0 flex-col rounded-3xl border border-slate-100 bg-slate-50/60 p-4">
                <label className="mb-3 ml-1 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <Plus className="mr-1 h-3 w-3" /> รวมใบขอรถในทริปเดียว
                </label>
                <div className="space-y-2 rounded-2xl border border-slate-100 bg-white/80 p-2">
                  {tripBookings.map((pendingBooking) => {
                    const isLocked = pendingBooking.locked;
                    const isSelected = isLocked || selectedOtherIds.includes(pendingBooking.id);
                    return (
                      <div
                        key={pendingBooking.id}
                        className={cn(
                          'flex items-start justify-between gap-3 rounded-xl border-2 p-3 transition-all',
                          isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-transparent bg-white text-slate-600 hover:border-slate-200'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                            checked={isSelected}
                            disabled={isLocked}
                            onChange={() => {
                              if (isLocked) return;
                              setSelectedOtherIds((current) =>
                                current.includes(pendingBooking.id)
                                  ? current.filter((item) => item !== pendingBooking.id)
                                  : [...current, pendingBooking.id]
                              );
                            }}
                          />
                          <div className="text-sm">
                            <div className="break-words font-bold">
                              #{pendingBooking.id} {pendingBooking.requester_name}
                              {isLocked && <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">หลัก</span>}
                            </div>
                            <div className="mt-1 break-words text-xs text-slate-500">{pendingBooking.destination}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {pendingBooking.trip_type_id ? tripTypeMap.get(pendingBooking.trip_type_id) || '-' : '-'}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right text-[11px] font-bold text-slate-400">
                          <div>{pendingBooking.start_time ? new Date(pendingBooking.start_time).toLocaleDateString('th-TH') : '-'}</div>
                          <div>{pendingBooking.start_time ? new Date(pendingBooking.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                          <div>{pendingBooking.passengers || 0} คน</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/40 p-6 text-sm text-slate-400">
                ไม่มีใบขอรถอื่นที่สามารถรวมในทริปนี้ได้
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black text-white shadow-2xl transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                บันทึกการจัดรถ {allowTripMerge ? `(${selectedOtherIds.length + 1} ใบขอ)` : ''}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
