import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';
import { ensureCarTypeSchema, resolveCarTypeId } from '@/lib/car-type';

const cars = [
  { brand: 'Toyota', model: 'Commuter', license_plate: 'นข 1234', seats: 12, car_type: 'รถตู้นั่งบรรทุก' },
  { brand: 'Honda', model: 'CR-V', license_plate: 'กท 5678', seats: 5, car_type: 'รถยนต์นั่งบรรทุก4ประตู' },
  { brand: 'Toyota', model: 'Commuter', license_plate: 'ฎน 9999', seats: 12, car_type: 'รถตู้นั่งบรรทุก' },
  { brand: 'Isuzu', model: 'D-Max', license_plate: 'ธศ 4321', seats: 5, car_type: 'รถยนต์บรรทุก' },
];

export async function GET() {
  try {
    await ensureCarTypeSchema();
    await queryWithEncoding('TRUNCATE TABLE cars RESTART IDENTITY CASCADE');

    for (const car of cars) {
      const carTypeId = await resolveCarTypeId({ car_type: car.car_type, model: car.model });
      await queryWithEncoding(
        `INSERT INTO cars (brand, model, license_plate, seats, car_type_id, car_type, is_active, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [car.brand, car.model, car.license_plate, car.seats, carTypeId, car.car_type, true, 'admin']
      );
    }

    return NextResponse.json({ message: 'Re-seed successful' });
  } catch (error) {
    console.error('Re-seed failed:', error);
    return NextResponse.json({ error: 'Re-seed failed' }, { status: 500 });
  }
}
