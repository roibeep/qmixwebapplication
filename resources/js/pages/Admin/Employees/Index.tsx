import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface Employees {
  pk_employee_id: number;
  employee_name: string;
  date_created: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Employees', href: '/admin/employees' },
];

export default function AdminEmployeeIndex() {
  const { employees } = usePage<{ employees: Employees[] }>().props;
  const [search, setSearch] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    const q = search.toLowerCase();
    return employees.filter(emp => emp.employee_name.toLowerCase().includes(q));
  }, [search, employees]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>

        <div className="mb-4 w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">ID</th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Date Created</th>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}