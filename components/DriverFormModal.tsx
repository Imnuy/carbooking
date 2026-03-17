'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/lib/swal';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver?: {
    id: number;
    fullname: string;
    driver_type_code: string;
    is_active: boolean;
    note?: string | null;
  } | null;
}

const emptyForm = {
  fullname: '',
  driver_type_code: '01',
  is_active: true,
  note: '',
};

export default function DriverFormModal({ isOpen, onClose, driver }: DriverFormModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (driver) {
      setFormData({
        fullname: driver.fullname,
        driver_type_code: driver.driver_type_code || '01',
        is_active: driver.is_active,
        note: driver.note || '',
      });
      return;
    }

    setFormData(emptyForm);
  }, [driver, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(driver ? `/api/drivers/${driver.id}` : '/api/drivers', {
        method: driver ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await showSuccess(driver ? 'บันทึกการแก้ไขพนักงานขับรถเรียบร้อยแล้ว' : 'เพิ่มพนักงานขับรถเรียบร้อยแล้ว');
        onClose();
        router.refresh();
      } else {
        const result = await response.json().catch(() => null);
        await showError(result?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error(error);
      await showError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#23b35b] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              {driver ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{driver ? 'แก้ไขข้อมูลพนักงานขับรถ' : 'เพิ่มพนักงานขับรถใหม่'}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{driver ? driver.fullname : 'Create driver'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
            <input required type="text" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#23b35b] transition-all font-bold text-slate-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ประเภทพนักงานขับรถ</label>
              <select value={formData.driver_type_code} onChange={(e) => setFormData({ ...formData, driver_type_code: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#23b35b] transition-all font-bold text-slate-700 cursor-pointer">
                <option value="01">พนักงานขับรถเป็นครั้งคราว</option>
                <option value="02">พนักงานขับรถยนต์</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">สถานะ</label>
              <select value={formData.is_active ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#23b35b] transition-all font-bold text-slate-700 cursor-pointer">
                <option value="true">พร้อมใช้งาน</option>
                <option value="false">ไม่พร้อมใช้งาน</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">หมายเหตุ</label>
            <textarea rows={4} value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#23b35b] transition-all font-bold text-slate-700 resize-none" />
          </div>
          <div className="flex gap-4 items-center pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</button>
            <button type="submit" disabled={loading} className="flex-[2] bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center justify-center disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : driver ? <Save className="w-5 h-5 mr-3" /> : <UserPlus className="w-5 h-5 mr-3" />}
              {driver ? 'บันทึกการแก้ไข' : 'เพิ่มพนักงานขับรถ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
