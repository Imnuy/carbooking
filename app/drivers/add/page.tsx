"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Camera, 
  Info, 
  User, 
  Phone, 
  Calendar, 
  IdCard, 
  FileText,
  Loader2,
  X,
  Save
} from 'lucide-react';

export default function AddDriverPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    nickname: '',
    phone: '',
    license_no: '',
    license_expiry: '',
    description: '',
    image_url: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/drivers');
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

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/drivers" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">เพิ่มพนักงานขับรถใหม่</h1>
            <p className="text-slate-500 font-medium italic">ลงทะเบียนพนักงานและข้อมูลการขับขี่</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Image */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 text-center flex flex-col items-center">
            <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-6">รูปถ่ายพนักงาน</h3>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:bg-slate-100/50 transition-all cursor-pointer group relative overflow-hidden shadow-inner"
            >
              {formData.image_url ? (
                <>
                  <img src={formData.image_url} alt="Profile Preview" className="w-full h-full object-cover" />
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
                    <User className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">คลิกเพื่ออัปโหลดรูป</p>
                  <p className="text-[10px] text-slate-300 mt-2 font-medium italic">รูปภาพหน้าตรงสำหรับบัตรพนักงาน</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10 space-y-10">
            {/* Essential Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Info className="w-5 h-5" />
                <h2 className="text-lg font-black tracking-tight">ข้อมูลส่วนตัว</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
                  <input required name="fullname" value={formData.fullname} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="ระบุชื่อจริงและนามสกุล..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อเล่น</label>
                  <input name="nickname" value={formData.nickname} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="เช่น เก่ง, ฟ้า..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                    <Phone className="w-3 h-3 mr-1" /> เบอร์โทรศัพท์
                  </label>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="08x-xxx-xxxx" />
                </div>
              </div>
            </div>

            {/* License Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-indigo-600">
                <IdCard className="w-5 h-5" />
                <h2 className="text-lg font-black tracking-tight">ข้อมูลใบขับขี่</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">เลขที่ใบขับขี่</label>
                  <input name="license_no" value={formData.license_no} onChange={handleChange} type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" placeholder="ระบุเลขที่บัตร..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> วันหมดอายุ
                  </label>
                  <input name="license_expiry" value={formData.license_expiry} onChange={handleChange} type="date" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <FileText className="w-3 h-3 mr-1" /> ข้อมูลเพิ่มเติม/ประวัติ
              </label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none shadow-inner" placeholder="ระบุข้อมูลที่ควรบันทึกไว้..." />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-end space-x-4">
              <Link href="/drivers" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
              <button disabled={loading} type="submit" className="bg-[#5550e6] text-white px-12 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
                ลงทะเบียนพนักงาน
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
