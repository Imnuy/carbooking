"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  User, 
  Shield, 
  Key, 
  Building2,
  AlertCircle,
  Loader2,
  X,
  Save,
  ShieldCheck,
  Camera,
  Check,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/imageUtils';

export default function UsersPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Image Cropper States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    role: 'user',
    department: '',
    image_url: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else if (res.status === 401 || res.status === 403) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const handleOpenModal = (user: any = null) => {
    setIsCropping(false);
    setImageSrc(null);
    if (user) {
      setEditingUser(user);
      setFormData({
        fullname: user.fullname || '',
        username: user.username || '',
        password: user.password || '',
        role: user.role || 'user',
        department: user.department || '',
        image_url: user.image_url || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullname: '',
        username: '',
        password: '',
        role: 'user',
        department: '',
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setFormData(prev => ({ ...prev, image_url: croppedImage }));
        setIsCropping(false);
        setImageSrc(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCropping) return;
    
    setSubmitting(true);
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const err = await res.json();
        alert('เกิดข้อผิดพลาด: ' + err.error);
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: any) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรหัสผู้ใช้ ${user.fullname}?`)) {
      try {
        const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchUsers();
        } else {
          const err = await res.json();
          alert('ไม่สามารถลบข้อมูลได้: ' + err.error);
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullname.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">การจัดการผู้ใช้งาน</h1>
          <p className="text-slate-500 font-medium text-lg mt-1 italic">จัดการสิทธิ์และรหัสผ่านสำหรับเข้าใช้งานระบบ</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#5550e6] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-900/20 flex items-center hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/20">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, ชื่อผู้ใช้ หรือแผนก..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="font-bold text-slate-400 animate-pulse">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ข้อมูลผู้ใช้</th>
                  <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">บทบาท / สิทธิ์</th>
                  <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest italic">รหัสผ่าน</th>
                  <th className="px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-105 transition-transform text-slate-400 overflow-hidden">
                          {u.image_url ? (
                            <img src={u.image_url} alt={u.fullname} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8" />
                          )}
                        </div>
                        <div>
                          <div className="text-xl font-black text-slate-900">{u.fullname}</div>
                          <div className="text-sm font-bold text-slate-400 mt-0.5">@{u.username} • {u.department || 'ไม่ระบุแผนก'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={cn(
                        "inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border",
                        u.role === 'admin' 
                          ? 'bg-rose-50 text-rose-600 border-rose-100' 
                          : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      )}>
                        {u.role === 'admin' ? <Shield className="w-3 h-3 mr-2" /> : <User className="w-3 h-3 mr-2" />}
                        {u.role === 'admin' ? 'Administrator' : 'General User'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-2 text-slate-400 font-mono text-sm">
                        <Key className="w-4 h-4" />
                        <span>••••••••</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleOpenModal(u)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-500 hover:border-amber-100 hover:shadow-xl transition-all shadow-sm">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(u)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:shadow-xl transition-all shadow-sm">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่'}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">รายละเอียดข้อมูลบัญชีผู้ใช้งาน</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Upload & Resize */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">รูปโปรไฟล์</h3>
                  
                  {isCropping ? (
                    <div className="w-full space-y-4">
                      <div className="relative w-full aspect-square bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
                        <Cropper
                          image={imageSrc!}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>ย่อ/ขยาย</span>
                          <span>{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          value={zoom}
                          min={1}
                          max={3}
                          step={0.1}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setIsCropping(false)}
                          className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                        >
                          ยกเลิก
                        </button>
                        <button 
                          type="button"
                          onClick={handleConfirmCrop}
                          className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 mr-2" /> ยืนยัน
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                               <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({ ...prev, image_url: '' }));
                                }}
                                className="p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                                title="ลบรูป"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <User className="w-12 h-12 text-slate-200 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">อัปโหลดรูป</p>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Info Fields */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.fullname}
                      onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" 
                      placeholder="ระบุชื่อจริงและนามสกุล..." 
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อเรียก/แผนก</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" 
                          placeholder="ระบุแผนก..." 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">บทบาท</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700 appearance-none"
                    >
                      <option value="user">User (ผู้ใช้ทั่วไป)</option>
                      <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">ชื่อผู้ใช้ (Username)</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" 
                    placeholder="เช่น admin, user01..." 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">รหัสผ่าน (Password)</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700" 
                      placeholder="ระบุรหัสผ่าน..." 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-10 border-t border-slate-50 sticky bottom-0 bg-white pb-2 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  disabled={submitting || isCropping}
                  type="submit" 
                  className="bg-[#5550e6] text-white px-10 py-5 rounded-3xl font-black text-sm shadow-2xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all flex items-center group disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
                  {editingUser ? 'บันทึกการแก้ไข' : 'ลงทะเบียนผู้ใช้งาน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
