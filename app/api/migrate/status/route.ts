import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    console.log('Migrating car status (safe mode)...');
    
    // 1. Add new column
    await pool.query('ALTER TABLE cars ADD COLUMN status_new VARCHAR(20) DEFAULT "active"');
    
    // 2. Map data
    await pool.query("UPDATE cars SET status_new = 'active' WHERE status IN ('available', 'in_use', 'active') OR status IS NULL");
    await pool.query("UPDATE cars SET status_new = 'inactive' WHERE status IN ('maintenance', 'inactive')");
    
    // 3. Drop old column
    await pool.query('ALTER TABLE cars DROP COLUMN status');
    
    // 4. Rename new column to status
    await pool.query('ALTER TABLE cars CHANGE COLUMN status_new status VARCHAR(20) DEFAULT "active"');
    
    console.log('Car status migration successful');
    return NextResponse.json({ message: 'Car status migration successful' });
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
