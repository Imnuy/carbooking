import { queryWithEncoding } from '@/lib/db';
import DriversManagementClient from '@/components/DriversManagementClient';

type DriverRow = {
  id: number;
  fullname: string;
  driver_type_code: string;
  driver_type?: string | null;
  is_active: boolean;
  note?: string | null;
  created_at: string;
};

export default async function DriversPage() {
  let drivers: DriverRow[] = [];

  try {
    drivers = await queryWithEncoding(
      `SELECT d.id, d.fullname, d.driver_type_code, dt.driver_type,
              d.is_active, d.note, d.created_at
       FROM drivers d
       LEFT JOIN driver_type dt ON dt.code = d.driver_type_code
       ORDER BY dt.code, d.fullname ASC`
    );
  } catch {
    drivers = await queryWithEncoding(
      `SELECT id, fullname, '01' AS driver_type_code,
              'พนักงานขับรถเป็นครั้งคราว' AS driver_type,
              is_active, note, created_at
       FROM drivers
       ORDER BY fullname ASC`
    );
  }

  return <DriversManagementClient drivers={drivers} />;
}
