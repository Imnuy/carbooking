import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { BOOKING_STATUS, isTripType } from '@/lib/booking-flow';
import { ensureTripsSchema, resolveBookingStatusColumn } from '@/lib/booking-trip';

export async function GET() {
  try {
    await ensureTripsSchema();
    const statusColumn = await resolveBookingStatusColumn();
    const bookings = await queryWithEncoding(
      `SELECT
         b.*,
         b.${statusColumn} AS status_code,
         COALESCE(t.car_id, b.car_id) AS car_id,
         COALESCE(t.driver_id, b.driver_id) AS driver_id,
         COALESCE(d.fullname, b.driver_name) AS driver_name,
         c.brand,
         c.model,
         c.license_plate,
         u.fullname as owner_name,
         bs.status as status_text,
         t.start_date_time AS trip_start_date_time,
         t.end_date_time AS trip_end_date_time
       FROM bookings b
       LEFT JOIN trips t ON b.trip_id = t.id
       LEFT JOIN cars c ON COALESCE(t.car_id, b.car_id) = c.id
       LEFT JOIN drivers d ON COALESCE(t.driver_id, b.driver_id) = d.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN booking_status bs ON b.${statusColumn} = bs.code
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
    await ensureTripsSchema();
    const statusColumn = await resolveBookingStatusColumn();
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
      trip_type,
    } = body;

    const passengerCount = Number(passengers);
    const normalizedTripType = typeof trip_type === 'string' && isTripType(trip_type) ? trip_type : 'internal';

    if (!requester_name || !requester_position || !supervisor_name || !supervisor_position) {
      return NextResponse.json({ error: 'Requester and supervisor information is required' }, { status: 400 });
    }

    if (!destination || !purpose || !start_time || !end_time) {
      return NextResponse.json({ error: 'Trip details are required' }, { status: 400 });
    }

    if (!Number.isFinite(passengerCount) || passengerCount < 1) {
      return NextResponse.json({ error: 'Passenger count must be at least 1' }, { status: 400 });
    }

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
        ${statusColumn},
        created_at,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, $15)
      RETURNING id`,
      [
        1,
        destination,
        purpose,
        fuel_reimbursement || null,
        distance !== '' && distance !== null && distance !== undefined ? Number(distance) : null,
        start_time,
        end_time,
        requester_name,
        requester_position,
        supervisor_name,
        supervisor_position,
        passengerCount,
        normalizedTripType,
        BOOKING_STATUS.pending,
        'requester',
      ]
    );

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Database error while creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
