import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function GET() {
  try {
    const bookings = await queryWithEncoding(
      `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname as owner_name 
       FROM bookings b 
       LEFT JOIN cars c ON b.car_id = c.id 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC`
    );

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      destination, 
      purpose,
      fuel_reimbursement,
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
    const result = await queryWithEncoding(
      `INSERT INTO bookings (
        user_id, 
        destination, 
        purpose,
        fuel_reimbursement,
        distance, 
        start_time, 
        end_time, 
        requester_name,
        requester_position,
        supervisor_name,
        supervisor_position,
        passengers,
        trip_type,
        status,
        created_at,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending', CURRENT_TIMESTAMP, 'admin') RETURNING id`,
      [
        1, 
        destination, 
        purpose,
        fuel_reimbursement,
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

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
