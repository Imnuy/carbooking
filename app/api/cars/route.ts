import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

// GET all cars
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM cars ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new car
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      brand, model, license_plate, car_type, color, 
      manager, seats, fuel_type, act_expiry, 
      insurance_expiry, description, image_url 
    } = data;

    // Admin check
    const session = (await cookies()).get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = JSON.parse(session.value);
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [result]: any = await pool.query(
      `INSERT INTO cars (
        brand, model, license_plate, car_type, color, 
        manager, seats, fuel_type, act_expiry, 
        insurance_expiry, description, image_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        brand, model, license_plate, car_type, color, 
        manager, seats, fuel_type, act_expiry || null, 
        insurance_expiry || null, description, image_url, user.username
      ]
    );

    return NextResponse.json({ id: result.insertId, message: 'Car created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
