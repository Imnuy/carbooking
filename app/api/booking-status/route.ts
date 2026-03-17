import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function GET() {
  try {
    const bookingStatuses = await queryWithEncoding(
      'SELECT id, code, status, description FROM booking_status ORDER BY id ASC'
    );

    return NextResponse.json(bookingStatuses);
  } catch (error) {
    console.error('Error fetching booking statuses:', error);
    return NextResponse.json({ error: 'Failed to fetch booking statuses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, status, description } = body;

    const result = await queryWithEncoding(
      `INSERT INTO booking_status (code, status, description, created_by, updated_by) 
       VALUES ($1, $2, $3, 'admin', 'admin') RETURNING id`,
      [code, status, description || null]
    );

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error creating booking status:', error);
    return NextResponse.json({ error: 'Failed to create booking status' }, { status: 500 });
  }
}
