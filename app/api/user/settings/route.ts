import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = JSON.parse(session.value);

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 });
    }

    const [rows]: any = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [user.id]
    );

    if (rows.length === 0) {
      // Default settings if not exist
      return NextResponse.json({
        line_notification: false,
        line_token: '',
        telegram_notification: false,
        telegram_chat_id: ''
      });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = JSON.parse(session.value);

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 });
    }
    const data = await req.json();

    const { line_notification, line_token, telegram_notification, telegram_chat_id } = data;

    await pool.query(
      `INSERT INTO user_settings (user_id, line_notification, line_token, telegram_notification, telegram_chat_id)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       line_notification = VALUES(line_notification),
       line_token = VALUES(line_token),
       telegram_notification = VALUES(telegram_notification),
       telegram_chat_id = VALUES(telegram_chat_id)`,
      [user.id, line_notification, line_token, telegram_notification, telegram_chat_id]
    );

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
