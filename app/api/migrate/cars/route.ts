import { NextResponse } from 'next/server';
import { queryWithEncoding } from '@/lib/db';

interface ColumnRow {
  column_name: string;
}

export async function GET() {
  try {
    const columns = await queryWithEncoding(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'cars'`
    ) as ColumnRow[];

    const columnNames = columns.map((column) => column.column_name);

    if (!columnNames.includes('car_type')) {
      await queryWithEncoding('ALTER TABLE cars ADD COLUMN car_type VARCHAR(100)');
    }

    await queryWithEncoding(
      "UPDATE cars SET car_type = 'รถตู้' WHERE car_type IS NULL AND model ILIKE '%Commuter%'"
    );
    await queryWithEncoding(
      "UPDATE cars SET car_type = 'รถยนต์นั่ง 4 ประตู' WHERE car_type IS NULL OR car_type = ''"
    );

    return NextResponse.json({ message: 'Car type migration checked successfully' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
