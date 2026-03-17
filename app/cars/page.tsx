import { queryWithEncoding } from '@/lib/db';
import CarsManagementClient from '@/components/CarsManagementClient';

type CarRow = {
  id: number;
  brand: string;
  model: string;
  license_plate: string;
  car_number?: string | null;
  seats?: number | null;
  car_type?: string | null;
  is_active: boolean;
};

export default async function CarsPage() {
  await queryWithEncoding('ALTER TABLE cars ADD COLUMN IF NOT EXISTS car_number VARCHAR(50)');
  const cars = await queryWithEncoding('SELECT * FROM cars ORDER BY id DESC') as CarRow[];

  return <CarsManagementClient cars={cars} />;
}
