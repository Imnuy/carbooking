export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { ensureTripsSchema, toDateKey } from '@/lib/booking-trip';
import {
  ensureMasterDataSchema,
  getBookingStatusIds,
  getDefaultFuelReimbursementId,
  getDefaultTripTypeId,
  isValidBookingStatus,
  isValidDepartment,
  isValidFuelReimbursement,
  isValidTripType,
} from '@/lib/master-data';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTripsSchema();
    await ensureMasterDataSchema();
    const body = await request.json();
    const { car_id, driver_id, other_ids } = body;
    const { id } = await params;

    const isAssignmentPayload =
      Object.prototype.hasOwnProperty.call(body, 'car_id') ||
      Object.prototype.hasOwnProperty.call(body, 'driver_id') ||
      Object.prototype.hasOwnProperty.call(body, 'other_ids');

    if (!isAssignmentPayload) {
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
        status_id,
      } = body;

      const passengerCount = Number(passengers);
      const normalizedTripTypeId = Number(trip_type_id) || await getDefaultTripTypeId();
      const normalizedFuelReimbursementId = Number(fuel_reimbursement_id) || await getDefaultFuelReimbursementId();
      const normalizedDepartmentId = Number(department_id);
      const normalizedStatusId = Number(status_id);
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

      if (normalizedStatusId && !(await isValidBookingStatus(normalizedStatusId))) {
        return NextResponse.json({ error: 'Invalid booking status' }, { status: 400 });
      }

      await queryWithEncoding(
        `UPDATE bookings
         SET destination = $1,
             purpose = $2,
             fuel_reimbursement_id = $3,
             distance = $4,
             start_time = $5,
             end_time = $6,
             requester_name = $7,
             requester_position = $8,
             supervisor_name = $9,
             supervisor_position = $10,
             department_id = $11,
             passengers = $12,
             trip_type_id = $13,
             status_id = $14
         WHERE id = $15`,
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
          normalizedStatusId || statusIds.pending,
          id,
        ]
      );

      return NextResponse.json({ message: 'Booking updated successfully' });
    }

    const normalizedCarId = car_id ? Number(car_id) : null;
    const normalizedDriverId = driver_id ? Number(driver_id) : null;

    if (!normalizedCarId || !normalizedDriverId) {
      return NextResponse.json({ error: 'Car and driver are required before assigning a trip' }, { status: 400 });
    }

    const targetIds = [Number(id), ...(Array.isArray(other_ids) ? other_ids.map(Number) : [])]
      .filter((value, index, array) => Number.isFinite(value) && array.indexOf(value) === index);

    if (targetIds.length > 1) {
      const bookingRows = await queryWithEncoding(
        `SELECT id, start_time, end_time, trip_id
         FROM bookings
         WHERE id = ANY($1::int[])`,
        [targetIds]
      ) as { id: number; start_time: string; end_time: string; trip_id: number | null }[];

      const dateKeys = Array.from(new Set(bookingRows.map((row) => toDateKey(row.start_time)).filter(Boolean)));

      if (dateKeys.length > 1 || bookingRows.length !== targetIds.length) {
        return NextResponse.json({ error: 'Trips can only be merged when departure date is the same' }, { status: 400 });
      }
    }

    const bookingRows = await queryWithEncoding(
      `SELECT id, start_time, end_time, trip_id
       FROM bookings
       WHERE id = ANY($1::int[])`,
      [targetIds]
    ) as { id: number; start_time: string; end_time: string; trip_id: number | null }[];

    const baseBooking = bookingRows.find((row) => row.id === Number(id)) || bookingRows[0];
    if (!baseBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const tripStartDateTime = bookingRows.map((row) => row.start_time).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
    const tripEndDateTime = bookingRows.map((row) => row.end_time).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

    let tripId = baseBooking.trip_id;

    if (tripId) {
      await queryWithEncoding(
        `UPDATE trips
         SET car_id = $1,
             driver_id = $2,
             start_date_time = $3,
             end_date_time = $4,
             updated_at = CURRENT_TIMESTAMP,
             updated_by = $5
         WHERE id = $6`,
        [normalizedCarId, normalizedDriverId, tripStartDateTime, tripEndDateTime, 'admin', tripId]
      );
    } else {
      const createdTrips = await queryWithEncoding(
        `INSERT INTO trips (
           car_id,
           driver_id,
           start_date_time,
           end_date_time,
           created_at,
           updated_at,
           created_by,
           updated_by
         ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5, $6)
         RETURNING id`,
        [normalizedCarId, normalizedDriverId, tripStartDateTime, tripEndDateTime, 'admin', 'admin']
      ) as { id: number }[];

      tripId = createdTrips[0]?.id ?? null;
    }

    if (!tripId) {
      return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
    }

    const statusIds = await getBookingStatusIds();
    await queryWithEncoding(
      `UPDATE bookings
       SET trip_id = $1,
           car_id = $2,
           driver_id = $3,
           status_id = $4
       WHERE id = ANY($5::int[])`,
      [tripId, normalizedCarId, normalizedDriverId, statusIds.assigned, targetIds]
    );

    return NextResponse.json({
      message: 'Bookings assigned successfully',
      trip_id: tripId,
      status_id: statusIds.assigned,
      affected_ids: targetIds,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTripsSchema();
    await ensureMasterDataSchema();
    const { id } = await params;

    const bookingRows = await queryWithEncoding(
      'SELECT trip_id FROM bookings WHERE id = $1 LIMIT 1',
      [id]
    ) as { trip_id: number | null }[];
    const tripId = bookingRows[0]?.trip_id ?? null;

    const statusIds = await getBookingStatusIds();
    await queryWithEncoding(
      'UPDATE bookings SET status_id = $1, trip_id = NULL, car_id = NULL, driver_id = NULL WHERE id = $2',
      [statusIds.cancelled, id]
    );

    if (tripId) {
      const remaining = await queryWithEncoding(
        `SELECT start_time, end_time FROM bookings
         WHERE trip_id = $1 AND status_id != $2`,
        [tripId, statusIds.cancelled]
      ) as { start_time: string; end_time: string }[];

      if (remaining.length === 0) {
        await queryWithEncoding('DELETE FROM trips WHERE id = $1', [tripId]);
      } else {
        const newStart = remaining.map((r) => r.start_time).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
        const newEnd = remaining.map((r) => r.end_time).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
        await queryWithEncoding(
          'UPDATE trips SET start_date_time = $1, end_date_time = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [newStart, newEnd, tripId]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
