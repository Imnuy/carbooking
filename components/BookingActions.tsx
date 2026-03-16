'use client';

import { useState } from 'react';
import { 
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ExportBookingDoc from '@/components/ExportBookingDoc';
import AssignBookingModal from '@/components/AssignBookingModal';

interface BookingRowProps {
  booking: any;
  passengerCount: number;
  view: 'desktop' | 'mobile';
}

export default function BookingActions({ booking, passengerCount, view }: BookingRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (view === 'mobile') {
    return (
      <div className="flex space-x-2">
        {booking.status === 'approved' && <ExportBookingDoc booking={booking} />}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        <AssignBookingModal 
          booking={booking} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      {booking.status === 'approved' && <ExportBookingDoc booking={booking} />}
      <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="อนุมัติ">
        <CheckCircle2 className="w-5 h-5" />
      </button>
      <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="ปฏิเสธ">
        <XCircle className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" 
        title="เพิ่มเติม/จัดการรถ"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      <AssignBookingModal 
        booking={booking} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
