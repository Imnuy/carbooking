"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, Calendar, Car, MapPin, MessageSquare, User, Loader2 } from 'lucide-react';

export default function AddBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [cars, setCars] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    user_id: '',
    car_id: '',
    destination: '',
    start_time: '',
    end_time: '',
    reason: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, usersRes] = await Promise.all([
          fetch('/api/cars'),
          // Assuming we might have a users API or we just fetch from DB indirectly
          // For now, let's try to fetch cars and if no users API, we'll use a placeholder or check if it exists
          fetch('/api/users').catch(() => null)
        ]);

        if (carsRes.ok) {
          const carsData = await carsRes.json();
          setCars(carsData.filter((c: any) => c.status === 'available'));
        }

        if (usersRes && usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        } else {
          // Fallback if no users API yet - for demo purposes we might need current user
          setUsers([{ id: 1, fullname: 'Admin User' }]);
          setFormData(prev => ({ ...prev, user_id: '1' }));
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.car_id || !formData.user_id) {
      alert('กรุณาเลือกรถและรายชื่อผู้ดูแล');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/bookings');
        router.refresh();
      } else {
        const err = await res.json();
        alert('เกิดข้อผิดพลาด: ' + err.error);
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="font-bold text-slate-400 animate-pulse">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/bookings" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">สร้างการจองรถใหม่</h1>
            <p className="text-slate-500 font-medium italic">บันทึกความประสงค์การใช้ยานพาหนะของส่วนกลาง</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
              <User className="w-3 h-3 mr-1" /> ผู้ขอใช้งาน
            </label>
            <select 
              required
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none shadow-inner"
            >
              <option value="">เลือกผู้ใช้งาน</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullname}</option>
              ))}
            </select>
          </div>

          {/* Car Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
              <Car className="w-3 h-3 mr-1" /> เลือกรถยนต์ (เฉพาะรถที่ว่าง)
            </label>
            <select 
              required
              name="car_id"
              value={formData.car_id}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none shadow-inner"
            >
              <option value="">เลือกรถยนต์</option>
              {cars.map(c => (
                <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.license_plate})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> สถานที่ปลายทาง
            </label>
            <input 
              required
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              type="text" 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner" 
              placeholder="ระบุสถานที่..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> วันที่และเวลาเริ่มต้น
            </label>
            <input 
              required
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              type="datetime-local" 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 shadow-inner" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> วันที่และเวลาสิ้นสุด
            </label>
            <input 
              required
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              type="datetime-local" 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 shadow-inner" 
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
              <MessageSquare className="w-3 h-3 mr-1" /> เหตุผลการขอใช้รถ
            </label>
            <textarea 
              required
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4} 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner resize-none" 
              placeholder="ระบุวัตถุประสงค์โดยสังเขป..."
            ></textarea>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-end space-x-4">
          <Link href="/bookings" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
          <button 
            disabled={loading}
            type="submit"
            className="bg-[#5550e6] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />}
            ยืนยันการขอจอง
          </button>
        </div>
      </form>
    </div>
  );
}
