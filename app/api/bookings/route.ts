import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { ensureTripsSchema } from '@/lib/booking-trip';
import { ensureCarTypeSchema } from '@/lib/car-type';
import {
  ensureMasterDataSchema,
  getBookingStatusIds,
  getDefaultFuelReimbursementId,
  getDefaultTripTypeId,
  isValidDepartment,
  isValidFuelReimbursement,
  isValidTripType,
} from '@/lib/master-data';

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
         t.end_date_time AS trip_end_date_time,
         tt.name AS trip_type_name,
         fr.name AS fuel_reimbursement_name,
         dp.name AS department_name
       FROM bookings b
       LEFT JOIN trips t ON b.trip_id = t.id
       LEFT JOIN cars c ON COALESCE(t.car_id, b.car_id) = c.id
       LEFT JOIN car_type ct ON c.car_type_id = ct.id
       LEFT JOIN drivers d ON COALESCE(t.driver_id, b.driver_id) = d.id
       LEFT JOIN booking_status bs ON b.status_id = bs.id
       LEFT JOIN trip_type tt ON b.trip_type_id = tt.id
       LEFT JOIN fuel_reimbursement fr ON b.fuel_reimbursement_id = fr.id
       LEFT JOIN department dp ON b.department_id = dp.id
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
    await ensureCarTypeSchema();
    await ensureMasterDataSchema();
    const body = await request.json();
    const {
      destination,
      purpose,
      fuel_reimbursement_id,
      distance,
      start_time,
      end_time,
      requester_name,
      requester_position,
      supervisor_name,
      supervisor_position,
      department_id,
      passengers,
      trip_type_id,
    } = body;

    const passengerCount = Number(passengers);
    const normalizedTripTypeId = Number(trip_type_id) || await getDefaultTripTypeId();
    const normalizedFuelReimbursementId = Number(fuel_reimbursement_id) || await getDefaultFuelReimbursementId();
    const normalizedDepartmentId = Number(department_id);
    const statusIds = await getBookingStatusIds();

    if (!requester_name || !requester_position || !supervisor_name || !supervisor_position) {
      return NextResponse.json({ error: 'Requester and supervisor information is required' }, { status: 400 });
    }

    if (!normalizedDepartmentId || !(await isValidDepartment(normalizedDepartmentId))) {
      return NextResponse.json({ error: 'Department is required' }, { status: 400 });
    }

    if (!destination || !purpose || !start_time || !end_time) {
      return NextResponse.json({ error: 'Trip details are required' }, { status: 400 });
    }

    if (!Number.isFinite(passengerCount) || passengerCount < 1) {
      return NextResponse.json({ error: 'Passenger count must be at least 1' }, { status: 400 });
    }

    if (!normalizedTripTypeId || !(await isValidTripType(normalizedTripTypeId))) {
      return NextResponse.json({ error: 'Invalid trip type' }, { status: 400 });
    }

    if (!normalizedFuelReimbursementId || !(await isValidFuelReimbursement(normalizedFuelReimbursementId))) {
      return NextResponse.json({ error: 'Invalid fuel reimbursement' }, { status: 400 });
    }

    const result = await queryWithEncoding(
      `INSERT INTO bookings (
        destination,
        purpose,
        fuel_reimbursement_id,
        distance,
        start_time,
        end_time,
        requester_name,
        requester_position,
        supervisor_name,
        supervisor_position,
        department_id,
        passengers,
        trip_type_id,
        status_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
      RETURNING id`,
      [
        destination,
        purpose,
        normalizedFuelReimbursementId,
        distance !== '' && distance !== null && distance !== undefined ? Number(distance) : null,
        start_time,
        end_time,
        requester_name,
        requester_position,
        supervisor_name,
        supervisor_position,
        normalizedDepartmentId,
        passengerCount,
        normalizedTripTypeId,
        statusIds.pending,
      ]
    ) as { id: number }[];

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Database error while creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
