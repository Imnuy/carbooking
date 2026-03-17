import { queryWithEncoding } from '@/lib/db';
import EditDriverForm from '@/components/EditDriverForm';

export default async function EditDriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await queryWithEncoding(
    `SELECT d.id, d.fullname, d.driver_type_code, d.is_active, d.note
     FROM drivers d
     WHERE d.id = $1`,
    [id]
  );

  const driver = rows[0];

  return <EditDriverForm driver={driver} />;
}
