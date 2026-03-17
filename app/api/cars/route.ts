import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { ensureCarTypeSchema, resolveCarTypeId } from '@/lib/car-type';

export async function POST(request: Request) {
  try {
    await ensureCarTypeSchema();
    const { brand, model, license_plate, seats, car_type_id, car_type, car_number, is_active } = await request.json();
    const resolvedCarTypeId = await resolveCarTypeId({
      car_type_id: typeof car_type_id === 'number' ? car_type_id : Number(car_type_id),
      car_type,
    });

    await queryWithEncoding(
      `SELECT setval(
         pg_get_serial_sequence('cars', 'id'),
         COALESCE((SELECT MAX(id) FROM cars), 0) + 1,
         false
       )`
    );

    await queryWithEncoding(
      `INSERT INTO cars (brand, model, license_plate, seats, car_type_id, car_type, car_number, is_active, created_by, updated_by)
       VALUES ($1, $2, $3, $4, $5, (SELECT name FROM car_type WHERE id = $5), $6, $7, $8, $9)`,
      [brand, model, license_plate, seats, resolvedCarTypeId, car_number || null, is_active ?? true, 'admin', 'admin']
    );

    return NextResponse.json({ message: 'Car added successfully' });
  } catch (error) {
    console.error('Error adding car:', error);
    return NextResponse.json({ error: 'Failed to add car' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureCarTypeSchema();
    const rows = await queryWithEncoding(
      `SELECT c.id, c.brand, c.model, c.license_plate, c.car_number, c.seats, c.car_type_id, ct.name AS car_type, c.is_active
       FROM cars c
       LEFT JOIN car_type ct ON c.car_type_id = ct.id
       ORDER BY c.id DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
