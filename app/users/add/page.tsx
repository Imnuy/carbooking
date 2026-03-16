import Link from 'next/link';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function AddUserPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/users" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">เพิ่มผู้ใช้งานใหม่</h1>
            <p className="text-slate-500 font-medium italic">กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้ในระบบ</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="ระบุชื่อเต็ม..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อผู้ใช้งาน (Username)</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="ระบุ username..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รหัสผ่าน</label>
            <input type="password" underline-none className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">แผนก / ฝ่าย</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="ระบุสังกัด..." />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end space-x-4">
          <Link href="/users" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
          <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group">
            <UserPlus className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
