import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import BookingListClient from '@/components/BookingListClient';

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const params = await searchParams;
  const sort = typeof params.sort === 'string' ? params.sort : 'created_at';
  const order = typeof params.order === 'string' ? params.order.toLowerCase() : 'desc';

  const validSortColumns = ['id', 'start_time', 'created_at'];
  const orderBy = validSortColumns.includes(sort) ? `b.${sort}` : 'b.created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  const [bookings] = await pool.query<RowDataPacket[]>(
    `SELECT b.*, c.brand, c.model, c.license_plate, u.fullname as owner_name 
     FROM bookings b 
     LEFT JOIN cars c ON b.car_id = c.id 
     JOIN users u ON b.user_id = u.id 
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
