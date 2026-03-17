import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

async function hasDriverTypeSchema() {
  const [driverTypeTable] = await queryWithEncoding(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'driver_type'
     ) AS exists`
  );
  const [driverTypeColumn] = await queryWithEncoding(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'drivers' AND column_name = 'driver_type_code'
     ) AS exists`
  );

  return Boolean(driverTypeTable?.exists && driverTypeColumn?.exists);
}

export async function GET() {
  try {
    const hasSchema = await hasDriverTypeSchema();
    const drivers = hasSchema
      ? await queryWithEncoding(
          `SELECT d.id, d.fullname, d.driver_type_code, dt.driver_type,
                  d.is_active, d.note, d.created_at
           FROM drivers d
           LEFT JOIN driver_type dt ON dt.code = d.driver_type_code
           ORDER BY dt.code, d.fullname ASC`
        )
      : await queryWithEncoding(
          `SELECT id, fullname, '01' AS driver_type_code,
                  'พนักงานขับรถเป็นครั้งคราว' AS driver_type,
                  is_active, note, created_at
           FROM drivers
           ORDER BY fullname ASC`
        );

    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullname, is_active, note, driver_type_code } = body;
    const normalizedType = typeof driver_type_code === 'string' ? driver_type_code : '01';

    const hasSchema = await hasDriverTypeSchema();
    const result = hasSchema
      ? await queryWithEncoding(
          `INSERT INTO drivers (fullname, driver_type_code, is_active, note, created_by, updated_by) 
           VALUES ($1, $2, $3, $4, 'admin', 'admin') RETURNING id`,
          [fullname, normalizedType, is_active ?? true, note || null]
        )
      : await queryWithEncoding(
          `INSERT INTO drivers (fullname, is_active, note, created_by, updated_by) 
           VALUES ($1, $2, $3, 'admin', 'admin') RETURNING id`,
          [fullname, is_active ?? true, note || null]
        );

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
  }
}
