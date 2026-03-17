'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditBookingFormProps {
  booking: {
    id: number;
    requester_name?: string | null;
    requester_position?: string | null;
    supervisor_name?: string | null;
    supervisor_position?: string | null;
    destination: string;
    purpose?: string | null;
    fuel_reimbursement?: string | null;
    distance?: number | null;
    trip_type: 'internal' | 'external';
    start_time: string;
    end_time: string;
    passengers?: number | null;
    status_code?: string | null;
  };
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function EditBookingForm({ booking }: EditBookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passengerCount, setPassengerCount] = useState(booking.passengers || 1);
  const [formData, setFormData] = useState({
    requester_name: booking.requester_name || '',
    requester_position: booking.requester_position || '',
    supervisor_name: booking.supervisor_name || '',
    supervisor_position: booking.supervisor_position || '',
    destination: booking.destination || '',
    purpose: booking.purpose || '',
    fuel_reimbursement: booking.fuel_reimbursement || 'หน่วยงานต้นสังกัด',
    distance: booking.distance?.toString() || '',
    trip_type: booking.trip_type || 'internal',
    start_time: toDateTimeLocal(booking.start_time),
    end_time: toDateTimeLocal(booking.end_time),
    status_code: booking.status_code || '001',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          passengers: passengerCount,
        }),
      });

      if (response.ok) {
        router.push('/bookings');
        router.refresh();
      } else {
        const result = await response.json().catch(() => null);
        alert(result?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อนาม-สกุล ผู้ขอ</label>
              <input required type="text" value={formData.requester_name} onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ตำแหน่ง ผู้ขอ</label>
              <input required type="text" value={formData.requester_position} onChange={(e) => setFormData({ ...formData, requester_position: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อนาม-สกุล ผู้ควบคุมรถ</label>
              <input required type="text" value={formData.supervisor_name} onChange={(e) => setFormData({ ...formData, supervisor_name: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ตำแหน่ง ผู้ควบคุมรถ</label>
              <input required type="text" value={formData.supervisor_position} onChange={(e) => setFormData({ ...formData, supervisor_position: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ประเภทการเดินทาง</label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button type="button" onClick={() => setFormData({ ...formData, trip_type: 'internal' })} className={cn("relative flex items-center justify-between px-4 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl border-2 transition-all font-black text-xs md:text-sm", formData.trip_type === 'internal' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200')}>
                  <span>1. ภายในจังหวัด</span>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, trip_type: 'external' })} className={cn("relative flex items-center justify-between px-4 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl border-2 transition-all font-black text-xs md:text-sm", formData.trip_type === 'external' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200')}>
                  <span>2. ต่างจังหวัด</span>
                </button>
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">สถานที่ปลายทาง</label>
              <input required type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">วัตถุประสงค์การไป</label>
              <textarea required rows={3} value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">การเบิกค่าเชื้อเพลิง</label>
              <select value={formData.fuel_reimbursement} onChange={(e) => setFormData({ ...formData, fuel_reimbursement: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base">
                <option value="หน่วยงานต้นสังกัด">เบิกจากหน่วยงานต้นสังกัด</option>
                <option value="หน่วยงานผู้จัด">เบิกจากหน่วยงานผู้จัด</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">สถานะใบขอ</label>
              <select value={formData.status_code} onChange={(e) => setFormData({ ...formData, status_code: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base">
                <option value="001">รอจัดรถ</option>
                <option value="002">จัดรถแล้ว</option>
                <option value="003">ยกเลิก</option>
                <option value="004">เสร็จสิ้น</option>
                <option value="005">ยกเลิกคำขอ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ระยะทางโดยประมาณ (กม.)</label>
              <input required type="number" step="0.01" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">จำนวนผู้โดยสาร</label>
              <input required type="number" min="1" max="50" value={passengerCount} onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">วันเดินทางไป</label>
              <input required type="datetime-local" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">วันเดินทางกลับ</label>
              <input required type="datetime-local" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-end gap-4 md:space-x-4">
          <button type="submit" disabled={loading} className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center justify-center group disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all order-1 md:order-2">
            {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
            บันทึกการแก้ไขใบขอใช้รถ
          </button>
          <Link href="/bookings" className="w-full md:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors text-center order-2 md:order-1">ยกเลิก</Link>
        </div>
      </form>
    </div>
  );
}
