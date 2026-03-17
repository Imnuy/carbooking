'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CarTypeOption {
  id: number;
  car_type: string;
}

export default function AddCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingCarTypes, setFetchingCarTypes] = useState(false);
  const [carTypes, setCarTypes] = useState<CarTypeOption[]>([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    license_plate: '',
    car_number: '',
    seats: '',
    car_type_id: '',
    is_active: true,
  });

  useEffect(() => {
    setFetchingCarTypes(true);
    fetch('/api/car-types')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCarTypes(data);
          if (data[0]?.id) {
            setFormData((current) => ({ ...current, car_type_id: String(data[0].id) }));
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setFetchingCarTypes(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedCarType = carTypes.find((item) => String(item.id) === formData.car_type_id);
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          car_type_id: formData.car_type_id ? Number(formData.car_type_id) : null,
          car_type: selectedCarType?.car_type || null,
        }),
      });

      if (response.ok) {
        router.push('/cars');
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ยี่ห้อรถ</label>
            <input required type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น Toyota, Honda..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รุ่นรถ</label>
            <input required type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น Commuter, Accord..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">เลขทะเบียนรถ</label>
            <input required type="text" value={formData.license_plate} onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น กข 1234..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">หมายเลขรถ</label>
            <input type="text" value={formData.car_number} onChange={(e) => setFormData({ ...formData, car_number: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น CAR-01" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ประเภทรถ</label>
            <select required value={formData.car_type_id} onChange={(e) => setFormData({ ...formData, car_type_id: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 appearance-none cursor-pointer">
              <option value="">เลือกประเภทรถ</option>
              {carTypes.map((item) => (
                <option key={item.id} value={item.id}>{item.car_type}</option>
              ))}
            </select>
            {fetchingCarTypes && <p className="text-xs text-slate-400">กำลังดึงข้อมูลประเภทรถ...</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">จำนวนที่นั่ง</label>
            <input required type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 placeholder:text-slate-300" placeholder="เช่น 5, 12..." />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">สถานะ</label>
            <select required value={formData.is_active ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 appearance-none cursor-pointer">
              <option value="true">ใช้งาน</option>
              <option value="false">ไม่ใช้งาน</option>
            </select>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end space-x-4">
          <Link href="/cars" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
          <button type="submit" disabled={loading} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Car className="w-5 h-5 mr-3 group-hover:animate-bounce transition-transform" />}
            บันทึกข้อมูลรถ
          </button>
        </div>
      </form>
    </div>
  );
}
