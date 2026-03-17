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

export async function POST(request: Request) {
  try {
    await ensureCarNumberColumn();
    const { brand, model, license_plate, seats, car_type, car_number, is_active } = await request.json();

    await queryWithEncoding(
      `INSERT INTO cars (brand, model, license_plate, seats, car_type, car_number, is_active, created_by, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [brand, model, license_plate, seats, car_type, car_number || null, is_active ?? true, 'admin', 'admin']
    );

    return NextResponse.json({ message: 'Car added successfully' });
  } catch (error) {
    console.error('Error adding car:', error);
    return NextResponse.json({ error: 'Failed to add car' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureCarNumberColumn();
    const rows = await queryWithEncoding('SELECT * FROM cars ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
