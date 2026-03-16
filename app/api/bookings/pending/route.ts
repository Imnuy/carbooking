import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, requester_name, destination, start_time FROM bookings WHERE status = 'pending' ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
