'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  Loader2,
  MapPin,
  Plus,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MasterOption {
  id: number;
  name: string;
}

export default function AddBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<MasterOption[]>([]);
  const [tripTypes, setTripTypes] = useState<MasterOption[]>([]);
  const [fuelOptions, setFuelOptions] = useState<MasterOption[]>([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_position: '',
    supervisor_name: '',
    supervisor_position: '',
    department_id: '',
    destination: '',
    purpose: '',
    fuel_reimbursement_id: '',
    distance: '',
    trip_type_id: '',
    start_time: (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      d.setHours(8, 30, 0, 0);
      return d.toISOString().slice(0, 16);
    })(),
    end_time: (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      d.setHours(16, 30, 0, 0);
      return d.toISOString().slice(0, 16);
    })(),
  });

  useEffect(() => {
    const fetchMaster = (url: string, setter: (data: MasterOption[]) => void, autoSelectField?: string) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) return;
          const options = data.filter((item): item is MasterOption => typeof item?.id === 'number' && typeof item?.name === 'string');
          setter(options);
          if (autoSelectField && options.length > 0) {
            setFormData((current) => ({
              ...current,
              [autoSelectField]: current[autoSelectField as keyof typeof current] || String(options[0].id),
            }));
          }
        })
        .catch((error) => console.error(`Failed to load ${url}:`, error));
    };

    fetchMaster('/api/departments', setDepartments);
    fetchMaster('/api/trip-types', setTripTypes, 'trip_type_id');
    fetchMaster('/api/fuel-reimbursements', setFuelOptions, 'fuel_reimbursement_id');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          department_id: Number(formData.department_id),
          trip_type_id: Number(formData.trip_type_id),
          fuel_reimbursement_id: Number(formData.fuel_reimbursement_id),
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
    <div className="mx-auto max-w-5xl animate-in slide-in-from-bottom-4 space-y-6 pb-20 duration-500 md:space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] md:rounded-[2.5rem] md:p-10">
          <div className="mb-6 flex items-center space-x-3 md:mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 md:h-10 md:w-10 md:rounded-xl">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <h2 className="text-lg font-black text-slate-800 md:text-xl">ข้อมูลผู้ขอและหน่วยงาน</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <Building2 className="mr-1 h-3 w-3" /> หน่วยงาน / แผนก
              </label>
              <select
                required
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              >
                <option value="">เลือกหน่วยงาน</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <User className="mr-1 h-3 w-3" /> ชื่อ-นามสกุล ผู้ขอ
              </label>
              <input
                required
                type="text"
                value={formData.requester_name}
                onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <Briefcase className="mr-1 h-3 w-3" /> ตำแหน่ง ผู้ขอ
              </label>
              <input
                required
                type="text"
                value={formData.requester_position}
                onChange={(e) => setFormData({ ...formData, requester_position: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <User className="mr-1 h-3 w-3" /> ชื่อ-นามสกุล ผู้ควบคุมรถ
              </label>
              <input
                required
                type="text"
                value={formData.supervisor_name}
                onChange={(e) => setFormData({ ...formData, supervisor_name: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <Briefcase className="mr-1 h-3 w-3" /> ตำแหน่ง ผู้ควบคุมรถ
              </label>
              <input
                required
                type="text"
                value={formData.supervisor_position}
                onChange={(e) => setFormData({ ...formData, supervisor_position: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] md:rounded-[2.5rem] md:p-10">
          <div className="mb-6 flex items-center space-x-3 md:mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 md:h-10 md:w-10 md:rounded-xl">
              <MapPin className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <h2 className="text-lg font-black text-slate-800 md:text-xl">รายละเอียดการเดินทาง</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-4 md:col-span-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">ประเภทการเดินทาง</label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {tripTypes.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, trip_type_id: String(item.id) })}
                    className={cn(
                      'flex items-center justify-between rounded-2xl border-2 px-4 py-4 text-xs font-black transition-all md:px-8 md:py-5 md:text-sm',
                      formData.trip_type_id === String(item.id)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                    )}
                  >
                    <span>{index + 1}. {item.name}</span>
                    {formData.trip_type_id === String(item.id) && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">สถานที่/เส้นทาง</label>
              <input
                required
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">วัตถุประสงค์การเดินทาง</label>
              <textarea
                required
                rows={3}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full resize-none rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">บริการเบิกค่าน้ำมัน</label>
              <select
                required
                value={formData.fuel_reimbursement_id}
                onChange={(e) => setFormData({ ...formData, fuel_reimbursement_id: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              >
                <option value="">เลือกบริการเบิกค่าน้ำมัน</option>
                {fuelOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">ระยะทางประมาณ (กม.)</label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <Users className="mr-1 h-3 w-3" /> จำนวนผู้โดยสาร
              </label>
              <input
                required
                type="number"
                min="1"
                max="50"
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <Calendar className="mr-1 h-3 w-3" /> วันเดินทางไป
              </label>
              <input
                required
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 md:text-[11px]">
                <Calendar className="mr-1 h-3 w-3" /> วันเดินทางกลับ
              </label>
              <input
                required
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition-all focus:ring-2 focus:ring-indigo-600 md:rounded-2xl md:px-6 md:py-4 md:text-base"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-end gap-4 md:flex-row md:space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="order-1 flex w-full items-center justify-center rounded-2xl bg-slate-900 px-10 py-4 text-sm font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 md:order-2 md:w-auto"
          >
            {loading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Plus className="mr-3 h-5 w-5" />}
            ยืนยันการบันทึกใบขอรถ
          </button>
          <Link
            href="/bookings"
            className="order-2 w-full px-8 py-4 text-center text-sm font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900 md:order-1 md:w-auto"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}
