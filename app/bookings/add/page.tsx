'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  ArrowLeft, 
  Calendar, 
  Loader2, 
  Users, 
  User, 
  Briefcase, 
  MapPin, 
  Gauge, 
  Compass,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AddBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_position: '',
    supervisor_name: '',
    supervisor_position: '',
    destination: '',
    purpose: '',
    fuel_reimbursement: 'หน่วยงานต้นสังกัด',
    distance: '',
    trip_type: 'internal',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Store as an array of empty objects to maintain compatibility with existing display logic
    // Or store as {"count": N}
    const passengersData = JSON.stringify(new Array(passengerCount).fill({}));
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          passengers: passengersData
        })
      });

      if (response.ok) {
        router.push('/bookings');
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Link href="/bookings" className="p-2 md:p-3 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">สร้างใบขอใช้รถใหม่</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium italic">ระบุรายละเอียดการขอใช้งานและจำนวนผู้โดยสาร</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Section 1: Requester & Supervisor */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-600">
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">ข้อมูลผู้ขอและผู้ควบคุม</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <User className="w-3 h-3 mr-1" /> ชื่อนาม-สกุล ผู้ขอ
              </label>
              <input 
                required
                type="text" 
                value={formData.requester_name}
                onChange={(e) => setFormData({...formData, requester_name: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
                placeholder="ระบุชื่อ-นามสกุล..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Briefcase className="w-3 h-3 mr-1" /> ตำแหน่ง ผู้ขอ
              </label>
              <input 
                required
                type="text" 
                value={formData.requester_position}
                onChange={(e) => setFormData({...formData, requester_position: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
                placeholder="ระบุตำแหน่ง..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <User className="w-3 h-3 mr-1" /> ชื่อนาม-สกุล ผู้ควบคุมรถ
              </label>
              <input 
                required
                type="text" 
                value={formData.supervisor_name}
                onChange={(e) => setFormData({...formData, supervisor_name: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
                placeholder="ระบุชื่อ-นามสกุล..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Briefcase className="w-3 h-3 mr-1" /> ตำแหน่ง ผู้ควบคุมรถ
              </label>
              <input 
                required
                type="text" 
                value={formData.supervisor_position}
                onChange={(e) => setFormData({...formData, supervisor_position: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
                placeholder="ระบุตำแหน่ง..." 
              />
            </div>
          </div>
        </div>

        {/* Section 2: Destination & Time */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-50 rounded-lg md:rounded-xl flex items-center justify-center text-rose-600">
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-800">รายละเอียดการเดินทาง</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Compass className="w-3 h-3 mr-1" /> ประเภทการเดินทาง
              </label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, trip_type: 'internal'})}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center md:justify-between px-4 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl border-2 transition-all font-black text-xs md:text-sm gap-2 text-center md:text-left",
                    formData.trip_type === 'internal' 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                      : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                  )}
                >
                  <span>1. ภายในจังหวัด</span>
                  {formData.trip_type === 'internal' && <Check className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, trip_type: 'external'})}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center md:justify-between px-4 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl border-2 transition-all font-black text-xs md:text-sm gap-2 text-center md:text-left",
                    formData.trip_type === 'external' 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                      : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                  )}
                >
                  <span>2. ต่างจังหวัด</span>
                  {formData.trip_type === 'external' && <Check className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">สถานที่ปลายทาง</label>
              <input 
                required
                type="text" 
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
                placeholder="ระบุสถานที่..." 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">วัตถุประสงค์การไป</label>
              <textarea 
                required
                rows={3}
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base resize-none" 
                placeholder="ระบุวัตถุประสงค์การเดินทาง..." 
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Gauge className="w-3 h-3 mr-1" /> การเบิกค่าเชื้อเพลิง
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, fuel_reimbursement: 'หน่วยงานต้นสังกัด'})}
                  className={cn(
                    "flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm",
                    formData.fuel_reimbursement === 'หน่วยงานต้นสังกัด' 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-900/5" 
                      : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                  )}
                >
                  <span>เบิกจากหน่วยงานต้นสังกัด</span>
                  {formData.fuel_reimbursement === 'หน่วยงานต้นสังกัด' && <Check className="w-4 h-4" />}
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, fuel_reimbursement: 'หน่วยงานผู้จัด'})}
                  className={cn(
                    "flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm",
                    formData.fuel_reimbursement === 'หน่วยงานผู้จัด' 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-900/5" 
                      : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                  )}
                >
                  <span>เบิกจากหน่วยงานผู้จัด</span>
                  {formData.fuel_reimbursement === 'หน่วยงานผู้จัด' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Gauge className="w-3 h-3 mr-1" /> ระยะทางโดยประมาณ (กม.)
              </label>
              <input 
                required
                type="number" 
                step="0.01"
                value={formData.distance}
                onChange={(e) => setFormData({...formData, distance: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
                placeholder="ระบุระยะทาง..." 
              />
            </div>
            <div className="hidden md:block"></div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> วันเดินทางไป
              </label>
              <input 
                required
                type="datetime-local" 
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> วันเดินทางกลับ
              </label>
              <input 
                required
                type="datetime-local" 
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 text-sm md:text-base" 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Passenger Count */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-800">จำนวนผู้โดยสาร</h2>
          </div>

          <div className="max-w-xs space-y-4">
            <div className="flex items-center space-x-4">
              <input 
                required
                type="number" 
                min="1"
                max="50"
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                className="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 transition-all font-bold text-2xl text-emerald-700 text-center" 
              />
              <span className="text-xl font-bold text-slate-500">คน</span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase italic ml-2">
              * กรุณาระบุจำนวนผู้ร่วมเดินทางทั้งหมด (ไม่รวมพนักงานขับรถ)
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-end gap-4 md:space-x-4">
          <button 
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 md:py-4.5 rounded-2xl font-black text-sm shadow-2xl flex items-center justify-center group disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all order-1 md:order-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
            )}
            ยืนยันการบันทึกใบขอใช้รถ
          </button>
          <Link href="/bookings" className="w-full md:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors text-center order-2 md:order-1">ยกเลิก</Link>
        </div>
      </form>
    </div>
  );
}
