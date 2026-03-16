'use client';

import { useState, useEffect } from 'react';
import { X, Car, User, Check, Loader2, AlertCircle, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface AssignModalProps {
  booking: {
    id: number;
    requester_name: string;
    destination: string;
    car_id: number | null;
    driver_name: string | null;
    status: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface Car {
  id: number;
  brand: string;
  model: string;
  license_plate: string;
}

export default function AssignBookingModal({ booking, isOpen, onClose }: AssignModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [fetchingCars, setFetchingCars] = useState(false);
  const [formData, setFormData] = useState({
    car_id: booking.car_id || '',
    driver_name: booking.driver_name || '',
    status: booking.status
  });

  useEffect(() => {
    if (isOpen) {
      setFetchingCars(true);
      fetch('/api/cars/available')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCars(data);
          setFetchingCars(false);
        })
        .catch(err => {
          console.error(err);
          setFetchingCars(false);
        });
      
      setFormData({
        car_id: booking.car_id || '',
        driver_name: booking.driver_name || '',
        status: booking.status
      });
    }
  }, [isOpen, booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: formData.car_id || null,
          driver_name: formData.driver_name,
          status: formData.car_id && formData.driver_name ? 'approved' : formData.status
        })
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
      
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">จัดสรรรถและคนขับ</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.requester_name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <Car className="w-3 h-3 mr-1" /> เลือกยานพาหนะ
              </label>
              <div className="relative group">
                <select 
                  required
                  value={formData.car_id}
                  onChange={(e) => setFormData({...formData, car_id: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">-- เลือกรายการรถ --</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} ({car.license_plate})
                    </option>
                  ))}
                  {cars.length === 0 && !fetchingCars && (
                    <option disabled>ไม่พบรถว่างในขณะนี้</option>
                  )}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  {fetchingCars ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4 rotate-90" />}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                <User className="w-3 h-3 mr-1" /> ชื่อพนักงานขับรถ
              </label>
              <input 
                required
                type="text" 
                value={formData.driver_name}
                onChange={(e) => setFormData({...formData, driver_name: e.target.value})}
                placeholder="ระบุชื่อพนักงานขับรถ..."
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700"
              />
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-indigo-700 leading-relaxed italic">
                เมื่อระบุรถและคนขับครบถ้วน สถานะจะถูกเปลี่ยนเป็น <span className="font-black">"อนุมัติแล้ว"</span> โดยอัตโนมัติ
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
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
                <Check className="w-5 h-5 mr-3 shadow-sm" />
              )}
              บันทึกการจัดสรร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
