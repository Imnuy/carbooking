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
  Trash2, 
  UserPlus,
  Compass,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Passenger {
  name: string;
  position: string;
}

export default function AddBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: '', position: '' }
  ]);
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_position: '',
    supervisor_name: '',
    supervisor_position: '',
    destination: '',
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

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', position: '' }]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const newPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(newPassengers);
    }
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Clean up empty rows before sending
    const validPassengers = passengers.filter(p => p.name.trim() || p.position.trim());
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          passengers: JSON.stringify(validPassengers)
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
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">สร้างใบขอใช้รถใหม่</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium italic">ระบุรายละเอียดการขอใช้งานและพนักงานผู้ร่วมเดินทาง</p>
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
            <h2 className="text-lg md:text-xl font-black text-slate-800">ข้อมูลผู้ขอและผู้ควบคุม</h2>
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
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
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

        {/* Section 3: Passengers Data Grid */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600">
                <Users className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-800">รายชื่อผู้ร่วมเดินทาง</h2>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl md:rounded-3xl">
            <table className="min-w-full divide-y divide-slate-100 border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">ลำดับ</th>
                  <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อ-นามสกุล</th>
                  <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">ตำแหน่ง</th>
                  <th className="px-4 md:px-6 py-4 text-center text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">ลบ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {passengers.map((passenger, index) => (
                  <tr key={index} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-4 md:px-6 py-2">
                      <input 
                        type="text" 
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                        placeholder="ระบุชื่อ..."
                        className="w-full bg-transparent border-none focus:ring-0 text-xs md:text-sm font-bold text-slate-700 placeholder:text-slate-300"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-2">
                      <input 
                        type="text" 
                        value={passenger.position}
                        onChange={(e) => updatePassenger(index, 'position', e.target.value)}
                        placeholder="ตำแหน่ง..."
                        className="w-full bg-transparent border-none focus:ring-0 text-xs md:text-sm font-bold text-slate-700 placeholder:text-slate-300"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-2 text-center">
                      <button 
                        type="button"
                        onClick={() => removePassenger(index)}
                        disabled={passengers.length === 1}
                        className="p-2 md:p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg md:rounded-xl transition-all disabled:opacity-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-center">
             <button 
              type="button" 
              onClick={addPassenger}
              className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              เพิ่มรายชื่อ
            </button>
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
