'use client';

import { useState, useSyncExternalStore } from 'react';
import { AlertCircle, BadgeCheck, ClipboardList, Plus, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import DriverActions from '@/components/DriverActions';
import DriverFormModal from '@/components/DriverFormModal';
import { createPortal } from 'react-dom';

interface DriverRow {
  id: number;
  fullname: string;
  driver_type_id: number;
  driver_type_name?: string | null;
  is_active: boolean;
  note?: string | null;
  created_at: string;
}

const noopSubscribe = () => () => {};

export default function DriversManagementClient({ drivers }: { drivers: DriverRow[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isMounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const createButtonDesktop = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-xl bg-[#23b35b] px-3 py-1.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1ea651]">
      <Plus className="mr-2 h-4 w-4" />
      เพิ่มพนักงานขับรถ
    </button>
  );

  const createButtonMobile = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-lg bg-[#23b35b] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1ea651]">
      <Plus className="mr-1.5 h-4 w-4" />
      เพิ่มคนขับ
    </button>
  );

  const headerActionContainer = isMounted ? document.getElementById('header-extra-actions') : null;
  const headerActionMobileContainer = isMounted ? document.getElementById('header-extra-actions-mobile') : null;
  const desktopPortal = headerActionContainer ? createPortal(createButtonDesktop, headerActionContainer) : null;
  const mobilePortal = headerActionMobileContainer ? createPortal(createButtonMobile, headerActionMobileContainer) : null;

  return (
    <div className="animate-in zoom-in space-y-8 duration-500">
      {desktopPortal}
      {mobilePortal}
      <div className="overflow-hidden rounded-[1.25rem] border border-[#cfead5] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[#d9efdd] bg-[#f1fbf2] p-5">
          <div className="flex items-center text-sm font-black uppercase tracking-widest text-[#245239]">
            <ClipboardList className="mr-2 h-4 w-4 text-[#23a154]" />
            จำนวนพนักงานขับรถ
            <span className="ml-3 rounded-md bg-[#23b35b] px-3 py-1 text-[10px] text-white">{drivers.length}</span>
          </div>
          <div className="relative hidden w-full max-w-xs md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6ca77b]" />
            <input type="text" placeholder="ค้นหาชื่อพนักงานขับรถ..." className="w-full rounded-xl border border-[#cbe7d1] bg-white py-2 pl-12 pr-4 text-sm shadow-none transition-all focus:ring-2 focus:ring-[#9ee0ae]" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f7fbf7]">
                <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]">ข้อมูลพนักงานขับรถ</th>
                <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]"><span className="inline-flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5" />สถานะ</span></th>
                <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]">หมายเหตุ</th>
                <th className="px-8 py-4 text-right text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]">เพิ่มเติม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5ef]">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                      <div className="rounded-full bg-emerald-50 p-6">
                        <AlertCircle className="h-12 w-12 text-emerald-300" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-black text-emerald-950">ไม่พบพนักงานขับรถ</h3>
                        <p className="mx-auto max-w-xs font-medium text-emerald-700/70">ยังไม่มีข้อมูลพนักงานขับรถในระบบ</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="group transition-all hover:bg-[#f6fbf7]">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7efdb] bg-[#ecf8ef] transition-all group-hover:border-[#9ee0ae] group-hover:bg-white">
                          <User className="h-6 w-6 text-[#2ca85b]" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{driver.fullname}</div>
                          <div className="text-xs font-bold text-slate-400">ID #{driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                          {driver.driver_type_name || 'ไม่ระบุ'}
                        </div>
                        <div className={cn('inline-flex items-center rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-widest', driver.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
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
