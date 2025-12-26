import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface Department {
  departmentID: number;
  name: string;
  description: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Departments', href: '/admin/department' },
];

export default function AdminDepartmentIndex() {
  const { departments } = usePage<{ departments: Department[] }>().props;
  const [search, setSearch] = useState('');

  const filteredDepartments = useMemo(() => {
    if (!search) return departments;
    const q = search.toLowerCase();
    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(q) ||
        (dept.description?.toLowerCase().includes(q) ?? false)
    );
  }, [search, departments]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Departments</h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full border text-sm rounded-lg">
          <thead className="bg-gray-100 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <tr
                  key={dept.departmentID}
                  className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  <td className="px-4 py-2">{dept.departmentID}</td>
                  <td className="px-4 py-2">{dept.name}</td>
                  <td className="px-4 py-2 max-w-[450px]">{dept.description || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </AppLayout>
  );
}