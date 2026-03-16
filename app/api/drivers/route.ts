import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function GET() {
  try {
    const drivers = await queryWithEncoding(
      'SELECT id, fullname, is_active, note, created_at FROM drivers ORDER BY fullname ASC'
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
    const { fullname, is_active, note } = body;

    const result = await queryWithEncoding(
      `INSERT INTO drivers (fullname, is_active, note, created_by, updated_by) 
       VALUES ($1, $2, $3, 'admin', 'admin') RETURNING id`,
      [fullname, is_active || true, note || null]
    );

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
  }
}
