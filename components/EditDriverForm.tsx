'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';

interface EditDriverFormProps {
  driver: {
    id: number;
    fullname: string;
    driver_type_code: string;
    is_active: boolean;
    note?: string | null;
  };
}

export default function EditDriverForm({ driver }: EditDriverFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: driver.fullname,
    driver_type_code: driver.driver_type_code || '01',
    is_active: driver.is_active,
    note: driver.note || '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/drivers/${driver.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/drivers');
        router.refresh();
      } else {
        const result = await response.json().catch(() => null);
        alert(result?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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
          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
            <input
              required
              type="text"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ประเภทพนักงานขับรถ</label>
            <select
              value={formData.driver_type_code}
              onChange={(e) => setFormData({ ...formData, driver_type_code: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700"
            >
              <option value="01">พนักงานขับรถเป็นครั้งคราว</option>
              <option value="02">พนักงานขับรถยนต์</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">สถานะ</label>
            <select
              value={formData.is_active ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700"
            >
              <option value="true">พร้อมใช้งาน</option>
              <option value="false">ไม่พร้อมใช้งาน</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">หมายเหตุ</label>
            <textarea
              rows={4}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all font-bold text-slate-700 resize-none"
            />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end space-x-4">
          <Link href="/drivers" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
            บันทึกการแก้ไข
          </button>
        </div>
      </form>
    </div>
  );
}
