import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [columns] = await pool.query('SHOW COLUMNS FROM cars');
    const columnNames = (columns as any[]).map(c => c.Field);

    if (!columnNames.includes('car_type')) {
      await pool.query('ALTER TABLE cars ADD COLUMN car_type VARCHAR(100) AFTER seats');
      
      // Update existing data
      await pool.query("UPDATE cars SET car_type = 'รถตู้' WHERE model LIKE '%Commuter%'");
      await pool.query("UPDATE cars SET car_type = 'รถกระบะ4ประตู' WHERE car_type IS NULL OR car_type = ''");
      
      return NextResponse.json({ message: 'Migration successful' });
    }
    return NextResponse.json({ message: 'car_type column already exists' });
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
