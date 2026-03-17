import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';

export async function POST() {
  try {
    await queryWithEncoding(
      'ALTER TABLE bookings ADD COLUMN IF NOT EXISTS purpose TEXT'
    );

    return NextResponse.json({ message: 'purpose column checked successfully' });
  } catch (error) {
    console.error('Error adding column:', error);
    return NextResponse.json({ error: 'Failed to add column' }, { status: 500 });
  }
}
