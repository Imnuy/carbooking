import { queryWithEncoding } from '@/lib/db';
import EditUserForm from '@/components/EditUserForm';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await queryWithEncoding(
    'SELECT id, username, role, fullname, department FROM users WHERE id = $1',
    [id]
  );

  const user = rows[0];

  return <EditUserForm user={user} />;
}
