import Link from 'next/link';
import { Plus, ArrowLeft, Car } from 'lucide-react';

export default function AddCarPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/cars" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">เพิ่มรถยนต์คันใหม่</h1>
            <p className="text-slate-500 font-medium italic">ลงทะเบียนยานพาหนะใหม่เข้าสู่ระบบ</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ยี่ห้อรถ</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น Toyota, Honda..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รุ่นรถ</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น Commuter, Accord..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">เลขทะเบียนรถ</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น กข 1234..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">จำนวนที่นั่ง</label>
            <input type="number" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น 5, 12..." />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end space-x-4">
          <Link href="/cars" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
          <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group">
            <Car className="w-5 h-5 mr-3 group-hover:animate-bounce transition-transform" />
            บันทึกข้อมูลรถ
          </button>
        </div>
      </div>
    </div>
  );
}
