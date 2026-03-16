"use client";

import Link from 'next/link';
import { Plus, ArrowLeft, Car, Camera, Info, User, Fuel, Calendar, Palette, Scissors } from 'lucide-react';

export default function AddCarPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/cars" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">เพิ่มรถยนต์คันใหม่</h1>
            <p className="text-slate-500 font-medium italic">ลงทะเบียนยานพาหนะพร้อมรายละเอียดครบถ้วน</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Upload Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 text-center flex flex-col items-center">
            <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-6">รูปภาพรถยนต์</h3>
            <div className="w-full aspect-square bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:bg-slate-100/50 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                <Camera className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-400">คลิกเพื่ออัปโหลดรูปภาพ</p>
              <p className="text-[10px] text-slate-300 mt-2 font-medium">JPG, PNG (ขนาดไม่เกิน 5MB)</p>
            </div>
            <p className="mt-6 text-xs font-bold text-slate-400 italic">"ภาพถ่ายด้านหน้าและด้านข้างจะช่วยให้ระบุรถได้ง่ายขึ้น"</p>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10 space-y-10">
            {/* Base Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Info className="w-5 h-5" />
                <h2 className="text-lg font-black tracking-tight">ข้อมูลพื้นฐาน</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ยี่ห้อรถ</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น Toyota, Honda..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รุ่นรถ</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น Commuter, Accord..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ทะเบียนรถ</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น กข 1234..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ประเภทรถ</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none">
                    <option>รถยนต์นั่งส่วนบุคคล</option>
                    <option>รถตู้</option>
                    <option>รถกระบะ</option>
                    <option>รถบรรทุก</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Spec Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Scissors className="w-5 h-5" />
                <h2 className="text-lg font-black tracking-tight">คุณสมบัติและผู้ดูแล</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                    <Palette className="w-3 h-3 mr-1" /> สีประจำรถ
                  </label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น บรอนซ์เงิน, ดำ..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                    <User className="w-3 h-3 mr-1" /> ผู้รับผิดชอบ
                  </label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="ชื่อ-นามสกุล พนักงานขับรถ" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">จำนวนที่นั่ง</label>
                  <input type="number" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น 5, 12..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                    <Fuel className="w-3 h-3 mr-1" /> ประเภทเชื้อเพลิง
                  </label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none">
                    <option>ดีเซล</option>
                    <option>เบนซิน</option>
                    <option>ไฟฟ้า (EV)</option>
                    <option>ไฮบริด</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Calendar className="w-5 h-5" />
                <h2 className="text-lg font-black tracking-tight">วันหมดอายุเอกสาร</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 text-rose-500">พรบ. หมดอายุ</label>
                  <input type="date" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 text-rose-500">ประกันหมดอายุ</label>
                  <input type="date" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รายละเอียดเพิ่มเติม</label>
              <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none" placeholder="เช่น สภาพรถ, อุปกรณ์เสริม..." />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-end space-x-4">
              <Link href="/cars" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
              <button className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group">
                <Car className="w-5 h-5 mr-3 group-hover:animate-bounce transition-transform" />
                ลงทะเบียนรถใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
