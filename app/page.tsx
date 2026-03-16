import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { 
  Car, 
  Users as UsersIcon, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
  const [carRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM cars');
  const [userRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
  const [bookingRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
  const [recentBookings] = await pool.query<RowDataPacket[]>(
    `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname 
     FROM bookings b 
     LEFT JOIN cars c ON b.car_id = c.id 
     JOIN users u ON b.user_id = u.id 
     ORDER BY b.created_at DESC LIMIT 5`
  );

  const stats = [
    { label: 'ยานพาหนะทั้งหมด', value: carRows[0].count, icon: Car, color: 'bg-indigo-600', trend: '+2 เดือนนี้' },
    { label: 'ผู้ใช้งานในระบบ', value: userRows[0].count, icon: UsersIcon, color: 'bg-emerald-500', trend: '12 ใช้งานวันนี้' },
    { label: 'รายการรออนุมัติ', value: bookingRows[0].count, icon: Clock, color: 'bg-amber-500', trend: 'ต้องดำเนินการ' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">ภาพรวมระบบ</h1>
          <p className="text-slate-500 font-medium">ติดตามและจัดการการขอใช้รถของหน่วยงาน</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/bookings" className="bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl flex items-center hover:bg-slate-800 transition-all w-full md:w-auto justify-center">
            จัดการการขอใช้รถ
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all group overflow-hidden relative">
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
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{stat.value}</div>
            </div>
            <div className="mt-6 flex items-center text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-50 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="px-6 md:px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">กิจกรรมล่าสุด</h2>
            <button className="text-indigo-600 text-sm font-bold hover:underline underline-offset-4">ดูทั้งหมด</button>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
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
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">ไม่พบรายการล่าสุด</td>
                  </tr>
                ) : (
                  recentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {(b.requester_name || b.fullname).charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{b.requester_name || b.fullname}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {b.car_id ? (
                          <>
                            <div className="text-sm font-medium text-slate-700">{b.brand} {b.model}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase">{b.license_plate}</div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-400 italic">รอจัดสรรรถ</div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-slate-800">{new Date(b.start_time).toLocaleDateString('th-TH')}</div>
                        <div className="text-[11px] font-medium text-slate-500 italic text-nowrap">เดินทางเที่ยวเดียว</div>
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-50">
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium italic">ไม่พบรายการล่าสุด</div>
            ) : (
              recentBookings.map((b: any) => (
                <div key={b.id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                        {(b.requester_name || b.fullname).charAt(0)}
                      </div>
                      <span className="text-sm font-black text-slate-900">{b.requester_name || b.fullname}</span>
                    </div>
                    <span className={cn(
                      "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg",
                      b.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                      b.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                      'bg-red-100 text-red-600'
                    )}>
                      {b.status === 'pending' ? 'รออนุมัติ' : 
                       b.status === 'approved' ? 'อนุมัติ' : 
                       b.status === 'completed' ? 'เสร๋จสิ้น' : 'ยกเลิก'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      {b.car_id ? (
                        <div className="text-xs font-bold text-slate-700">{b.brand} {b.model} ({b.license_plate})</div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">รอจัดสรรรถ</div>
                      )}
                      <div className="text-[10px] font-medium text-slate-500 mt-1">
                        {new Date(b.start_time).toLocaleDateString('th-TH')} • {new Date(b.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              ))
             )}
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full translate-x-8 -translate-y-8"></div>
            <h3 className="text-xl font-black mb-2">เมนูด่วน</h3>
            <p className="text-indigo-100 text-sm mb-6 font-medium leading-relaxed italic opacity-80">ตรวจสอบสถานะรถว่างและความพร้อมของยานพาหนะ</p>
            <Link href="/cars" className="bg-white text-indigo-600 w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center shadow-xl hover:scale-[1.02] transition-transform">
              ดูรถทั้งหมด
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
              สถานะระบบ
              <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>การเชื่อมต่อ DB</span>
                  <span className="text-emerald-500">ปกติ</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>พื้นที่จัดเก็บ</span>
                  <span className="text-slate-900">12% / 100GB</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[12%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
