'use client';

import { useState } from 'react';
import { Car, Edit3, Loader2, Settings2, Trash2 } from 'lucide-react';
import AssignBookingModal from '@/components/AssignBookingModal';
import { BOOKING_STATUS } from '@/lib/booking-flow';
import { useRouter } from 'next/navigation';
import { confirmDelete, showError, showSuccess } from '@/lib/swal';

interface BookingRow {
  id: number;
  trip_id?: number | null;
  requester_name?: string;
  destination: string;
  trip_type: 'internal' | 'external';
  start_time?: string;
  car_id?: number | null;
  driver_id?: number | null;
  driver_name?: string | null;
  status_code: string;
}

interface BookingRowProps {
  booking: BookingRow;
  view: 'desktop' | 'mobile';
}

export default function BookingActions({ booking, view }: BookingRowProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAssigned = booking.status_code === BOOKING_STATUS.assigned;
  const modalBooking = {
    ...booking,
    requester_name: booking.requester_name || '',
    trip_id: booking.trip_id ?? null,
    car_id: booking.car_id ?? null,
    driver_id: booking.driver_id ?? null,
    driver_name: booking.driver_name ?? null,
  };

  const handleDelete = async () => {
    const confirmed = await confirmDelete('ยืนยันการลบใบขอใช้รถ', `เลขที่ ${booking.id}`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await showSuccess('ลบใบขอใช้รถเรียบร้อยแล้ว');
        router.refresh();
      } else {
        const result = await response.json().catch(() => null);
        await showError(result?.error || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error(error);
      await showError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={view === 'mobile' ? 'flex space-x-2' : 'flex items-center justify-end space-x-2'}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        title={isAssigned ? 'แก้ไขการจัดรถ' : 'จัดรถและคนขับ'}
      >
        {isAssigned ? <Settings2 className="h-4 w-4" /> : <Car className="h-4 w-4" />}
        <span className="sr-only">{isAssigned ? 'Manage trip' : 'Assign trip'}</span>
      </button>
      <button
        onClick={() => router.push(`/bookings/${booking.id}/edit`)}
        className="flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        title="แก้ไขใบขอใช้รถ"
      >
        <Edit3 className="h-4 w-4" />
        <span className="sr-only">Edit booking</span>
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
        title="ลบใบขอใช้รถ"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        <span className="sr-only">Delete booking</span>
      </button>
      <AssignBookingModal
        booking={modalBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allowTripMerge={false}
      />
    </div>
  );
}
