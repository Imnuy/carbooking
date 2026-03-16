import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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

    const [result]: any = await pool.query(
      `INSERT INTO cars (
        brand, model, license_plate, car_type, color, 
        manager, seats, fuel_type, act_expiry, 
        insurance_expiry, description, image_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        brand, model, license_plate, car_type, color, 
        manager, seats, fuel_type, act_expiry || null, 
        insurance_expiry || null, description, image_url, 'admin'
      ]
    );

    return NextResponse.json({ id: result.insertId, message: 'Car created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
