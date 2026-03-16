import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function GET() {
  try {
    const drivers = await queryWithEncoding(
      'SELECT id, fullname FROM drivers WHERE is_active = true ORDER BY fullname ASC'
    );

    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Error fetching active drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch active drivers' }, { status: 500 });
  }
}
