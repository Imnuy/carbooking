import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { BOOKING_STATUS } from '@/lib/booking-flow';
import { ensureTripsSchema, resolveBookingStatusColumn } from '@/lib/booking-trip';

export async function GET() {
  try {
    await ensureTripsSchema();
    const statusColumn = await resolveBookingStatusColumn();
    const rows = await queryWithEncoding(
      `SELECT id, trip_id, requester_name, destination, start_time, end_time, trip_type, passengers
       FROM bookings
       WHERE ${statusColumn} = $1
       ORDER BY created_at DESC`,
      [BOOKING_STATUS.pending]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
