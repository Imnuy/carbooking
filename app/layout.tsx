'use client';

import Link from 'next/link';
import { Geist } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ChevronLeft, ChevronRight, Plus, ArrowLeft } from 'lucide-react';

const appFont = Geist({
  subsets: ['latin'],
  variable: '--font-app',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    '/bookings': 'รายการขอใช้รถ',
    '/cars': 'การจัดการยานพาหนะ',
    '/drivers': 'จัดการพนักงานขับรถ',
    '/users': 'จัดการผู้ใช้งาน',
    '/cars/add': 'เพิ่มรถยนต์คันใหม่',
    '/bookings/add': 'สร้างใบขอใช้รถใหม่',
    '/users/add': 'เพิ่มผู้ใช้งานใหม่',
    '/drivers/add': 'เพิ่มพนักงานขับรถใหม่',
  };

  const currentTitle = pageTitles[pathname] || 'PLKCar';

  const headerAction = (() => {
    switch (pathname) {
      case '/bookings':
        return {
          href: '/bookings/add',
          label: 'สร้างใบขอใช้รถใหม่',
          mobileLabel: 'สร้างใบขอ',
          icon: Plus,
          className: 'bg-[#23b35b] text-white hover:bg-[#1ea651]',
        };
      case '/cars/add':
        return {
          href: '/cars',
          label: 'กลับ',
          mobileLabel: 'กลับ',
          icon: ArrowLeft,
          className: 'border border-[#b7e8c0] bg-white text-[#1f6b3b] hover:bg-[#f2fbf3]',
        };
      case '/bookings/add':
        return {
          href: '/bookings',
          label: 'กลับ',
          mobileLabel: 'กลับ',
          icon: ArrowLeft,
          className: 'border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50',
        };
      case '/users/add':
      case '/drivers/add':
        return {
          href: pathname.startsWith('/drivers') ? '/drivers' : '/users',
          label: 'กลับ',
          mobileLabel: 'กลับ',
          icon: ArrowLeft,
          className: 'border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50',
        };
      default:
        return null;
    }
  })();

  return (
    <html lang="th">
      <body className={`${appFont.variable} font-sans antialiased flex min-h-screen relative overflow-x-hidden`}>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-[#2d5f41]/15 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
          <header className="hidden lg:flex h-[74px] bg-[#ddf7e2]/95 border-b border-[#9ee0ae] items-center justify-between px-6 sticky top-0 z-30 backdrop-blur">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 text-[#1f6b3b] hover:bg-white/70 rounded-xl transition-colors border border-transparent hover:border-[#b7e8c0]"
                title={isSidebarCollapsed ? 'ขยายเมนู' : 'หุบเมนู'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <div className="flex items-center">
                <span className="text-xl tracking-tight text-[#196334] font-black">{currentTitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div id="header-extra-actions" className="flex items-center gap-2" />
              {headerAction && (
                <Link
                  href={headerAction.href}
                  className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all ${headerAction.className}`}
                >
                  <headerAction.icon className="mr-2 h-4 w-4" />
                  {headerAction.label}
                </Link>
              )}
            </div>
          </header>

          <header className="lg:hidden h-16 bg-[#ddf7e2]/95 border-b border-[#9ee0ae] flex items-center justify-between px-4 sticky top-0 z-30 backdrop-blur">
            <div className="flex items-center space-x-3">
              <span className="text-lg tracking-tight text-[#196334] font-black">{currentTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <div id="header-extra-actions-mobile" className="flex items-center gap-2" />
              {headerAction && (
                <Link
                  href={headerAction.href}
                  className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-all ${headerAction.className}`}
                >
                  <headerAction.icon className="h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">{headerAction.mobileLabel}</span>
                </Link>
              )}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-[#1f6b3b] hover:bg-white/70 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </header>

          <main className="flex-1 p-3 md:p-6 overflow-y-auto w-full text-slate-900 flex flex-col">
            <div className="flex-grow">{children}</div>
            <footer className="mt-10 pt-6 border-t border-[#d7efdb] text-center text-[#5d8a68] text-[10px] md:text-xs font-medium italic mb-4">
              © 2026 ระบบขอใช้รถยนต์ออนไลน์ PLKCar - พัฒนาเพื่อความสะดวกของบุคลากร
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
