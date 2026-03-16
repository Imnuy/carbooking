import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { brand, model, license_plate, seats, car_type, is_active } = await request.json();
    const id = params.id;

    await queryWithEncoding(
      'UPDATE cars SET brand = $1, model = $2, license_plate = $3, seats = $4, car_type = $5, is_active = $6 WHERE id = $7',
      [brand, model, license_plate, seats, car_type, is_active !== undefined ? is_active : true, id]
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
    await queryWithEncoding('DELETE FROM cars WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
