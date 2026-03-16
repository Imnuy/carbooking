import pool from '@/lib/db';
import Link from 'next/link';
import { RowDataPacket } from 'mysql2';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ExportBookingDoc from '@/components/ExportBookingDoc';

export default async function BookingsPage() {
  const [bookings] = await pool.query<RowDataPacket[]>(
    `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname 
     FROM bookings b 
     JOIN cars c ON b.car_id = c.id 
     JOIN users u ON b.user_id = u.id 
     ORDER BY b.created_at DESC`
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-nowrap">จัดการใบจองรถ</h1>
          <p className="text-slate-500 font-medium">ตรวจสอบ อนุมัติ และติดตามการใช้รถยนต์ทั้งหมด</p>
        </div>
        <Link href="/bookings/add" className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-2xl shadow-indigo-900/20 flex items-center hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 group">
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          สร้างการจองใหม่
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['ทั้งหมด', 'รออนุมัติ', 'อนุมัติแล้ว', 'เสร็จสิ้น'].map((tab, i) => (
              <button key={i} className={cn(
                "whitespace-nowrap pb-2 text-sm font-black uppercase tracking-widest transition-all relative",
                i === 0 ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              )}>
                {tab}
                {i === 0 && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full"></span>}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาตามชื่อผู้ขอ..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">ผู้ขอใช้งาน</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">สถานที่และเหตุผล</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">ระยะเวลา</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">ไม่พบรายการจอง</h3>
                    <p className="text-slate-500 font-medium">รายการที่คุณบันทึกจะปรากฏที่นี่</p>
                  </td>
                </tr>
              ) : (
                bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3 text-nowrap">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                          {b.fullname.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{b.fullname}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">รหัสพนักงาน: 00{b.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                      <div className="flex items-center text-sm font-bold text-slate-800 mb-1">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                        <span className="truncate">{b.destination}</span>
                      </div>
                      <div className="text-xs text-slate-400 italic line-clamp-1">"{b.reason || 'ไม่ได้ระบุเหตุผล'}"</div>
                    </td>
                    <td className="px-8 py-6 text-nowrap">
                      <div className="text-sm font-black text-slate-800">{new Date(b.start_time).toLocaleDateString('th-TH')}</div>
                      <div className="text-[11px] font-bold text-slate-400">{new Date(b.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - {new Date(b.end_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                        b.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                        b.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                        b.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                        'bg-rose-100 text-rose-600'
                      )}>
                        {b.status === 'pending' ? 'รออนุมัติ' : 
                         b.status === 'approved' ? 'อนุมัติแล้ว' : 
                         b.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <ExportBookingDoc booking={b} />
                        <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="อนุมัติ">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="ปฏิเสธ">
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="เพิ่มเติม">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
