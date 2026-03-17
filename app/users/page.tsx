import { queryWithEncoding } from '@/lib/db';
import UsersManagementClient from '@/components/UsersManagementClient';

type UserRow = {
  id: number;
  username: string;
  role: 'admin' | 'user';
  fullname?: string | null;
  department?: string | null;
  created_at: string;
};

export default async function UsersPage() {
  const users = await queryWithEncoding(
    'SELECT id, username, role, fullname, department, created_at FROM users ORDER BY id DESC'
  ) as UserRow[];

  return <UsersManagementClient users={users} />;
}
