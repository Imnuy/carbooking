"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, User, Lock, Loader2, Car, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'การเข้าสู่ระบบล้มเหลว');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[450px] space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-[#5550e6] rounded-[2rem] shadow-2xl shadow-indigo-900/20 mb-2">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cargo Booking</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">ระบบจองยานพาหนะส่วนกลาง</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">เข้าสู่ระบบ</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อผู้ใช้งาน</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รหัสผ่าน</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-sm font-bold flex items-center animate-in slide-in-from-top-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 flex-shrink-0 animate-pulse"></span>
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#5550e6] text-white py-5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  เข้าสู่ระบบ
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest italic">
            Cargo Booking System &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
