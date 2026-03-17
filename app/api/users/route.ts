import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = (await cookies()).get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = JSON.parse(session.value);
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [rows] = await pool.query('SELECT id, fullname, username, password, role, department, image_url FROM users ORDER BY fullname ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = (await cookies()).get('session');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = JSON.parse(session.value);
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = await req.json();
    const { username, password, fullname, role, department, image_url } = data;

    const [result]: any = await pool.query(
      'INSERT INTO users (username, password, fullname, role, department, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password, fullname, role || 'user', department, image_url]
    );

    return NextResponse.json({ id: result.insertId, message: 'User created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
