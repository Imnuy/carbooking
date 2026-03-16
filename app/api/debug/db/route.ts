import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Check DB charset
    const [dbInfo]: any = await pool.query("SELECT @@character_set_database, @@collation_database");
    
    // Check Table charset
    const [tableInfo]: any = await pool.query(`
      SELECT TABLE_NAME, TABLE_COLLATION 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'carbooking' AND TABLE_NAME = 'cars'
    `);

    // Check Columns charset
    const [columnInfo]: any = await pool.query(`
      SELECT COLUMN_NAME, CHARACTER_SET_NAME, COLLATION_NAME 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = 'carbooking' AND TABLE_NAME = 'cars'
    `);

    return NextResponse.json({
      database: dbInfo[0],
      table: tableInfo[0],
      columns: columnInfo
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
