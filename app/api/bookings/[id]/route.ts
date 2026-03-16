import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { car_id, driver_name, status, other_ids } = await request.json();
    const id = params.id;

    // Update main booking
    await pool.query(
      'UPDATE bookings SET car_id = ?, driver_name = ?, status = ? WHERE id = ?',
      [car_id || null, driver_name || null, status || 'pending', id]
    );

    // Update other bookings if provided
    if (Array.isArray(other_ids) && other_ids.length > 0) {
      await pool.query(
        'UPDATE bookings SET car_id = ?, driver_name = ?, status = ? WHERE id IN (?)',
        [car_id || null, driver_name || null, status || 'pending', other_ids]
      );
    }

    return NextResponse.json({ message: 'Bookings updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
