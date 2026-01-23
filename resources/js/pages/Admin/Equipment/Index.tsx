import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Equipment {
  pk_equipment_id: number;
  equipment_name: string;
  fk_employee_id: number;
  employee?: {
    pk_employee_id: number;
    employee_name: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Equipment', href: '/admin/equipment' },
];

export default function AdminEquipmentIndex() {
  const { equipment } = usePage<{
    equipment: Equipment[];
  }>().props;

  const [search, setSearch] = useState('');

  const filteredEquipment = useMemo(() => {
    if (!search) return equipment;
    const q = search.toLowerCase();
    return equipment.filter(
      (eq) =>
        eq.equipment_name.toLowerCase().includes(q) ||
        (eq.employee?.employee_name.toLowerCase().includes(q) ?? false)
    );
  }, [search, equipment]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-4">Equipment</h1>

        <div className="mb-4 w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">ID</th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Employee</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((eq) => (
                  <tr
                    key={eq.pk_equipment_id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-4 py-2">{eq.pk_equipment_id}</td>
                    <td className="px-4 py-2">{eq.equipment_name}</td>
                    <td className="px-4 py-2">{eq.employee?.employee_name || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No equipment found.
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