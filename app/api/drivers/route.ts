import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM drivers ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      fullname, nickname, phone, license_no, 
      license_expiry, description, image_url 
    } = data;

    const [result]: any = await pool.query(
      `INSERT INTO drivers (
        fullname, nickname, phone, license_no, 
        license_expiry, description, image_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullname, nickname, phone, license_no, 
        license_expiry || null, description, image_url, 'admin'
      ]
    );

    return NextResponse.json({ id: result.insertId, message: 'Driver registered successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
