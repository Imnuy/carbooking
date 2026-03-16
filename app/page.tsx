import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export default async function DashboardPage() {
  const [carRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM cars');
  const [userRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
  const [bookingRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
  const [recentBookings] = await pool.query<RowDataPacket[]>(
    `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname 
     FROM bookings b 
     JOIN cars c ON b.car_id = c.id 
     JOIN users u ON b.user_id = u.id 
     ORDER BY b.created_at DESC LIMIT 5`
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 border-b pb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center shadow-lg transition-transform hover:scale-105">
          <div className="rounded-full bg-blue-100 p-4 text-blue-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Cars</div>
            <div className="text-3xl font-bold text-slate-800">{carRows[0].count}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center shadow-lg transition-transform hover:scale-105">
          <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Users</div>
            <div className="text-3xl font-bold text-slate-800">{userRows[0].count}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center shadow-lg transition-transform hover:scale-105">
          <div className="rounded-full bg-amber-100 p-4 text-amber-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pending Bookings</div>
            <div className="text-3xl font-bold text-slate-800">{bookingRows[0].count}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Recent Bookings</h2>
        </div>
        <div className="p-0">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-slate-500">No recent bookings found</td>
                </tr>
              ) : (
                recentBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{b.fullname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{b.brand} {b.model} ({b.license_plate})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(b.start_time).toLocaleDateString()} - {new Date(b.end_time).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          b.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
