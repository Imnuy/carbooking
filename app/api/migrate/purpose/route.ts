import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    await pool.query(
      "ALTER TABLE bookings ADD COLUMN purpose TEXT AFTER destination"
    );
    return NextResponse.json({ message: 'Column objective/purpose added successfully' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      return NextResponse.json({ message: 'Column already exists' });
    }
    console.error('Error adding column:', error);
    return NextResponse.json({ error: 'Failed to add column' }, { status: 500 });
  }
}
