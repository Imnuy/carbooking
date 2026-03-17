import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { fullname, is_active, note, driver_type_code } = await request.json();
    const { id } = await params;

    await queryWithEncoding(
      'UPDATE drivers SET fullname = $1, driver_type_code = $2, is_active = $3, note = $4, updated_by = $5 WHERE id = $6',
      [fullname, driver_type_code || '01', is_active, note, 'admin', id]
    );

    return NextResponse.json({ message: 'Driver updated successfully' });
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await queryWithEncoding('DELETE FROM drivers WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 });
  }
}
