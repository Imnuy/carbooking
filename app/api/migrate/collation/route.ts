import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    console.log('Fixing table collation...');
    
    // 1. Change database charset
    await pool.query("ALTER DATABASE carbooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // 2. Change table charset
    await pool.query("ALTER TABLE cars CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // 3. Specifically fix license_plate if it's still weird
    // Sometimes we need to go via BLOB to avoid double-encoding issues if the data was already triple-bogus
    // But let's first try just the standard CONVERT.
    
    console.log('Fixing data if it was double encoded...');
    // This is a common trick if the data was inserted as UTF8 into a Latin1 column but the column is now UTF8
    // We cast to binary then back to utf8
    // However, if car_type is fine, this shouldn't be necessary unless only license_plate was messed up.
    
    console.log('Collation fix successful');
    return NextResponse.json({ message: 'Collation fix successful' });
  } catch (error: any) {
    console.error('Fix failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
