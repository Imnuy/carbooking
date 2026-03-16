import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { brand, model, license_plate, seats, car_type, status } = await request.json();
    const id = params.id;

    await pool.query(
      'UPDATE cars SET brand = ?, model = ?, license_plate = ?, seats = ?, car_type = ?, status = ? WHERE id = ?',
      [brand, model, license_plate, seats, car_type, status || 'active', id]
    );

    return NextResponse.json({ message: 'Car updated successfully' });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await pool.query('DELETE FROM cars WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
