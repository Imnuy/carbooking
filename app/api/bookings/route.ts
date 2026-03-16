import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, distance, start_time, end_time } = body;

    // Use user_id = 1 as default for now (as per user instruction: not locking user yet)
    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, destination, distance, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [1, destination, distance, start_time, end_time]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
