import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await pool.query(
      `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname 
       FROM bookings b 
       JOIN cars c ON b.car_id = c.id 
       JOIN users u ON b.user_id = u.id 
       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { status, driver_id } = data;

    // Get current user from session
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = JSON.parse(session.value);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 });
    }

    // Only allow update if status is provided
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    await pool.query(
      'UPDATE bookings SET status = ?, driver_id = ?, updated_by = ? WHERE id = ?',
      [status, driver_id || null, user.username, id]
    );

    // If approved, you might want to update driver/car status, but for now we keep it simple
    
    return NextResponse.json({ message: 'Booking updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Admin check
    const session = (await cookies()).get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = JSON.parse(session.value);
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
