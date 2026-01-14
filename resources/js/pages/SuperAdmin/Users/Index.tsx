import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Manage Users', href: '/superadmin/projects' },
];

export default function UserIndex() {
  const { users, departments } = usePage<{ users: any[], departments: any[] }>().props;

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    departmentID: null as number | null,
  });

  // Search state
  const [search, setSearch] = useState('');

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();

    return users.filter((user) =>
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q) ||
      (user.department?.name?.toLowerCase().includes(q))
    );
  }, [search, users]);

  // Dialog Handlers
  const handleOpenAdd = () => {
    setForm({ name: '', email: '', password: '', role: '', departmentID: null });
    setEditId(null);
    setOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      departmentID: user.department?.departmentID ?? null,
    });
    setEditId(user.id);
    setOpen(true);
  };

  const handleClose = () => {
    setForm({ name: '', email: '', password: '', role: '', departmentID: null });
    setEditId(null);
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      router.put(`/superadmin/users/${editId}`, form, { onSuccess: handleClose });
    } else {
      router.post('/superadmin/users/store', form, { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(`/superadmin/users/${id}`, {
        onSuccess: () => router.reload({ only: ['users'] }),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              />
          </div>
          <Button onClick={handleOpenAdd}>Add User</Button>
        </div>

        {/* Table */}
        <table className="min-w-full border text-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">#</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Email</th>
              <th className="px-4 py-2 text-left font-semibold">Department</th>
              <th className="px-4 py-2 text-left font-semibold">Role</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.department?.name ?? '-'}</td>
                  <td className="px-4 py-2">{user.role}</td>

                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(user)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Update User' : 'Add User'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {!editId && (
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <Label>Role</Label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="border p-2 w-full rounded"
                  required
                >
                  <option value="">-- Select Role --</option>
                  <option value="superadmin">SuperAdmin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div>
                <Label>Department</Label>
                <select
                  value={form.departmentID ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      departmentID: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="border p-2 w-full rounded"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentID} value={dept.departmentID}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  {editId ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </AppLayout>
  );
}
