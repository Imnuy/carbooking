'use client';

import { useState } from 'react';
import { AlertCircle, BadgeCheck, ClipboardList, Plus, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import DriverActions from '@/components/DriverActions';
import DriverFormModal from '@/components/DriverFormModal';
import { createPortal } from 'react-dom';

interface DriverRow {
  id: number;
  fullname: string;
  driver_type_code: string;
  driver_type?: string | null;
  is_active: boolean;
  note?: string | null;
  created_at: string;
}

export default function DriversManagementClient({ drivers }: { drivers: DriverRow[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const createButtonDesktop = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all bg-[#23b35b] text-white hover:bg-[#1ea651]">
      <Plus className="mr-2 h-4 w-4" />
      เพิ่มพนักงานขับรถ
    </button>
  );

  const createButtonMobile = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-all bg-[#23b35b] text-white hover:bg-[#1ea651]">
      <Plus className="mr-1.5 h-4 w-4" />
      เพิ่มคนขับ
    </button>
  );

  const headerActionContainer = typeof document !== 'undefined' ? document.getElementById('header-extra-actions') : null;
  const headerActionMobileContainer = typeof document !== 'undefined' ? document.getElementById('header-extra-actions-mobile') : null;
  const desktopPortal = headerActionContainer ? createPortal(createButtonDesktop, headerActionContainer) : null;
  const mobilePortal = headerActionMobileContainer ? createPortal(createButtonMobile, headerActionMobileContainer) : null;

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      {desktopPortal}
      {mobilePortal}
      <div className="bg-white rounded-[1.25rem] shadow-sm border border-[#cfead5] overflow-hidden">
        <div className="p-5 border-b border-[#d9efdd] bg-[#f1fbf2] flex items-center justify-between gap-4">
          <div className="text-sm font-black text-[#245239] uppercase tracking-widest flex items-center">
            <ClipboardList className="w-4 h-4 mr-2 text-[#23a154]" />
            จำนวนพนักงานขับรถ
            <span className="ml-3 px-3 py-1 bg-[#23b35b] text-white rounded-md text-[10px]">{drivers.length}</span>
          </div>
          <div className="relative max-w-xs w-full hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6ca77b]" />
            <input type="text" placeholder="ค้นหาชื่อพนักงานขับรถ..." className="w-full pl-12 pr-4 py-2 bg-white border border-[#cbe7d1] rounded-xl text-sm focus:ring-2 focus:ring-[#9ee0ae] transition-all shadow-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f7fbf7]">
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">ข้อมูลพนักงานขับรถ</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic"><span className="inline-flex items-center gap-2"><BadgeCheck className="w-3.5 h-3.5" />สถานะ</span></th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">หมายเหตุ</th>
                <th className="px-8 py-4 text-right text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">เพิ่มเติม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5ef]">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="py-8 flex flex-col items-center justify-center space-y-4">
                      <div className="p-6 bg-emerald-50 rounded-full">
                        <AlertCircle className="w-12 h-12 text-emerald-300" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-black text-emerald-950">ไม่พบพนักงานขับรถ</h3>
                        <p className="text-emerald-700/70 font-medium max-w-xs mx-auto">ยังไม่มีข้อมูลพนักงานขับรถในระบบ</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-[#f6fbf7] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full border border-[#d7efdb] flex items-center justify-center bg-[#ecf8ef] group-hover:bg-white group-hover:border-[#9ee0ae] transition-all">
                          <User className="w-6 h-6 text-[#2ca85b] transition-colors" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{driver.fullname}</div>
                          <div className="text-xs font-bold text-slate-400">ID #{driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className={cn('inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest', driver.driver_type_code === '01' ? 'bg-lime-100 text-lime-800' : 'bg-emerald-100 text-emerald-700')}>
                          {driver.driver_type || 'ไม่ระบุ'}
                        </div>
                        <div className={cn('inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest', driver.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                          {driver.is_active ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-medium text-slate-600">{driver.note || '-'}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DriverActions driver={driver} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DriverFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
