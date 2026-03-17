import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';

let carSchemaReady = false;

async function ensureCarNumberColumn() {
  if (carSchemaReady) {
    return;
  }

  await queryWithEncoding('ALTER TABLE cars ADD COLUMN IF NOT EXISTS car_number VARCHAR(50)');
  carSchemaReady = true;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureCarNumberColumn();
    const { brand, model, license_plate, seats, car_type, car_number, is_active } = await request.json();
    const { id } = await params;

    await queryWithEncoding(
      'UPDATE cars SET brand = $1, model = $2, license_plate = $3, seats = $4, car_type = $5, car_number = $6, is_active = $7 WHERE id = $8',
      [
        brand,
        model,
        license_plate,
        seats,
        car_type,
        car_number || null,
        is_active !== undefined ? is_active : true,
        id,
      ]
    );

    return NextResponse.json({ message: 'Car updated successfully' });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await queryWithEncoding('DELETE FROM cars WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
