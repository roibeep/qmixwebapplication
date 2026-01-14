import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage, useForm, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface Employees {
  pk_employee_id: number;
  employee_name: string;
  date_created: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Manage Employees', href: '/superadmin/employees' },
];

export default function EmployeeIndex() {
  const { employees } = usePage<{ employees: Employees[] }>().props;
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    const q = search.toLowerCase();
    return employees.filter(emp => emp.employee_name.toLowerCase().includes(q));
  }, [search, employees]);

  const { data, setData, post, put, reset, processing } = useForm({
    employee_name: '',
  });

  const handleOpenAdd = () => {
    reset();
    setIsEdit(false);
    setOpen(true);
  };

  const handleOpenEdit = (emp: Employees) => {
    setData({ employee_name: emp.employee_name });
    setEditId(emp.pk_employee_id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setIsEdit(false);
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && editId) {
      put(`/superadmin/employees/${editId}`, { onSuccess: handleClose });
    } else {
      post('/superadmin/employees/store', { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      router.delete(`/superadmin/employees/${id}`, {
        onSuccess: () => router.reload({ only: ['employees'] }),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={handleOpenAdd}>Add Employee</Button>
        </div>

        {/* Table */}
        <table className="min-w-full border text-sm rounded-lg">
          <thead className="bg-gray-100 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Date Created</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr
                  key={emp.pk_employee_id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  <td className="px-4 py-2">{emp.pk_employee_id}</td>
                  <td className="px-4 py-2">{emp.employee_name}</td>
                  <td className="px-4 py-2">{emp.date_created}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(emp)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(emp.pk_employee_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="employee_name">Employee Name</Label>
              <Input
                id="employee_name"
                name="employee_name"
                value={data.employee_name}
                onChange={(e) => setData('employee_name', e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {isEdit ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
