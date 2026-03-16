import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await pool.query('SELECT * FROM cars WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
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
    const { 
      brand, model, license_plate, car_type, color, 
      manager, seats, fuel_type, act_expiry, 
      insurance_expiry, description, image_url, status 
    } = data;

    // Admin check
    const session = (await cookies()).get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = JSON.parse(session.value);
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await pool.query(
      `UPDATE cars SET 
        brand = ?, model = ?, license_plate = ?, car_type = ?, color = ?, 
        manager = ?, seats = ?, fuel_type = ?, act_expiry = ?, 
        insurance_expiry = ?, description = ?, image_url = ?, status = ?,
        updated_by = ?
      WHERE id = ?`,
      [
        brand, model, license_plate, car_type, color, 
        manager, seats, fuel_type, act_expiry || null, 
        insurance_expiry || null, description, image_url, status, user.username, id
      ]
    );

    return NextResponse.json({ message: 'Car updated successfully' });
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

    await pool.query('DELETE FROM bookings WHERE car_id = ?', [id]); // Clear bookings first
    await pool.query('DELETE FROM cars WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
