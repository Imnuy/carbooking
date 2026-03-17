import { NextResponse } from 'next/server';
import { ensureCarTypeSchema } from '@/lib/car-type';

export async function GET() {
  try {
    await ensureCarTypeSchema();
    return NextResponse.json({ message: 'Car type migration checked successfully' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
