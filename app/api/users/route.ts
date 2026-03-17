import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';

export async function GET() {
  try {
    const users = await queryWithEncoding(
      'SELECT id, username, role, fullname, department, created_at FROM users ORDER BY id DESC'
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role, fullname, department } = body;

    const normalizedUsername = typeof username === 'string' ? username.trim() : '';
    const normalizedPassword = typeof password === 'string' ? password.trim() : '';
    const normalizedRole = role === 'admin' ? 'admin' : 'user';
    const normalizedFullname = typeof fullname === 'string' ? fullname.trim() : '';
    const normalizedDepartment = typeof department === 'string' ? department.trim() : '';

    if (!normalizedUsername || !normalizedPassword || !normalizedFullname) {
      return NextResponse.json(
        { error: 'Username, password and fullname are required' },
        { status: 400 }
      );
    }

    const existing = await queryWithEncoding('SELECT id FROM users WHERE username = $1', [normalizedUsername]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const result = await queryWithEncoding(
      `INSERT INTO users (username, password, role, fullname, department, created_by, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        normalizedUsername,
        normalizedPassword,
        normalizedRole,
        normalizedFullname,
        normalizedDepartment || null,
        'admin',
        'admin',
      ]
    );

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
