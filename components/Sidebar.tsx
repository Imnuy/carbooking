"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Plus, 
  Building2, 
  User as UserIcon, 
  Key, 
  HelpCircle, 
  LogIn,
  User,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainItems = [
  { name: 'หน้าแรก', href: '/', icon: Home },
  { name: 'จองยานพาหนะ', href: '/bookings/add', icon: Plus },
  { name: 'รายการรถ', href: '/cars', icon: Building2 },
  { name: 'พนักงานขับรถ', href: '/drivers', icon: UserIcon },
  { name: 'รายการรถรออนุมัติ', href: '/bookings', icon: Key, badge: 3 },
];

const supportItems = [
  { name: 'แจ้งปัญหา/ข้อเสนอแนะ', href: '/support', icon: HelpCircle },
];

const accountItems = [
  { name: 'เข้าสู่ระบบ', href: '/login', icon: LogIn },
];

export default function Sidebar() {
  const pathname = usePathname();

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    
    return (
      <Link 
        href={item.href} 
        className={cn(
          "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ease-in-out font-bold text-[15px]",
          isActive 
            ? "bg-[#5550e6] text-white shadow-lg shadow-indigo-900/20" 
            : "text-slate-600 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center space-x-4">
          <Icon className={cn(
            "w-6 h-6",
            isActive ? "text-white" : "text-slate-500"
          )} />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
            isActive ? "bg-[#f14336] text-white" : "bg-red-500 text-white"
          )}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="w-80 bg-white min-h-screen p-6 flex flex-col border-r border-slate-100 shadow-sm overflow-y-auto no-scrollbar">
      {/* Profile Header Card */}
      <div className="bg-[#f8faff] rounded-2xl p-6 mb-8 flex items-center space-x-4 border border-indigo-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/50 rounded-bl-full -translate-y-2 translate-x-2"></div>
        <div className="w-14 h-14 bg-[#5550e6] rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
          <User className="text-white w-8 h-8 opacity-90" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-black text-slate-900 leading-tight">ผู้เยี่ยมชม</h2>
          <p className="text-slate-400 text-sm font-bold mt-0.5">กรุณาเข้าสู่ระบบ</p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-8">
        {/* Main Section */}
        <div>
          <h3 className="px-4 text-[13px] font-black uppercase tracking-widest text-slate-400 mb-4">หลัก</h3>
          <div className="flex flex-col space-y-1">
            {mainItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="px-4 text-[13px] font-black uppercase tracking-widest text-slate-400 mb-4">สนับสนุน</h3>
          <div className="flex flex-col space-y-1">
            {supportItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="mt-auto pt-4">
          <h3 className="px-4 text-[13px] font-black uppercase tracking-widest text-slate-400 mb-4">บัญชี</h3>
          <div className="flex flex-col space-y-1">
            {accountItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 px-4 text-[10px] uppercase tracking-widest text-slate-300 font-bold text-center italic">
        CARGO Booking System v1.2.0
      </div>
    </div>
  );
}
