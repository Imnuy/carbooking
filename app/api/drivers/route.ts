import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

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

    // Admin check
    const session = (await cookies()).get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = JSON.parse(session.value);
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [result]: any = await pool.query(
      `INSERT INTO drivers (
        fullname, nickname, phone, license_no, 
        license_expiry, description, image_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullname, nickname, phone, license_no, 
        license_expiry || null, description, image_url, user.username
      ]
    );

    return NextResponse.json({ id: result.insertId, message: 'Driver registered successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
