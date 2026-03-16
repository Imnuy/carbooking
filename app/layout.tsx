import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ระบบขอใช้รถยนต์ออนไลน์',
  description: 'ระบบจัดการการขอใช้รถยนต์ของหน่วยงาน',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-slate-50 min-h-screen`}>
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto text-slate-900 flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
          <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium italic">
            © 2026 ระบบขอใช้รถยนต์ออนไลน์ PLKCar - พัฒนาเพื่อความสะดวกของบุคลากร
          </footer>
        </main>
      </body>
    </html>
  );
}
