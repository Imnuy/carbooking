"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  User,
  Phone,
  IdCard,
  Calendar,
  Settings2,
  AlertCircle,
  Loader2,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/drivers');
      if (res.ok) {
        const data = await res.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.user?.role === 'admin');
        }
      } catch (err) {}
    };
    checkAdmin();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบพนักงาน ${name}?`)) {
      try {
        const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setDrivers(prev => prev.filter(d => d.id !== id));
        } else {
          alert('ไม่สามารถลบข้อมูลได้');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.fullname.toLowerCase().includes(search.toLowerCase()) ||
    (driver.nickname && driver.nickname.toLowerCase().includes(search.toLowerCase())) ||
    (driver.phone && driver.phone.includes(search))
  );

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">พนักงานขับรถ</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 italic">จัดการข้อมูลบุคลากรพนักงานขับรถประจำหน่วยงาน</p>
        </div>
        {isAdmin && (
          <Link href="/drivers/add" className="bg-[#5550e6] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 flex items-center hover:scale-105 active:scale-95 transition-all group">
            <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
            เพิ่มพนักงานใหม่
          </Link>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, ชื่อเล่น หรือเบอร์โทร..." 
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
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="font-bold text-slate-400 animate-pulse">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ข้อมูลพนักงาน</th>
                  <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ติดต่อ / ใบอนุญาต</th>
                  <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">สถานะปัจจุบัน</th>
                  <th className="px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDrivers.map((driver: any) => (
                  <tr key={driver.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                          {driver.image_url ? (
                            <img src={driver.image_url} alt={driver.fullname} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className="text-xl font-black text-slate-900 leading-tight">
                            {driver.fullname}
                            {driver.nickname && <span className="ml-2 text-sm text-indigo-500">({driver.nickname})</span>}
                          </div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: DRV-{driver.id.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <Phone className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                          {driver.phone || '-'}
                        </div>
                        <div className="flex items-center text-xs font-bold text-slate-400">
                          <IdCard className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                          {driver.license_no || '-'}
                        </div>
                        <div className="text-[10px] font-bold text-rose-400 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" /> หมดอายุ: {driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString('th-TH') : '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={cn(
                        "inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border",
                        driver.status === 'available' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : driver.status === 'busy'
                          ? 'bg-rose-50 text-rose-600 border-rose-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      )}>
                        <span className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          driver.status === 'available' ? 'bg-emerald-500 animate-pulse' : 
                          driver.status === 'busy' ? 'bg-rose-500' : 'bg-amber-500'
                        )}></span>
                        {driver.status === 'available' ? 'พร้อมปฏิบัติงาน' : driver.status === 'busy' ? 'ติดงาน' : 'ลาพักร้อน'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      {isAdmin && (
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Link href={`/drivers/edit/${driver.id}`} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-500 hover:border-amber-100 hover:shadow-xl transition-all shadow-sm">
                            <Edit3 className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDelete(driver.id, driver.fullname)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-xl transition-all shadow-sm">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredDrivers.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center space-y-6">
              <div className="p-8 bg-slate-50 rounded-full">
                <AlertCircle className="w-16 h-16 text-slate-200" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900">ไม่พบข้อมูลพนักงาน</h3>
                <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2 italic">ระบบยังไม่มีรายชื่อพนักงานขับรถ กรุณาเริ่มโดยการเพิ่มข้อมูลใหม่</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
