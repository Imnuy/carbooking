import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    console.log('Re-seeding cars with correct encoding...');
    
    // 1. Truncate
    await pool.query('DELETE FROM cars');
    await pool.query('ALTER TABLE cars AUTO_INCREMENT = 1');
    
    // 2. Insert with explicit Thai strings
    const cars = [
      { brand: 'Toyota', model: 'Commuter', license_plate: 'นข 1234', seats: 12, car_type: 'รถตู้' },
      { brand: 'Honda', model: 'CR-V', license_plate: 'กท 5678', seats: 5, car_type: 'รถกระบะ4ประตู' },
      { brand: 'Toyota', model: 'Commuter', license_plate: 'ฮน 9999', seats: 12, car_type: 'รถตู้' },
      { brand: 'Isuzu', model: 'D-Max', license_plate: 'ถศ 4321', seats: 5, car_type: 'รถกระบะ4ประตู' }
    ];

    for (const car of cars) {
      await pool.query(
        'INSERT INTO cars (brand, model, license_plate, seats, car_type, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [car.brand, car.model, car.license_plate, car.seats, car.car_type, 'active', 'admin']
      );
    }
    
    console.log('Re-seed successful');
    return NextResponse.json({ message: 'Re-seed successful' });
  } catch (error: any) {
    console.error('Re-seed failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
