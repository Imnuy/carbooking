import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function GET() {
  try {
    const drivers = await queryWithEncoding(
      `SELECT d.id, d.fullname, d.driver_type_code, dt.driver_type
       FROM drivers d
       LEFT JOIN driver_type dt ON dt.code = d.driver_type_code
       WHERE d.is_active = true
       ORDER BY dt.code, d.fullname ASC`
    );

    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Error fetching active drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch active drivers' }, { status: 500 });
  }
}
