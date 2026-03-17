import { queryWithEncoding } from '@/lib/db';
import EditBookingForm from '@/components/EditBookingForm';

let bookingStatusColumn: 'status_code' | 'status' | null = null;

async function resolveBookingStatusColumn() {
  if (bookingStatusColumn) {
    return bookingStatusColumn;
  }

  const columns = await queryWithEncoding(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_name = 'bookings'
       AND column_name IN ('status_code', 'status')`
  ) as { column_name: string }[];

  bookingStatusColumn = columns.some((col) => col.column_name === 'status_code') ? 'status_code' : 'status';
  return bookingStatusColumn;
}

export default async function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const statusColumn = await resolveBookingStatusColumn();

  const rows = await queryWithEncoding(
    `SELECT id, requester_name, requester_position, supervisor_name, supervisor_position,
            destination, purpose, fuel_reimbursement, distance, trip_type, start_time,
            end_time, passengers, ${statusColumn} AS status_code
     FROM bookings
     WHERE id = $1`,
    [id]
  );

  const booking = rows[0];

  return <EditBookingForm booking={booking} />;
}
