import { queryWithEncoding } from '@/lib/db';
import BookingListClient from '@/components/BookingListClient';
import { ensureTripsSchema } from '@/lib/booking-trip';
import { ensureCarTypeSchema } from '@/lib/car-type';
import { ensureMasterDataSchema, getBookingStatusIds, getDepartments } from '@/lib/master-data';

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sort = typeof params.sort === 'string' ? params.sort : 'start_time';
  const order = typeof params.order === 'string' ? params.order.toLowerCase() : 'asc';

  const validSortColumns = ['id', 'start_time', 'created_at'];
  const orderBy = validSortColumns.includes(sort) ? `b.${sort}` : 'b.start_time';
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

  await ensureTripsSchema();
  await ensureCarTypeSchema();
  await ensureMasterDataSchema();
  const statusIds = await getBookingStatusIds();
  const departments = await getDepartments();
  const bookings = await queryWithEncoding(
    `SELECT
       b.*,
       b.status_id,
       bs.name AS status_text,
       COALESCE(t.car_id, b.car_id) AS car_id,
       COALESCE(t.driver_id, b.driver_id) AS driver_id,
       d.fullname AS driver_name,
       c.brand,
       c.model,
       c.license_plate,
       ct.name AS car_type,
       t.start_date_time AS trip_start_date_time,
       t.end_date_time AS trip_end_date_time,
       tt.name AS trip_type_name,
       dp.name AS department_name
     FROM bookings b
     LEFT JOIN trips t ON b.trip_id = t.id
     LEFT JOIN cars c ON COALESCE(t.car_id, b.car_id) = c.id
     LEFT JOIN car_type ct ON c.car_type_id = ct.id
     LEFT JOIN drivers d ON COALESCE(t.driver_id, b.driver_id) = d.id
     LEFT JOIN booking_status bs ON b.status_id = bs.id
     LEFT JOIN trip_type tt ON b.trip_type_id = tt.id
     LEFT JOIN department dp ON b.department_id = dp.id
     ORDER BY ${orderBy} ${sortOrder}`
  );

  return (
    <BookingListClient
      initialBookings={bookings}
      departments={departments}
      sort={sort}
      order={order}
      statusIds={statusIds}
    />
  );
}
