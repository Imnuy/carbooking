import pool, { queryWithEncoding } from '@/lib/db';
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
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CarActions from '@/components/CarActions';

export default async function CarsPage() {
  const cars = await queryWithEncoding('SELECT * FROM cars ORDER BY id DESC') as RowDataPacket[];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">การจัดการยานพาหนะ</h1>
          <p className="text-slate-500 font-medium">เพิ่ม แก้ไข หรือลบข้อมูลรถยนต์ในหน่วยงาน</p>
        </div>
        <Link href="/cars/add" className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold shadow-2xl flex items-center hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group">
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          เพิ่มรถใหม่
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาด้วยทะเบียนหรือรุ่น..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ข้อมูลรถ</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">รายละเอียด</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ประเภทรถ</th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cars.map((car: any) => (
                <tr key={car.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
                        <Car className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-slate-900">{car.brand} {car.model}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{car.license_plate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-bold text-slate-700">
                        <svg className="w-3.5 h-3.5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        {car.seats} ที่นั่ง
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">รถยนต์ส่วนกลาง</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                      car.car_type === 'รถตู้' 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'bg-amber-50 text-amber-600'
                    )}>
                      {car.car_type || 'ไม่ระบุประเภท'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <CarActions car={car} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="p-6 bg-slate-50 rounded-full">
                <AlertCircle className="w-12 h-12 text-slate-300" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900">ไม่พบรถยนต์</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">เริ่มโดยการเพิ่มรถใหม่ในปุ่มด้านบน</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
