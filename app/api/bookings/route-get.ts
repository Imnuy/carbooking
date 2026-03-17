import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { ensureTripsSchema } from '@/lib/booking-trip';
import { ensureCarTypeSchema } from '@/lib/car-type';
import { ensureMasterDataSchema } from '@/lib/master-data';

export async function GET() {
  try {
    await ensureTripsSchema();
    await ensureCarTypeSchema();
    await ensureMasterDataSchema();
    const bookings = await queryWithEncoding(
      `SELECT
         b.*,
         b.status_id,
         bs.name AS status_text,
         COALESCE(t.car_id, b.car_id) AS car_id,
         COALESCE(t.driver_id, b.driver_id) AS driver_id,
         d.fullname AS driver_name,
         c.brand,
         c.model,
         c.license_plate,
         ct.name AS car_type,
         t.start_date_time AS trip_start_date_time,
         t.end_date_time AS trip_end_date_time
       FROM bookings b
       LEFT JOIN trips t ON b.trip_id = t.id
       LEFT JOIN cars c ON COALESCE(t.car_id, b.car_id) = c.id
       LEFT JOIN car_type ct ON c.car_type_id = ct.id
       LEFT JOIN drivers d ON COALESCE(t.driver_id, b.driver_id) = d.id
       LEFT JOIN booking_status bs ON b.status_id = bs.id
       ORDER BY b.created_at DESC`
    );

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
