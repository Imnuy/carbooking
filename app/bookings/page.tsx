"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Loader2,
  User,
  Car as CarIcon,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ExportBookingDoc from '@/components/ExportBookingDoc';

export default function BookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  
  // Selection for approval
  const [selectingDriver, setSelectingDriver] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [bookingsRes, driversRes, authRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/drivers'),
        fetch('/api/auth')
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (driversRes.ok) setDrivers(await driversRes.json());
      if (authRes.ok) {
        const authData = await authRes.json();
        setUser(authData.user);
      }
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId: number, status: string, driverId?: number) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, driver_id: driverId })
      });

      if (res.ok) {
        setSelectingDriver(null);
        fetchData();
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    } catch (err) {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const fullName = b.fullname || '';
    const destination = b.destination || '';
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase()) || 
                         destination.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'ทั้งหมด') return matchesSearch;
    if (activeTab === 'รออนุมัติ') return matchesSearch && b.status === 'pending';
    if (activeTab === 'อนุมัติแล้ว') return matchesSearch && b.status === 'approved';
    if (activeTab === 'เสร็จสิ้น') return matchesSearch && b.status === 'completed';
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="font-bold text-slate-400 animate-pulse">กำลังโหลดข้อมูลการจอง...</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">จัดการใบจองรถ</h1>
          <p className="text-slate-500 font-medium italic">ตรวจสอบ อนุมัติ และติดตามการใช้รถยนต์ทั้งหมด</p>
        </div>
        <Link href="/bookings/add" className="bg-[#5550e6] text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 flex items-center hover:scale-105 active:scale-95 transition-all group">
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          สร้างการจองใหม่
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['ทั้งหมด', 'รออนุมัติ', 'อนุมัติแล้ว', 'เสร็จสิ้น'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "whitespace-nowrap pb-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
                  activeTab === tab ? "text-[#5550e6]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#5550e6] rounded-full"></span>}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาตามชื่อผู้ขอ, ปลายทาง..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#5550e6] transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ผู้ขอใช้งาน</th>
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">สถานที่และเหตุผล</th>
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ระยะเวลา</th>
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">สถานะ</th>
                <th className="px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[15px]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="p-8 bg-slate-50 rounded-full inline-block mb-4">
                      <Calendar className="w-12 h-12 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">ไม่พบรายการจอง</h3>
                    <p className="text-slate-400 font-bold italic">รายการที่บันทึกไว้จะแสดงที่นี่</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5550e6] font-black text-lg shadow-sm">
                          {(b.fullname || '').charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900">{b.fullname}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Booking ID: #{b.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 max-w-[280px]">
                      <div className="flex items-center font-bold text-slate-700 mb-1.5">
                        <MapPin className="w-4 h-4 mr-2 text-rose-500" />
                        <span className="truncate">{b.destination}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-400 italic line-clamp-1 border-l-2 border-slate-100 pl-3">"{b.reason || 'ไม่ได้ระบุเหตุผล'}"</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-800">{new Date(b.start_time).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}</div>
                      <div className="text-[11px] font-bold text-slate-400 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(b.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - {new Date(b.end_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={cn(
                        "inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border",
                        b.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        b.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        b.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      )}>
                        <span className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          b.status === 'pending' ? 'bg-amber-500 animate-pulse' : 
                          b.status === 'approved' ? 'bg-emerald-500' : 
                          b.status === 'completed' ? 'bg-blue-500' : 'bg-rose-500'
                        )}></span>
                        {b.status === 'pending' ? 'รออนุมัติ' : 
                         b.status === 'approved' ? 'อนุมัติแล้ว' : 
                         b.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <ExportBookingDoc booking={b} />
                        {isAdmin && b.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => setSelectingDriver(b)}
                              className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-xl transition-all shadow-sm" 
                              title="อนุมัติการจอง"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(b.id, 'rejected')}
                              className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-xl transition-all shadow-sm" 
                              title="ปฏิเสธการจอง"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Selection Modal */}
      {selectingDriver && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#5550e6] rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">อนุมัติการจองและมอบหมายงาน</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Booking ID: #{selectingDriver.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectingDriver(null)}
                className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ผู้ขอใช้รถ</div>
                  <div className="font-black text-slate-800 flex items-center">
                    <User className="w-3.5 h-3.5 mr-2 text-[#5550e6]" />
                    {selectingDriver.fullname}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รถยนต์ที่เลือก</div>
                  <div className="font-black text-slate-800 flex items-center">
                    <CarIcon className="w-3.5 h-3.5 mr-2 text-rose-500" />
                    {selectingDriver.brand} {selectingDriver.model}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 block">เลือกพนักงานขับรถมประจำการจองนี้</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drivers.filter(d => d.status === 'available').length === 0 ? (
                    <div className="col-span-2 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600 text-center font-bold text-sm">
                      ⚠️ ขณะนี้ไม่มีพนักงานขับรถพร้อมปฏิบัติงาน
                    </div>
                  ) : (
                    drivers.filter(d => d.status === 'available').map(driver => (
                      <button 
                        key={driver.id}
                        onClick={() => handleUpdateStatus(selectingDriver.id, 'approved', driver.id)}
                        disabled={submitting}
                        className="flex items-center p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#5550e6] hover:bg-indigo-50/50 transition-all text-left group shadow-sm hover:shadow-lg disabled:opacity-50"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform overflow-hidden">
                          {driver.image_url ? (
                            <img src={driver.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 leading-tight">{driver.fullname}</div>
                          <div className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5 tracking-wider">ว่างพร้อมงาน</div>
                        </div>
                      </button>
                    ))
                  )}
                  <button 
                    onClick={() => handleUpdateStatus(selectingDriver.id, 'approved')}
                    disabled={submitting}
                    className="col-span-1 md:col-span-2 p-5 bg-slate-50 border border-slate-200 border-dashed rounded-2xl hover:bg-slate-100 transition-all text-center font-bold text-slate-500 text-sm hover:text-slate-900 disabled:opacity-50"
                  >
                    อนุมัติโดยไม่ต้องระบุพนักงาน (ขับเอง)
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-widest italic">การอนุมัติจะส่งผลทันทีในปฏิทินรายการจอง</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
