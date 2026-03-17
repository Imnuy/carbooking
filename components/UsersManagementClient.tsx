'use client';

import { useState } from 'react';
import { Building2, Search, ShieldCheck, User, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserActions from '@/components/UserActions';
import UserFormModal from '@/components/UserFormModal';
import { createPortal } from 'react-dom';

interface UserRow {
  id: number;
  username: string;
  role: 'admin' | 'user';
  fullname?: string | null;
  department?: string | null;
  created_at: string;
}

export default function UsersManagementClient({ users }: { users: UserRow[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const createButtonDesktop = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all bg-emerald-600 text-white hover:bg-emerald-700">
      <Plus className="mr-2 h-4 w-4" />
      เพิ่มผู้ใช้
    </button>
  );

  const createButtonMobile = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-all bg-emerald-600 text-white hover:bg-emerald-700">
      <Plus className="mr-1.5 h-4 w-4" />
      เพิ่มผู้ใช้
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
        <div className="p-5 border-b border-[#d9efdd] bg-[#f1fbf2] flex items-center justify-between">
          <div className="text-sm font-black text-[#245239] uppercase tracking-widest flex items-center">
            <Users className="w-4 h-4 mr-2 text-[#23a154]" />
            จำนวนสมาชิกทั้งหมด
            <span className="ml-3 px-3 py-1 bg-[#23b35b] text-white rounded-md text-[10px]">{users.length}</span>
          </div>
          <div className="relative max-w-xs w-full hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6ca77b]" />
            <input type="text" placeholder="ค้นหาชื่อผู้ใช้..." className="w-full pl-12 pr-4 py-2 bg-white border border-[#cbe7d1] rounded-xl text-sm focus:ring-2 focus:ring-[#9ee0ae] transition-all shadow-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f7fbf7]">
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">ข้อมูลผู้ใช้</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic"><span className="inline-flex items-center gap-2"><Building2 className="w-3.5 h-3.5" />แผนก / ฝ่าย</span></th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">ระดับสิทธิ์</th>
                <th className="px-8 py-4 text-right text-[11px] font-black text-[#5f8f6b] uppercase tracking-widest italic">ตั้งค่า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5ef]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#f6fbf7] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full border border-[#d7efdb] flex items-center justify-center bg-[#ecf8ef] group-hover:bg-white group-hover:border-[#9ee0ae] transition-all">
                        <User className="w-6 h-6 text-[#2ca85b] transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{u.fullname}</div>
                        <div className="text-xs font-bold text-slate-400">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-700">{u.department || 'ไม่ระบุ'}</div>
                    <div className="text-[10px] font-medium text-slate-400 italic">เข้าร่วมเมื่อ {new Date(u.created_at).toLocaleDateString('th-TH')}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn('inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest', u.role === 'admin' ? 'bg-lime-100 text-lime-800' : 'bg-emerald-100 text-emerald-700')}>
                      {u.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-2" />}
                      {u.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <UserActions user={u} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UserFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
