"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  CalendarCheck, 
  Users, 
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'แผงควบคุม', href: '/', icon: LayoutDashboard },
  { name: 'จัดการยานพาหนะ', href: '/cars', icon: Car },
  { name: 'รายการจองรถ', href: '/bookings', icon: CalendarCheck },
  { name: 'จัดการผู้ใช้งาน', href: '/users', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-slate-950 text-slate-300 min-h-screen p-6 flex flex-col border-r border-slate-800 shadow-2xl">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Car className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-black tracking-tight text-white italic">PLK<span className="text-blue-500">Car</span></span>
      </div>
      
      <nav className="flex flex-col space-y-1.5 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={cn(
                "group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out font-medium",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1" 
                  : "hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="pt-6 border-t border-slate-900 mt-auto">
        <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl hover:bg-red-900/20 hover:text-red-400 transition-all duration-200 text-slate-500 font-medium group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>ออกจากระบบ</span>
        </button>
        <div className="mt-4 px-4 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
          Admin v1.2.0
        </div>
      </div>
    </div>
  );
}
