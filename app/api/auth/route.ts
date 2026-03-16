import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const [rows]: any = await pool.query(
      'SELECT id, username, role, fullname, department FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    const user = rows[0];

    // In a real app, we would use JWT. For now, we'll set a simple cookie for session
    // and return the user data.
    const response = NextResponse.json({ 
      message: 'Login successful',
      user: user
    });

    (await cookies()).set('session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const session = (await cookies()).get('session');
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: JSON.parse(session.value) });
}

export async function DELETE() {
  (await cookies()).delete('session');
  return NextResponse.json({ message: 'Logged out' });
}
