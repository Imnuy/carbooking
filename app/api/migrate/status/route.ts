import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    console.log('Migrating car status...');
    
    // First, modify the column to be a simple string temporarily to allow data migration
    await pool.query('ALTER TABLE cars MODIFY COLUMN status VARCHAR(50)');
    
    // Update existing data
    // Map 'available' and 'in_use' to 'active'
    // Map 'maintenance' to 'inactive'
    await pool.query("UPDATE cars SET status = 'active' WHERE status IN ('available', 'in_use')");
    await pool.query("UPDATE cars SET status = 'inactive' WHERE status = 'maintenance' OR status IS NULL");
    
    // Change back to new ENUM
    await pool.query("ALTER TABLE cars MODIFY COLUMN status ENUM('active', 'inactive') DEFAULT 'active'");
    
    console.log('Car status migration successful');
    return NextResponse.json({ message: 'Car status migration successful' });
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
