'use client';

import type { Metadata } from 'next';
import { Noto_Sans_Thai, Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { Menu, X, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const notoCity = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-noto-thai',
  weight: ['100', '300', '400', '500', '700', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="th">
      <body className={`${notoCity.variable} ${inter.variable} font-sans antialiased flex bg-slate-50 min-h-screen relative overflow-x-hidden`}>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/10">
                <Car className="text-white w-5 h-5" />
              </div>
              <span className="text-xl tracking-tight text-slate-900 italic">PLK<span className="text-blue-500">Car</span></span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto text-slate-900 flex flex-col">
            <div className="flex-grow">
              {children}
            </div>
            <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-[10px] md:text-xs font-medium italic mb-6">
              © 2026 ระบบขอใช้รถยนต์ออนไลน์ PLKCar - พัฒนาเพื่อความสะดวกของบุคลากร
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
