import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';

export async function GET() {
  try {
    const rows = await queryWithEncoding(
      'SELECT id, brand, model, license_plate, car_type, is_active FROM cars ORDER BY id'
    );
    return NextResponse.json(rows);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
