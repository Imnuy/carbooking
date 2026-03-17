'use client';

import { useState } from 'react';
import { AlertCircle, Car, CircleCheckBig, Plus, Search, Settings2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import CarActions from '@/components/CarActions';
import CarFormModal from '@/components/CarFormModal';
import { createPortal } from 'react-dom';

interface CarRow {
  id: number;
  brand: string;
  model: string;
  license_plate: string;
  car_number?: string | null;
  seats?: number | null;
  car_type?: string | null;
  is_active: boolean;
}

export default function CarsManagementClient({ cars }: { cars: CarRow[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const createButtonDesktop = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all bg-[#23b35b] text-white hover:bg-[#1ea651]">
      <Plus className="mr-2 h-4 w-4" />
      เพิ่มรถใหม่
    </button>
  );

  const createButtonMobile = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-all bg-[#23b35b] text-white hover:bg-[#1ea651]">
      <Plus className="mr-1.5 h-4 w-4" />
      เพิ่มรถ
    </button>
  );

  const headerActionContainer = typeof document !== 'undefined' ? document.getElementById('header-extra-actions') : null;
  const headerActionMobileContainer = typeof document !== 'undefined' ? document.getElementById('header-extra-actions-mobile') : null;
  const desktopPortal = headerActionContainer ? createPortal(createButtonDesktop, headerActionContainer) : null;
  const mobilePortal = headerActionMobileContainer ? createPortal(createButtonMobile, headerActionMobileContainer) : null;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {desktopPortal}
      {mobilePortal}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-[#cfead5] overflow-hidden">
        <div className="p-5 border-b border-[#d9efdd] bg-[#f1fbf2] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6ca77b]" />
            <input type="text" placeholder="ค้นหาด้วยทะเบียนหรือรุ่น..." className="w-full pl-12 pr-4 py-3 bg-white border border-[#cbe7d1] rounded-xl text-sm focus:ring-2 focus:ring-[#9ee0ae] focus:border-[#9ee0ae] transition-all" />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white border border-[#cbe7d1] rounded-xl text-[#4f8a61] hover:bg-[#f4fbf5] transition-colors shadow-sm">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f7fbf7]">
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">ข้อมูลรถ</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic"><span className="inline-flex items-center gap-2"><Tag className="w-3.5 h-3.5" />เลขทะเบียน</span></th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">หมายเลขรถ</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">ประเภทรถ</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic"><span className="inline-flex items-center gap-2"><CircleCheckBig className="w-3.5 h-3.5" />สถานะ</span></th>
                <th className="px-8 py-4 text-right text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5ef]">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-[#f6fbf7] transition-all duration-300 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#ecf8ef] rounded-full flex items-center justify-center text-[#23a154] border border-[#d7efdb]">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-[#245239]">{car.brand} {car.model}</div>
                        <div className="text-[10px] font-bold text-[#759d7f] uppercase tracking-widest flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                          {car.seats} ที่นั่ง
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-[#2f6b43] bg-[#f4fbf5] px-3 py-1.5 rounded-lg inline-block border border-[#d7efdb]">{car.license_plate}</div>
                  </td>
                  <td className="px-8 py-6">
                    {car.car_number ? (
                      <span className="inline-flex items-center rounded-lg border border-[#e0ecf4] bg-[#f6faff] px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#2b4d66]">
                        {car.car_number}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">ไม่ระบุ</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn('inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm', car.car_type === 'รถตู้นั่งบรรทุก' ? 'bg-lime-100 text-lime-800' : car.car_type === 'รถยนต์บรรทุก' ? 'bg-amber-50 text-amber-600' : car.car_type === 'รถยนต์นั่งบรรทุก4ประตู' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')}>
                      {car.car_type || 'ไม่ระบุประเภท'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn('inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black shadow-sm', car.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                      <span className={cn('w-1.5 h-1.5 rounded-full mr-2', car.is_active ? 'bg-emerald-500' : 'bg-rose-500')} />
                      {car.is_active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
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
              <div className="p-6 bg-emerald-50 rounded-full">
                <AlertCircle className="w-12 h-12 text-emerald-300" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-emerald-950">ไม่พบรถยนต์</h3>
                <p className="text-emerald-700/70 font-medium max-w-xs mx-auto">เริ่มโดยการเพิ่มรถใหม่ในปุ่มด้านบน</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CarFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
