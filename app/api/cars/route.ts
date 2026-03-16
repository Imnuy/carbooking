import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { brand, model, license_plate, seats, car_type } = await request.json();

    await queryWithEncoding(
      'INSERT INTO cars (brand, model, license_plate, seats, car_type, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [brand, model, license_plate, seats, car_type, 'admin']
    );

    return NextResponse.json({ message: 'Car added successfully' });
  } catch (error) {
    console.error('Error adding car:', error);
    return NextResponse.json({ error: 'Failed to add car' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await queryWithEncoding('SELECT * FROM cars ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
