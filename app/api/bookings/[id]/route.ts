import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { BOOKING_STATUS } from '@/lib/booking-flow';
import { ensureTripsSchema, resolveBookingStatusColumn, toDateKey } from '@/lib/booking-trip';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTripsSchema();
    const statusColumn = await resolveBookingStatusColumn();
    const body = await request.json();
    const { car_id, driver_id, driver_name, other_ids } = body;
    const { id } = await params;

    const isAssignmentPayload =
      Object.prototype.hasOwnProperty.call(body, 'car_id') ||
      Object.prototype.hasOwnProperty.call(body, 'driver_id') ||
      Object.prototype.hasOwnProperty.call(body, 'driver_name') ||
      Object.prototype.hasOwnProperty.call(body, 'other_ids');

    if (!isAssignmentPayload) {
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
        status_code,
      } = body;

      const passengerCount = Number(passengers);

      if (!requester_name || !requester_position || !supervisor_name || !supervisor_position) {
        return NextResponse.json({ error: 'Requester and supervisor information is required' }, { status: 400 });
      }

      if (!destination || !purpose || !start_time || !end_time) {
        return NextResponse.json({ error: 'Trip details are required' }, { status: 400 });
      }

      if (!Number.isFinite(passengerCount) || passengerCount < 1) {
        return NextResponse.json({ error: 'Passenger count must be at least 1' }, { status: 400 });
      }

      await queryWithEncoding(
        `UPDATE bookings
         SET destination = $1,
             purpose = $2,
             fuel_reimbursement = $3,
             distance = $4,
             start_time = $5,
             end_time = $6,
             requester_name = $7,
             requester_position = $8,
             supervisor_name = $9,
             supervisor_position = $10,
             passengers = $11,
             trip_type = $12,
             ${statusColumn} = $13,
             updated_by = $14
         WHERE id = $15`,
        [
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
          trip_type,
          status_code || BOOKING_STATUS.pending,
          'admin',
          id,
        ]
      );

      return NextResponse.json({ message: 'Booking updated successfully' });
    }

    const normalizedCarId = car_id ? Number(car_id) : null;
    const normalizedDriverId = driver_id ? Number(driver_id) : null;
    let normalizedDriverName = typeof driver_name === 'string' ? driver_name.trim() : '';

    if (normalizedDriverId && !normalizedDriverName) {
      const driverRows = await queryWithEncoding(
        'SELECT fullname FROM drivers WHERE id = $1 LIMIT 1',
        [normalizedDriverId]
      ) as { fullname: string }[];

      normalizedDriverName = driverRows[0]?.fullname?.trim() || '';
    }

    if (!normalizedCarId || !normalizedDriverId || !normalizedDriverName) {
      return NextResponse.json(
        { error: 'Car and driver are required before assigning a trip' },
        { status: 400 }
      );
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

      const dateKeys = Array.from(
        new Set(
          bookingRows.map((row) => toDateKey(row.start_time)).filter(Boolean)
        )
      );

      if (dateKeys.length > 1 || bookingRows.length !== targetIds.length) {
        return NextResponse.json(
          { error: 'Trips can only be merged when departure date is the same' },
          { status: 400 }
        );
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

    const tripStartDateTime = bookingRows
      .map((row) => row.start_time)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
    const tripEndDateTime = bookingRows
      .map((row) => row.end_time)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

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

    await queryWithEncoding(
      `UPDATE bookings
       SET trip_id = $1,
           car_id = $2,
           driver_id = $3,
           driver_name = $4,
           ${statusColumn} = $5,
           updated_by = $6
       WHERE id = ANY($7::int[])`,
      [tripId, normalizedCarId, normalizedDriverId, normalizedDriverName, BOOKING_STATUS.assigned, 'admin', targetIds]
    );

    return NextResponse.json({
      message: 'Bookings assigned successfully',
      trip_id: tripId,
      status_code: BOOKING_STATUS.assigned,
      affected_ids: targetIds,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTripsSchema();
    const { id } = await params;
    const bookingRows = await queryWithEncoding(
      'SELECT trip_id FROM bookings WHERE id = $1 LIMIT 1',
      [id]
    ) as { trip_id: number | null }[];

    const tripId = bookingRows[0]?.trip_id ?? null;

    await queryWithEncoding('DELETE FROM bookings WHERE id = $1', [id]);

    if (tripId) {
      const remainingRows = await queryWithEncoding(
        'SELECT id FROM bookings WHERE trip_id = $1 LIMIT 1',
        [tripId]
      ) as { id: number }[];

      if (remainingRows.length === 0) {
        await queryWithEncoding('DELETE FROM trips WHERE id = $1', [tripId]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
