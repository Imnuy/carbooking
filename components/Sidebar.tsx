"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CalendarCheck, 
  Car, 
  User,
  Users, 
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'รายการขอใช้รถ', href: '/bookings', icon: CalendarCheck },
  { name: 'จัดการยานพาหนะ', href: '/cars', icon: Car },
  { name: 'จัดการพนักงานขับรถ', href: '/drivers', icon: User },
  { name: 'จัดการผู้ใช้งาน', href: '/users', icon: Users },
];

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, isCollapsed = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 bg-white text-[#245239] transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:self-start lg:overflow-y-auto p-2.5 flex flex-col border-r border-[#bde7c6] shadow-sm",
      isCollapsed ? "w-12" : "w-56",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className={cn(
          "flex items-center space-x-2.5",
          isCollapsed && "justify-center"
        )}>
          <div className="w-9 h-9 bg-[#0a8f3c] rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm">
            PLK
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <div className="text-lg font-black tracking-tight text-[#25563b]">PLKCar</div>
              <div className="text-xs font-semibold text-[#22a650]">ระบบขอใช้รถ</div>
            </div>
          )}
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-[#6aa57a] hover:text-[#245239] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex flex-col space-y-1 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name}
              href={item.href} 
              onClick={onClose}
              className={cn(
                "group flex items-center px-2.5 py-2 rounded-xl transition-all duration-200 ease-in-out font-semibold text-[13px]",
                isCollapsed ? "justify-center" : "space-x-2",
                isActive 
                  ? "bg-[#d9f7de] text-[#1a5e35] border border-[#c4eccd]" 
                  : "hover:bg-[#f2fbf3] text-[#245239]"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
                isActive ? "bg-[#ecfbef]" : "bg-[#edf9f0] group-hover:bg-[#dff5e4]"
              )}>
                <Icon className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-[#22a650]" : "text-[#2ca85b]"
                )} />
              </div>
              {!isCollapsed && <span className="flex-1">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      <div className="pt-3 border-t border-[#e2f4e6] mt-auto">
        <button 
          className={cn(
            "flex items-center px-2.5 py-2 w-full rounded-xl hover:bg-[#f2fbf3] transition-all duration-200 text-[#6b9381] font-medium group text-[13px]",
            isCollapsed ? "justify-center" : "space-x-2"
          )}
          title={isCollapsed ? "ออกจากระบบ" : undefined}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
          {!isCollapsed && <span>ออกจากระบบ</span>}
        </button>
        {!isCollapsed && (
          <div className="mt-2.5 px-2.5 text-[10px] uppercase tracking-widest text-[#8cb198] font-bold">
            Admin v1.2.0
          </div>
        )}
      </div>
    </div>
  );
}
