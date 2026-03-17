'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/lib/swal';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id: number;
    fullname?: string | null;
    username: string;
    department?: string | null;
    role: 'admin' | 'user';
  } | null;
}

const emptyForm = {
  fullname: '',
  username: '',
  password: '',
  department: '',
  role: 'user' as 'admin' | 'user',
};

export default function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        username: user.username,
        password: '',
        department: user.department || '',
        role: user.role,
      });
      return;
    }

    setFormData(emptyForm);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(user ? `/api/users/${user.id}` : '/api/users', {
        method: user ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await showSuccess(user ? 'บันทึกการแก้ไขผู้ใช้เรียบร้อยแล้ว' : 'เพิ่มผู้ใช้เรียบร้อยแล้ว');
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
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              {user ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{user ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user ? `@${user.username}` : 'Create user'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
              <input required type="text" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-600 transition-all font-bold text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
              <input required type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-600 transition-all font-bold text-slate-700" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">{user ? 'รหัสผ่านใหม่' : 'รหัสผ่าน'}</label>
              <input type="password" required={!user} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={user ? 'เว้นว่างหากไม่เปลี่ยน' : ''} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-600 transition-all font-bold text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">แผนก / ฝ่าย</label>
              <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-600 transition-all font-bold text-slate-700" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ระดับสิทธิ์</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-600 transition-all font-bold text-slate-700 cursor-pointer">
              <option value="user">ผู้ใช้งาน</option>
              <option value="admin">ผู้ดูแลระบบ</option>
            </select>
          </div>
          <div className="flex gap-4 items-center pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</button>
            <button type="submit" disabled={loading} className="flex-[2] bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center justify-center disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : user ? <Save className="w-5 h-5 mr-3" /> : <UserPlus className="w-5 h-5 mr-3" />}
              {user ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
