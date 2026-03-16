import pool from '@/lib/db';
import Link from 'next/link';
import { RowDataPacket } from 'mysql2';
import { 
  Car, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye,
  Settings2,
  AlertCircle,
  Fuel,
  Users,
  Calendar,
  ShieldCheck,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function CarsPage() {
  const [cars] = await pool.query<RowDataPacket[]>('SELECT * FROM cars ORDER BY id DESC');

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">การจัดการยานพาหนะ</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 italic">เพิ่ม แก้ไข หรือลบข้อมูลรถยนต์พร้อมรายละเอียดเชิงลึก</p>
        </div>
        <Link href="/cars/add" className="bg-[#5550e6] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 flex items-center hover:scale-105 active:scale-95 transition-all group">
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          ลงทะเบียนรถใหม่
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาด้วยทะเบียน รุ่น หรือผู้รับผิดชอบ..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ข้อมูลรถ / ภาพลักษณ์</th>
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">สเปกและเชื้อเพลิง</th>
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ผู้รับผิดชอบ / เอกสาร</th>
                <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">สถานะ</th>
                <th className="px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cars.map((car: any) => (
                <tr key={car.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden shadow-inner border border-slate-100 group-hover:scale-105 transition-transform">
                          {car.image_url ? (
                            <img src={car.image_url} alt={car.model} className="w-full h-full object-cover" />
                          ) : (
                            <Car className="w-8 h-8 opacity-40" />
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-50">
                          <Palette className="w-3.5 h-3.5" style={{ color: car.color === 'ดำ' ? '#000' : car.color === 'ขาว' ? '#ccc' : '#5550e6' }} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-black text-slate-900 leading-tight">{car.brand} {car.model}</div>
                        <div className="flex items-center mt-1">
                          <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded mr-2 uppercase tracking-tighter shadow-sm">{car.license_plate}</span>
                          <span className="text-[11px] font-bold text-slate-400 italic">{car.car_type || 'รถยนต์ทั่วไป'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <Users className="w-4 h-4 mr-2 text-indigo-500" />
                          {car.seats} ที่นั่ง
                        </div>
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <Fuel className="w-4 h-4 mr-2 text-rose-500" />
                          {car.fuel_type || 'ไม่ระบุ'}
                        </div>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full w-fit">
                        สีประจำรถ: {car.color || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm font-black text-slate-800">
                        <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                        {car.manager || 'ยังไม่มีคนดูแล'}
                      </div>
                      <div className="flex space-x-2">
                        <div className="text-[10px] font-bold text-slate-400 flex items-center bg-slate-50 px-2 py-0.5 rounded">
                          <Calendar className="w-3 h-3 mr-1" /> พรบ. {car.act_expiry ? new Date(car.act_expiry).toLocaleDateString('th-TH') : '-'}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center bg-slate-50 px-2 py-0.5 rounded">
                          <Calendar className="w-3 h-3 mr-1" /> ประกัน. {car.insurance_expiry ? new Date(car.insurance_expiry).toLocaleDateString('th-TH') : '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={cn(
                      "inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border",
                      car.status === 'available' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    )}>
                      <span className={cn(
                        "w-2 h-2 rounded-full mr-2 shadow-sm",
                        car.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                      )}></span>
                      {car.status === 'available' ? 'พร้อมใช้งาน' : 'ไม่ว่าง'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-xl transition-all shadow-sm">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-500 hover:border-amber-100 hover:shadow-xl transition-all shadow-sm">
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-xl transition-all shadow-sm">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center space-y-6">
              <div className="p-8 bg-slate-50 rounded-full shadow-inner">
                <AlertCircle className="w-16 h-16 text-slate-200" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900">ไม่พบฐานข้อมูลยานพาหนะ</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2 italic">ระบบยังไม่มีรถที่ลงทะเบียนไว้ กรุณาเริ่มด้วยการเพิ่มรถใหม่</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
