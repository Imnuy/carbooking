import pool from '@/lib/db';
import Link from 'next/link';
import { RowDataPacket } from 'mysql2';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar,
  Users,
  UserCheck,
  Car,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import BookingActions from '@/components/BookingActions';

export default async function BookingsPage() {
  const [bookings] = await pool.query<RowDataPacket[]>(
    `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname as owner_name 
     FROM bookings b 
     LEFT JOIN cars c ON b.car_id = c.id 
     JOIN users u ON b.user_id = u.id 
     ORDER BY b.created_at DESC`
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">จัดการใบขอใช้รถ</h1>
          <p className="text-slate-500 font-medium tracking-tight">ตรวจสอบ อนุมัติ และติดตามการใช้รถยนต์ทั้งหมด</p>
        </div>
        <Link href="/bookings/add" className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-2xl shadow-indigo-900/20 flex items-center hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 group justify-center">
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          สร้างใบขอใช้รถใหม่
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex space-x-6 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
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
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">ผู้ขอใช้งาน</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">สถานที่และผู้ร่วมเดินทาง</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">รถและคนขับ</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">ระยะเวลา</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">ไม่พบรายการขอใช้รถ</h3>
                    <p className="text-slate-500 font-medium">รายการที่คุณบันทึกจะปรากฏที่นี่</p>
                  </td>
                </tr>
              ) : (
                bookings.map((b: any) => {
                  let passengerCount = 0;
                  try {
                    const parsed = JSON.parse(b.passengers);
                    if (Array.isArray(parsed)) {
                      passengerCount = parsed.length;
                    } else if (b.passengers) {
                      passengerCount = b.passengers.split(/[,\n]/).filter((n: string) => n.trim()).length;
                    }
                  } catch (e) {
                    passengerCount = b.passengers ? b.passengers.split(/[,\n]/).filter((n: string) => n.trim()).length : 0;
                  }
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3 text-nowrap">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                            {(b.requester_name || b.owner_name).charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{b.requester_name || b.owner_name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{b.requester_position || 'ไม่ระบุตำแหน่ง'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <div className="flex items-center text-sm font-bold text-slate-800 mb-1">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                          <span className="truncate mr-2">{b.destination}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter shrink-0",
                            b.trip_type === 'external' ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500"
                          )}>
                            {b.trip_type === 'external' ? 'ต่างจังหวัด' : 'ในจังหวัด'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{b.distance} กม.</div>
                          {passengerCount > 0 && (
                            <div className="flex items-center text-[10px] text-emerald-600 font-black uppercase">
                              <Users className="w-3 h-3 mr-1" /> {passengerCount} คน
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {b.car_id ? (
                          <div>
                            <div className="text-sm font-black text-slate-800">{b.brand} {b.model}</div>
                            <div className="text-[11px] font-bold text-indigo-600 uppercase">{b.license_plate}</div>
                            <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                              <UserCheck className="w-3 h-3 mr-1" /> {b.driver_name || 'รอมอบหมาย'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 font-bold italic bg-slate-50 px-3 py-1.5 rounded-lg border border-dashed border-slate-200 inline-block">
                            รอจัดสรรรถและคนขับ
                          </div>
                        )}
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
                        <BookingActions booking={b} passengerCount={passengerCount} view="desktop" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-slate-50">
          {bookings.length === 0 ? (
            <div className="px-8 py-24 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium italic">ไม่พบรายการขอใช้รถ</p>
            </div>
          ) : (
            bookings.map((b: any) => {
               let passengerCount = 0;
                try {
                  const parsed = JSON.parse(b.passengers);
                  if (Array.isArray(parsed)) passengerCount = parsed.length;
                  else if (b.passengers) passengerCount = b.passengers.split(/[,\n]/).filter((n: string) => n.trim()).length;
                } catch (e) {
                  passengerCount = b.passengers ? b.passengers.split(/[,\n]/).filter((n: string) => n.trim()).length : 0;
                }
              
              return (
                <div key={b.id} className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                        {(b.requester_name || b.owner_name).charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{b.requester_name || b.owner_name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{b.requester_position || 'ไม่ระบุตำแหน่ง'}</div>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      b.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                      b.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                      b.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                      'bg-rose-100 text-rose-600'
                    )}>
                       {b.status === 'pending' ? 'รออนุมัติ' : 
                        b.status === 'approved' ? 'อนุมัติแล้ว' : 
                        b.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-rose-500" />
                        <span className="truncate max-w-[150px]">{b.destination}</span>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                        b.trip_type === 'external' ? "bg-purple-100 text-purple-600" : "bg-slate-200 text-slate-500"
                      )}>
                        {b.trip_type === 'external' ? 'ต่างจังหวัด' : 'ในจังหวัด'}
                      </span>
                    </div>
                    {b.car_id && (
                      <div className="flex items-center text-[10px] text-indigo-600 font-bold">
                        <Car className="w-3 h-3 mr-1" />
                        <span>{b.brand} {b.model} • {b.driver_name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        <span>ผู้ร่วมเดินทาง {passengerCount} คน</span>
                      </div>
                      <span>{b.distance} กม.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-500 capitalize">
                      {new Date(b.start_time).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} • 
                      <span className="ml-1 text-slate-900">{new Date(b.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <BookingActions booking={b} passengerCount={passengerCount} view="mobile" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
