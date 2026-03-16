"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, Car, Camera, Info, User, Fuel, Calendar, Palette, Scissors, Loader2, X } from 'lucide-react';

export default function AddCarPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    license_plate: '',
    car_type: 'รถยนต์นั่งส่วนบุคคล',
    color: '',
    manager: '',
    seats: '',
    fuel_type: 'ดีเซล',
    act_expiry: '',
    insurance_expiry: '',
    description: '',
    image_url: ''
  });
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.user?.role !== 'admin') {
            router.push('/');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {}
    };
    checkAdmin();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/cars');
        router.refresh();
      } else {
        const err = await res.json();
        alert('เกิดข้อผิดพลาด: ' + err.error);
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 text-center flex flex-col items-center">
            <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-6">รูปภาพรถยนต์</h3>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:bg-slate-100/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              {formData.image_url ? (
                <>
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, image_url: '' }));
                    }}
                    className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                    <Camera className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">คลิกเพื่ออัปโหลดรูปภาพ</p>
                  <p className="text-[10px] text-slate-300 mt-2 font-medium">PNG, JPG สูงสุด 5MB</p>
                </>
              )}
            </div>
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
                  <input required name="brand" value={formData.brand} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น Toyota, Honda..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รุ่นรถ</label>
                  <input required name="model" value={formData.model} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น Commuter, Accord..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ทะเบียนรถ</label>
                  <input required name="license_plate" value={formData.license_plate} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น กข 1234..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ประเภทรถ</label>
                  <select name="car_type" value={formData.car_type} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none">
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
                  <input name="color" value={formData.color} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น บรอนซ์เงิน, ดำ..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                    <User className="w-3 h-3 mr-1" /> ผู้รับผิดชอบ
                  </label>
                  <input name="manager" value={formData.manager} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="ชื่อ-นามสกุล พนักงานขับรถ" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">จำนวนที่นั่ง</label>
                  <input name="seats" value={formData.seats} onChange={handleChange} type="number" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น 5, 12..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                    <Fuel className="w-3 h-3 mr-1" /> ประเภทเชื้อเพลิง
                  </label>
                  <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none">
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
                  <input name="act_expiry" value={formData.act_expiry} onChange={handleChange} type="date" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 text-rose-500">ประกันหมดอายุ</label>
                  <input name="insurance_expiry" value={formData.insurance_expiry} onChange={handleChange} type="date" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รายละเอียดเพิ่มเติม</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none" placeholder="เช่น สภาพรถ, อุปกรณ์เสริม..." />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-end space-x-4">
              <Link href="/cars" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
              <button disabled={loading} type="submit" className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Car className="w-5 h-5 mr-3 group-hover:animate-bounce transition-transform" />}
                ลงทะเบียนรถใหม่
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
