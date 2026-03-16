import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col space-y-4">
      <div className="text-2xl font-bold mb-6 tracking-wide text-blue-400">
        CarBooking
      </div>
      
      <nav className="flex flex-col space-y-2 flex-grow">
        <Link href="/" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors">
          Dashboard
        </Link>
        <Link href="/cars" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors">
          Manage Cars
        </Link>
        <Link href="/bookings" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors">
          Bookings
        </Link>
        <Link href="/users" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors">
          Users
        </Link>
      </nav>
      
      <div className="pt-4 border-t border-slate-700 text-sm opacity-70">
        &copy; {new Date().getFullYear()} CarBooking
      </div>
    </div>
  );
}
