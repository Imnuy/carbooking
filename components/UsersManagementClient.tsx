'use client';

import { useState, useSyncExternalStore } from 'react';
import { Building2, Search, User, Users, Plus } from 'lucide-react';
import UserActions from '@/components/UserActions';
import UserFormModal from '@/components/UserFormModal';
import { createPortal } from 'react-dom';

interface UserRow {
  id: number;
  username: string;
  role_id: number;
  role_name?: string | null;
  fullname?: string | null;
  department?: string | null;
  created_at: string;
}

const noopSubscribe = () => () => {};

export default function UsersManagementClient({ users }: { users: UserRow[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isMounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const createButtonDesktop = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700">
      <Plus className="mr-2 h-4 w-4" />
      เพิ่มผู้ใช้
    </button>
  );

  const createButtonMobile = (
    <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700">
      <Plus className="mr-1.5 h-4 w-4" />
      เพิ่มผู้ใช้
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
        <div className="flex items-center justify-between border-b border-[#d9efdd] bg-[#f1fbf2] p-5">
          <div className="flex items-center text-sm font-black uppercase tracking-widest text-[#245239]">
            <Users className="mr-2 h-4 w-4 text-[#23a154]" />
            จำนวนสมาชิกทั้งหมด
            <span className="ml-3 rounded-md bg-[#23b35b] px-3 py-1 text-[10px] text-white">{users.length}</span>
          </div>
          <div className="relative hidden w-full max-w-xs md:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6ca77b]" />
            <input type="text" placeholder="ค้นหาชื่อผู้ใช้..." className="w-full rounded-xl border border-[#cbe7d1] bg-white py-2 pl-12 pr-4 text-sm shadow-none transition-all focus:ring-2 focus:ring-[#9ee0ae]" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#f7fbf7]">
                <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]">ข้อมูลผู้ใช้</th>
                <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]"><span className="inline-flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />แผนก / ฝ่าย</span></th>
                <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]">ระดับสิทธิ์</th>
                <th className="px-8 py-4 text-right text-[11px] font-black uppercase tracking-widest text-[#5f8f6b]">ตั้งค่า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf5ef]">
              {users.map((u) => (
                <tr key={u.id} className="group transition-all hover:bg-[#f6fbf7]">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7efdb] bg-[#ecf8ef] transition-all group-hover:border-[#9ee0ae] group-hover:bg-white">
                        <User className="h-6 w-6 text-[#2ca85b]" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{u.fullname}</div>
                        <div className="text-xs font-bold text-slate-400">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-700">{u.department || 'ไม่ระบุ'}</div>
                    <div className="text-[10px] font-medium text-slate-400">เข้าร่วมเมื่อ {new Date(u.created_at).toLocaleDateString('th-TH')}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                      {u.role_name || 'ไม่ระบุ'}
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
