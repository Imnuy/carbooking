import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      destination, 
      distance, 
      start_time, 
      end_time,
      requester_name,
      requester_position,
      supervisor_name,
      supervisor_position,
      passengers,
      trip_type
    } = body;

    // Use user_id = 1 as default for now
    const [result] = await pool.query(
      `INSERT INTO bookings (
        user_id, 
        destination, 
        distance, 
        start_time, 
        end_time, 
        requester_name,
        requester_position,
        supervisor_name,
        supervisor_position,
        passengers,
        trip_type,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        1, 
        destination, 
        distance, 
        start_time, 
        end_time,
        requester_name,
        requester_position,
        supervisor_name,
        supervisor_position,
        passengers,
        trip_type || 'internal'
      ]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
