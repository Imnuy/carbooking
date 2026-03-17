import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { code, status, description } = await request.json();
    const { id } = await params;

    await queryWithEncoding(
      'UPDATE booking_status SET code = $1, status = $2, description = $3, updated_by = $4 WHERE id = $5',
      [code, status, description, 'admin', id]
    );

    return NextResponse.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await queryWithEncoding('DELETE FROM booking_status WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Booking status deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking status:', error);
    return NextResponse.json({ error: 'Failed to delete booking status' }, { status: 500 });
  }
}
