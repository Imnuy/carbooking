import pool, { queryWithEncoding } from '@/lib/db';
import Link from 'next/link';
import { 
  UserPlus, 
  Search, 
  ShieldCheck, 
  User, 
  Key, 
  Trash2, 
  MoreVertical 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function UsersPage() {
  const users = await queryWithEncoding('SELECT id, username, role, fullname, department, created_at FROM users ORDER BY id DESC');

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-nowrap">รายชื่อผู้ใช้งาน</h1>
          <p className="text-slate-500 font-medium">จัดการสิทธิ์การเข้าถึงและข้อมูลบุคลากร</p>
        </div>
        <Link href="/users/add" className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-2xl shadow-emerald-900/20 flex items-center hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group">
          <UserPlus className="mr-2 w-5 h-5 transition-transform group-hover:rotate-12" />
          เพิ่มผู้ใช้
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
            จำนวนสมาชิกทั้งหมด
            <span className="ml-3 px-3 py-1 bg-slate-900 text-white rounded-full text-[10px]">{users.length}</span>
          </div>
          <div className="relative max-w-xs w-full hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อผู้ใช้..." 
              className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ข้อมูลผู้ใช้</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">แผนก / ฝ่าย</th>
                <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ระดับสิทธิ์</th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ตั้งค่า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-50 flex items-center justify-center bg-slate-100 group-hover:bg-white group-hover:border-emerald-500 transition-all">
                        <User className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
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
                    <div className={cn(
                      "inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    )}>
                      {u.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-2" />}
                      {u.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors" title="เปลี่ยนรหัสผ่าน">
                        <Key className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors" title="ลบผู้ใช้">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 text-slate-300" title="เพิ่มเติม">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
