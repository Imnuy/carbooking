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
