import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { car_id, driver_name, status } = await request.json();
    const id = params.id;

    await pool.query(
      'UPDATE bookings SET car_id = ?, driver_name = ?, status = ? WHERE id = ?',
      [car_id || null, driver_name || null, status || 'pending', id]
    );

    return NextResponse.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
