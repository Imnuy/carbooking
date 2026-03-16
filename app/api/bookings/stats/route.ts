import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      "SELECT COUNT(*) as pendingCount FROM bookings WHERE status = 'pending'"
    );
    return NextResponse.json({ pendingCount: rows[0].pendingCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
