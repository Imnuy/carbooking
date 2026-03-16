import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.brand, c.model, c.license_plate, u.fullname as user_fullname 
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

    return NextResponse.json({ id: result.insertId, message: 'Booking created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
