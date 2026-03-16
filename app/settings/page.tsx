"use client";

import { useState, useEffect } from 'react';
import { 
  Bell, 
  MessageCircle, 
  Send, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [settings, setSettings] = useState({
    line_notification: false,
    line_token: '',
    telegram_notification: false,
    telegram_chat_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, authRes] = await Promise.all([
          fetch('/api/user/settings'),
          fetch('/api/auth')
        ]);
        
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.user.role !== 'admin') {
            const router = (await import('next/navigation')).useRouter();
            window.location.href = '/';
            return;
          }
        } else {
          window.location.href = '/login';
          return;
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings({
            line_notification: !!data.line_notification,
            line_token: data.line_token || '',
            telegram_notification: !!data.telegram_notification,
            telegram_chat_id: data.telegram_chat_id || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'บันทึกการตั้งค่าเรียบร้อยแล้ว' });
      } else {
        setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#5550e6] animate-spin" />
        <p className="font-black text-slate-400 animate-pulse uppercase tracking-[0.2em] text-[10px]">กำลังโหลดข้อมูลการตั้งค่า...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-[#5550e6] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-900/20">
          <Bell className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">ตั้งค่าการแจ้งเตือน</h1>
          <p className="text-slate-500 font-medium italic">เลือกช่องทางการรับการแจ้งเตือนเมื่อมีการจองหรือการอนุมัติรถยนต์</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Line Notification Settings */}
          <div className={cn(
            "p-8 rounded-[2.5rem] border transition-all duration-300",
            settings.line_notification 
              ? "bg-emerald-50/30 border-emerald-100 shadow-xl shadow-emerald-900/5" 
              : "bg-white border-slate-100 shadow-sm"
          )}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors",
                  settings.line_notification ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-tight">Line Notify</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 whitespace-nowrap">แจ้งเตือนผ่านกลุ่ม Line</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.line_notification}
                  onChange={(e) => setSettings({...settings, line_notification: e.target.checked})}
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className={cn("space-y-4 transition-all duration-300", settings.line_notification ? "opacity-100" : "opacity-30 pointer-events-none grayscale")}>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Line Notify Token</label>
                <input 
                  type="text"
                  placeholder="กรอก Token สำหรับ Line Notify"
                  value={settings.line_token}
                  onChange={(e) => setSettings({...settings, line_token: e.target.value})}
                  className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic border-l-2 border-emerald-200 pl-3">
                * สร้าง Token ได้ที่ <a href="https://notify-bot.line.me/" target="_blank" className="text-emerald-600 underline">Line Notify</a> และดึงเข้ากลุ่มที่ต้องการแจ้งเตือน
              </p>
            </div>
          </div>

          {/* Telegram Notification Settings */}
          <div className={cn(
            "p-8 rounded-[2.5rem] border transition-all duration-300",
            settings.telegram_notification 
              ? "bg-sky-50/30 border-sky-100 shadow-xl shadow-sky-900/5" 
              : "bg-white border-slate-100 shadow-sm"
          )}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors",
                  settings.telegram_notification ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-tight">Telegram</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 whitespace-nowrap">แจ้งเตือนผ่านบอท Telegram</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.telegram_notification}
                  onChange={(e) => setSettings({...settings, telegram_notification: e.target.checked})}
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
            </div>

            <div className={cn("space-y-4 transition-all duration-300", settings.telegram_notification ? "opacity-100" : "opacity-30 pointer-events-none grayscale")}>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Telegram Chat ID</label>
                <input 
                  type="text"
                  placeholder="กรอก Chat ID (เช่น -1001234567)"
                  value={settings.telegram_chat_id}
                  onChange={(e) => setSettings({...settings, telegram_chat_id: e.target.value})}
                  className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-sky-500 transition-all shadow-inner"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic border-l-2 border-sky-200 pl-3">
                * ใช้บอทแจ้งเตือนของคุณในการส่งข้อความอัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className={cn(
            "p-6 rounded-3xl flex items-center animate-in slide-in-from-top-4 border",
            message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
          )}>
            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 mr-3" /> : <AlertCircle className="w-6 h-6 mr-3" />}
            <span className="font-black text-sm">{message.text}</span>
          </div>
        )}

        <button 
          disabled={saving}
          type="submit"
          className="w-full bg-[#5550e6] text-white py-6 rounded-[2rem] font-black text-sm shadow-2xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center group disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Save className="w-6 h-6 mr-3 group-hover:-translate-y-1 transition-transform" />
              บันทึกการตั้งค่าทั้งหมด
            </>
          )}
        </button>
      </form>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Smartphone className="w-32 h-32" />
        </div>
        <div className="relative">
          <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">ทำไมต้องตั้งค่าการแจ้งเตือน?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="flex space-x-4">
               <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
               <p className="text-sm font-bold text-slate-500 leading-relaxed italic">รับการแจ้งเตือนทันทีเมื่อแอดมินอนุมัติการจองรถยนต์ของคุณ เพื่อเตรียมความพร้อมในการเดินทาง</p>
            </div>
            <div className="flex space-x-4">
               <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
               <p className="text-sm font-bold text-slate-500 leading-relaxed italic">สำหรับสถานะผู้ดูแล (Admin) จะได้รับการแจ้งเตือนทุกครั้งที่มีการสร้างคำขอจองรถใหม่ในระบบ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
