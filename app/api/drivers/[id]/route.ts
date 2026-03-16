import { NextResponse } from 'next/server';
import pool, { queryWithEncoding } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { fullname, is_active, note } = await request.json();
    const id = params.id;

    await queryWithEncoding(
      'UPDATE drivers SET fullname = $1, is_active = $2, note = $3, updated_by = $4 WHERE id = $5',
      [fullname, is_active, note, 'admin', id]
    );

    return NextResponse.json({ message: 'Driver updated successfully' });
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await queryWithEncoding('DELETE FROM drivers WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 });
  }
}
