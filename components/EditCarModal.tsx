'use client';

import { useState, useEffect } from 'react';
import { X, Car, Save, Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditCarModalProps {
  car: {
    id: number;
    brand: string;
    model: string;
    license_plate: string;
    seats: number;
    car_type: string;
    status: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCarModal({ car, isOpen, onClose }: EditCarModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: car.brand,
    model: car.model,
    license_plate: car.license_plate,
    seats: car.seats,
    car_type: car.car_type || 'รถตู้',
    status: car.status
  });

  useEffect(() => {
    setFormData({
      brand: car.brand,
      model: car.model,
      license_plate: car.license_plate,
      seats: car.seats,
      car_type: car.car_type || 'รถตู้',
      status: car.status
    });
  }, [car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onClose();
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">แก้ไขข้อมูลรถยนต์</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{car.license_plate}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ยี่ห้อ</label>
              <input 
                required
                type="text" 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รุ่น</label>
              <input 
                required
                type="text" 
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ทะเบียน</label>
              <input 
                required
                type="text" 
                value={formData.license_plate}
                onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">จำนวนที่นั่ง</label>
              <input 
                required
                type="number" 
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ประเภทรถ</label>
              <select 
                required
                value={formData.car_type}
                onChange={(e) => setFormData({...formData, car_type: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 cursor-pointer"
              >
                <option value="รถตู้">รถตู้</option>
                <option value="รถกระบะ4ประตู">รถกระบะ4ประตู</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">สถานะ</label>
              <select 
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 cursor-pointer"
              >
                <option value="available">ว่าง</option>
                <option value="maintenance">ซ่อมบำรุง</option>
                <option value="in_use">ใช้งานอยู่</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 items-center pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center justify-center group disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-3 shadow-sm" />
              )}
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
