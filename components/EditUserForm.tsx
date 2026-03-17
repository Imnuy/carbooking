'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';

interface EditUserFormProps {
  user: {
    id: number;
    fullname?: string | null;
    username: string;
    department?: string | null;
    role: 'admin' | 'user';
  };
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user.fullname || '',
    username: user.username,
    password: '',
    department: user.department || '',
    role: user.role || 'user',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/users');
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
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
            <input required type="text" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อผู้ใช้งาน (Username)</label>
            <input required type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รหัสผ่านใหม่</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" placeholder="เว้นว่างหากไม่ต้องการเปลี่ยน" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">แผนก / ฝ่าย</label>
            <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ระดับสิทธิ์</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700">
              <option value="user">ผู้ใช้งาน</option>
              <option value="admin">ผู้ดูแลระบบ</option>
            </select>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end space-x-4">
          <Link href="/users" className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">ยกเลิก</Link>
          <button type="submit" disabled={loading} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
            บันทึกการแก้ไข
          </button>
        </div>
      </form>
    </div>
  );
}
