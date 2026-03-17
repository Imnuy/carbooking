import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendNotification } from '@/lib/notifications';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.brand, c.model, c.license_plate, u.fullname as fullname 
      FROM bookings b 
      JOIN cars c ON b.car_id = c.id 
      JOIN users u ON b.user_id = u.id 
      ORDER BY b.id DESC
    `);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      user_id, car_id, start_time, end_time, destination, reason 
    } = data;

    // Optional: Check if car is available during this time
    // For now, we'll just insert
    const [result]: any = await pool.query(
      `INSERT INTO bookings (
        user_id, car_id, start_time, end_time, destination, reason, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [user_id, car_id, start_time, end_time, destination, reason, 'admin']
    );

    // Notify Admin (Assume Admin is user ID 1)
    try {
      const [user]: any = await pool.query('SELECT fullname FROM users WHERE id = ?', [user_id]);
      const [car]: any = await pool.query('SELECT brand, model, license_plate FROM cars WHERE id = ?', [car_id]);
      const userName = user[0]?.fullname || 'Unknown';
      const carInfo = `${car[0]?.brand} ${car[0]?.model} (${car[0]?.license_plate})`;
      
      const message = `🚗 <b>มีคำขอจองรถใหม่</b>\n\n👤 ผู้จอง: ${userName}\n🚘 รถ: ${carInfo}\n📍 จุดหมาย: ${destination}\n📅 เริ่ม: ${new Date(start_time).toLocaleString('th-TH')}\n🏁 สิ้นสุด: ${new Date(end_time).toLocaleString('th-TH')}\n📝 เหตุผล: ${reason}`;
      
      await sendNotification(message, 1);
    } catch (notifyErr) {
      console.error('Notification failed:', notifyErr);
    }

    return NextResponse.json({ id: result.insertId, message: 'Booking created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
