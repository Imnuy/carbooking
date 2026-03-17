import { queryWithEncoding } from '@/lib/db';
import { getBookingStatusIds } from '@/lib/master-data';

interface ExistsRow {
  exists: boolean;
}

interface ColumnRow {
  column_name: string;
}

export async function resolveBookingStatusColumn() {
  return 'status_id' as const;
}

export async function ensureTripsSchema() {
  const [tripsTable] = await queryWithEncoding(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'trips'
     ) AS exists`
  ) as ExistsRow[];

  if (!tripsTable?.exists) {
    await queryWithEncoding(
      `CREATE TABLE trips (
        id SERIAL PRIMARY KEY,
        car_id INTEGER NULL REFERENCES cars(id) ON DELETE SET NULL,
        driver_id INTEGER NULL REFERENCES drivers(id) ON DELETE SET NULL,
        start_date_time TIMESTAMP NOT NULL,
        end_date_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        updated_by VARCHAR(255)
      )`
    );
  }

  const bookingColumns = await queryWithEncoding(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'bookings'`
  ) as ColumnRow[];

  const bookingColumnNames = bookingColumns.map((column) => column.column_name);

  if (!bookingColumnNames.includes('trip_id')) {
    await queryWithEncoding('ALTER TABLE bookings ADD COLUMN trip_id INTEGER NULL');
  }

  const [tripForeignKey] = await queryWithEncoding(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.table_constraints
       WHERE table_schema = 'public'
         AND table_name = 'bookings'
         AND constraint_type = 'FOREIGN KEY'
         AND constraint_name = 'bookings_trip_id_fkey'
     ) AS exists`
  ) as ExistsRow[];

  if (!tripForeignKey?.exists) {
    await queryWithEncoding(
      'ALTER TABLE bookings ADD CONSTRAINT bookings_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL'
    );
  }

  if (!bookingColumnNames.includes('driver_id')) {
    await queryWithEncoding('ALTER TABLE bookings ADD COLUMN driver_id INTEGER NULL REFERENCES drivers(id) ON DELETE SET NULL');
  }

  const statusIds = await getBookingStatusIds();
  const legacyAssignedBookings = await queryWithEncoding(
    `SELECT id, start_time, end_time, car_id, driver_id, created_at
     FROM bookings
     WHERE trip_id IS NULL
       AND car_id IS NOT NULL
       AND status_id = $1
     ORDER BY created_at ASC, id ASC`,
    [statusIds.assigned]
  ) as {
    id: number;
    start_time: string;
    end_time: string;
    car_id: number | null;
    driver_id: number | null;
    created_at: string | null;
  }[];

  for (const booking of legacyAssignedBookings) {
    const createdTrips = await queryWithEncoding(
      `INSERT INTO trips (
         car_id,
         driver_id,
         start_date_time,
         end_date_time,
         created_at,
         updated_at,
         created_by,
         updated_by
       ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)
       RETURNING id`,
      [
        booking.car_id,
        booking.driver_id,
        booking.start_time,
        booking.end_time,
        booking.created_at || new Date().toISOString(),
        'migration',
        'migration',
      ]
    ) as { id: number }[];

    const tripId = createdTrips[0]?.id;
    if (!tripId) {
      continue;
    }

    await queryWithEncoding(
      'UPDATE bookings SET trip_id = $1 WHERE id = $2 AND trip_id IS NULL',
      [tripId, booking.id]
    );
  }
}

export function toDateKey(value: string | Date | null | undefined) {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}
