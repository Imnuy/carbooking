'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Car, Check, Loader2, Plus, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const EMPTY_OTHER_IDS: number[] = [];

interface AssignModalProps {
  booking: {
    id: number;
    trip_id?: number | null;
    requester_name: string;
    destination: string;
    trip_type?: string;
    start_time?: string;
    car_id: number | null;
    driver_id?: number | null;
    driver_name: string | null;
    status_code: string;
  };
  isOpen: boolean;
  onClose: () => void;
  initialOtherIds?: number[];
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

interface PendingBooking {
  id: number;
  trip_id?: number | null;
  requester_name: string;
  destination: string;
  start_time: string;
  end_time: string;
  trip_type: string;
  passengers: number;
}

export default function AssignBookingModal({
  booking,
  isOpen,
  onClose,
  initialOtherIds,
  allowTripMerge = false,
}: AssignModalProps) {
  const router = useRouter();
  const otherIdsKey = (initialOtherIds ?? EMPTY_OTHER_IDS).join(',');
  const [loading, setLoading] = useState(false);
  const [fetchingCars, setFetchingCars] = useState(false);
  const [fetchingDrivers, setFetchingDrivers] = useState(false);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [selectedOtherIds, setSelectedOtherIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    car_id: booking.car_id ? String(booking.car_id) : '',
    driver_id: booking.driver_id ? String(booking.driver_id) : '',
  });

  const getBookingDateKey = (startTime?: string) => {
    if (!startTime) {
      return '';
    }

    const date = new Date(startTime);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (!isOpen) return;

    const currentBookingDateKey = getBookingDateKey(booking.start_time);
    const parsedOtherIds = allowTripMerge && otherIdsKey
      ? otherIdsKey.split(',').map((value) => Number(value)).filter((value) => Number.isFinite(value))
      : [];

    setFormData({
      car_id: booking.car_id ? String(booking.car_id) : '',
      driver_id: booking.driver_id ? String(booking.driver_id) : '',
    });
    setSelectedOtherIds(parsedOtherIds);

    setFetchingCars(true);
    fetch('/api/cars/available')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCars(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setFetchingCars(false));

    setFetchingDrivers(true);
    fetch('/api/drivers/active')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDrivers(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setFetchingDrivers(false));

    fetch('/api/bookings/pending')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setPendingBookings(
          data.filter((item: PendingBooking) =>
            item.id !== booking.id &&
            (!allowTripMerge || getBookingDateKey(item.start_time) === currentBookingDateKey)
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, [allowTripMerge, booking.id, booking.car_id, booking.driver_id, booking.start_time, isOpen, otherIdsKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedDriver = drivers.find((driver) => String(driver.id) === formData.driver_id);
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: formData.car_id ? Number(formData.car_id) : null,
          driver_id: formData.driver_id ? Number(formData.driver_id) : null,
          driver_name: selectedDriver?.fullname || '',
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">จัดรถและพนักงานขับรถ</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                ทริป {booking.trip_id ? `#${booking.trip_id}` : 'ใหม่'} • ใบขอใช้รถ #{booking.id} {booking.requester_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-white hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                <Car className="mr-1 h-3 w-3" /> รถที่ต้องการจัดสรร
              </label>
              <select
                required
                value={formData.car_id}
                onChange={(e) => setFormData((current) => ({ ...current, car_id: e.target.value }))}
                className="w-full rounded-2xl bg-slate-50 px-5 py-4 font-bold text-slate-700 outline-none ring-0 transition-all focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">เลือกรถ</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model} ({car.license_plate})
                  </option>
                ))}
              </select>
              {fetchingCars && <p className="text-xs text-slate-400">กำลังดึงข้อมูลรถที่พร้อมใช้งาน...</p>}
            </div>

            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                <User className="mr-1 h-3 w-3" /> พนักงานขับรถ
              </label>
              <select
                required
                value={formData.driver_id}
                onChange={(e) => setFormData((current) => ({ ...current, driver_id: e.target.value }))}
                className="w-full rounded-2xl bg-slate-50 px-5 py-4 font-bold text-slate-700 outline-none ring-0 transition-all focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">เลือกพนักงานขับรถ</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.fullname}
                  </option>
                ))}
              </select>
              {fetchingDrivers && <p className="text-xs text-slate-400">กำลังดึงข้อมูลพนักงานขับรถ...</p>}
            </div>
          </div>

          {allowTripMerge && pendingBookings.length > 0 && (
            <div className="space-y-3">
              <label className="ml-1 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                <Plus className="mr-1 h-3 w-3" /> เพิ่มใบขอใช้รถอื่นในทริปเดียวกัน
              </label>
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-2">
                {pendingBookings.map((pendingBooking) => (
                  <div
                    key={pendingBooking.id}
                    className={cn(
                      'flex items-center justify-between rounded-xl border-2 p-3 transition-all',
                      selectedOtherIds.includes(pendingBooking.id)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-transparent bg-white text-slate-600 hover:border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                        checked={selectedOtherIds.includes(pendingBooking.id)}
                        onChange={() => {
                          setSelectedOtherIds((current) =>
                            current.includes(pendingBooking.id)
                              ? current.filter((id) => id !== pendingBooking.id)
                              : [...current, pendingBooking.id]
                          );
                        }}
                      />
                      <div className="text-sm">
                        <div className="font-bold">
                          #{pendingBooking.id} {pendingBooking.requester_name}
                        </div>
                        <div className="truncate text-xs text-slate-500">
                          {pendingBooking.destination} • {pendingBooking.trip_type === 'external' ? 'ต่างจังหวัด' : 'ในจังหวัด'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-bold text-slate-400">
                      <div>{new Date(pendingBooking.start_time).toLocaleDateString('th-TH')}</div>
                      <div>{pendingBooking.passengers || 0} คน</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
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
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Check className="mr-2 h-5 w-5" />
                )}
                บันทึกการจัดรถ {allowTripMerge && selectedOtherIds.length > 0 ? `(${selectedOtherIds.length + 1} รายการ)` : ''}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
