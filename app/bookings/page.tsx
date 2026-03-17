import { queryWithEncoding } from '@/lib/db';
import BookingListClient from '@/components/BookingListClient';
import { ensureTripsSchema, resolveBookingStatusColumn } from '@/lib/booking-trip';

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sort = typeof params.sort === 'string' ? params.sort : 'created_at';
  const order = typeof params.order === 'string' ? params.order.toLowerCase() : 'desc';

  const validSortColumns = ['id', 'start_time', 'created_at'];
  const orderBy = validSortColumns.includes(sort) ? `b.${sort}` : 'b.created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  await ensureTripsSchema();
  const statusColumn = await resolveBookingStatusColumn();
  const bookings = await queryWithEncoding(
    `SELECT
       b.*,
       b.${statusColumn} AS status_code,
       COALESCE(t.car_id, b.car_id) AS car_id,
       COALESCE(t.driver_id, b.driver_id) AS driver_id,
       COALESCE(d.fullname, b.driver_name) AS driver_name,
       c.brand,
       c.model,
       c.license_plate,
       u.fullname as owner_name,
       bs.status as status_text,
       t.start_date_time AS trip_start_date_time,
       t.end_date_time AS trip_end_date_time
     FROM bookings b 
     LEFT JOIN trips t ON b.trip_id = t.id
     LEFT JOIN cars c ON COALESCE(t.car_id, b.car_id) = c.id 
     LEFT JOIN drivers d ON COALESCE(t.driver_id, b.driver_id) = d.id
     JOIN users u ON b.user_id = u.id 
     LEFT JOIN booking_status bs ON b.${statusColumn} = bs.code
     ORDER BY ${orderBy} ${sortOrder}`
  );

  return (
    <BookingListClient 
      initialBookings={bookings} 
      sort={sort}
      order={order}
    />
  );
}
