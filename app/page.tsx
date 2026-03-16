import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { 
  Car, 
  Users as UsersIcon, 
  Clock, 
  MoreVertical,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import BookingCalendar from '@/components/BookingCalendar';

export default async function DashboardPage() {
  const [carRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM cars');
  const [userRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
  const [bookingRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
  
  const [allBookings] = await pool.query<RowDataPacket[]>(
    `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname 
     FROM bookings b 
     JOIN cars c ON b.car_id = c.id 
     JOIN users u ON b.user_id = u.id`
  );

  const stats = [
    { label: 'ยานพาหนะทั้งหมด', value: carRows[0].count, icon: Car, color: 'bg-indigo-600', trend: '+2 เดือนนี้' },
    { label: 'ผู้ใช้งานในระบบ', value: userRows[0].count, icon: UsersIcon, color: 'bg-emerald-500', trend: '12 ใช้งานวันนี้' },
    { label: 'รายการรออนุมัติ', value: bookingRows[0].count, icon: Clock, color: 'bg-amber-500', trend: 'ต้องดำเนินการ' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight text-nowrap">ภาพรวมระบบ</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 italic">ติดตามและจัดการการจองรถของหน่วยงานแบบเรียลไทม์</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/bookings/add" className="bg-[#5550e6] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 flex items-center hover:scale-105 active:scale-95 transition-all">
            <Plus className="mr-2 w-5 h-5" />
            สร้างการจองใหม่
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] rounded-bl-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.color} p-4 rounded-2xl shadow-lg shadow-current/20`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{stat.label}</div>
              <div className="text-5xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Calendar Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-900 flex items-center">
            <CalendarIcon className="mr-3 text-indigo-600 w-8 h-8" />
            ปฏิทินการจอง
          </h2>
        </div>
        <BookingCalendar bookings={allBookings.map((b: any) => ({
          id: b.id,
          fullname: b.fullname,
          brand: b.brand,
          model: b.model,
          start_time: b.start_time instanceof Date ? b.start_time.toISOString() : b.start_time,
          end_time: b.end_time instanceof Date ? b.end_time.toISOString() : b.end_time,
          destination: b.destination,
          status: b.status
        }))} />
      </section>

      {/* System Status Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <h2 className="text-xl font-black text-slate-900">รายการแจ้งเตือนล่าสุด</h2>
            <Link href="/bookings" className="text-indigo-600 text-sm font-black hover:underline underline-offset-4">ดูรายการทั้งหมด</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ผู้ขอใช้รถ</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ยานพาหนะ</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">กำหนดการ</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allBookings.slice(0, 5).map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-200">
                          {b.fullname.charAt(0)}
                        </div>
                        <span className="text-sm font-black text-slate-900">{b.fullname}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700">{b.brand} {b.model}</div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase">{b.license_plate}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-black text-slate-800">{new Date(b.start_time).toLocaleDateString('th-TH')}</div>
                      <div className="text-[11px] font-bold text-slate-400 italic">เวลา {new Date(b.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-black uppercase tracking-tight rounded-lg",
                        b.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                        b.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                        'bg-red-100 text-red-600'
                      )}>
                        {b.status === 'pending' ? 'รออนุมัติ' : 
                         b.status === 'approved' ? 'อนุมัติแล้ว' : 
                         b.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] h-fit">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
            สถานะระบบ
            <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                <span>การเชื่อมต่อ DB</span>
                <span className="text-emerald-500">เสถียร (99.9%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                <span>คิวการจองวันนี้</span>
                <span className="text-indigo-600">แน่น (78%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[78%]"></div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50 italic text-[11px] text-slate-400 font-bold text-center">
              อัปเดตล่าสุด: เมื่อครู่นี้
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

