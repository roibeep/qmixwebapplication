import AppLayout from '@/layouts/app-layout';
import { usePage, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface Equipment {
  pk_equipment_id: number;
  equipment_name: string;
  fk_employee_id: number;
  employee?: {
    pk_employee_id: number;
    employee_name: string;
  };
}

interface Employee {
  pk_employee_id: number;
  employee_name: string;
}

export default function EquipmentIndex() {
  const { equipment, employees } = usePage<{
    equipment: Equipment[];
    employees: Employee[];
  }>().props;

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const { data, setData, post, put, reset, processing } = useForm({
    equipment_name: '',
    fk_employee_id: '',
  });

  const filteredEquipment = useMemo(() => {
    if (!search) return equipment;
    const q = search.toLowerCase();
    return equipment.filter(
      (eq) =>
        eq.equipment_name.toLowerCase().includes(q) ||
        (eq.employee?.employee_name.toLowerCase().includes(q) ?? false)
    );
  }, [search, equipment]);

  const handleOpenAdd = () => {
    reset();
    setIsEdit(false);
    setOpen(true);
  };

  const handleOpenEdit = (eq: Equipment) => {
    setData({
      equipment_name: eq.equipment_name,
      fk_employee_id: eq.fk_employee_id.toString(),
    });
    setEditId(eq.pk_equipment_id);
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
      put(`/superadmin/equipment/${editId}`, { onSuccess: handleClose });
    } else {
      post('/superadmin/equipment/store', { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      router.delete(`/superadmin/equipment/${id}`, {
        onSuccess: () => router.reload({ only: ['equipment'] }),
      });
    }
  };

  return (
    <AppLayout>
      <Card className="p-6 rounded-none">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Equipment</h1>
          <Button onClick={handleOpenAdd}>Add Equipment</Button>
        </div>

        <div className="relative w-64 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <table className="min-w-full border text-sm rounded-lg">
          <thead className="bg-gray-100 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Employee</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
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
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(eq)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(eq.pk_equipment_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No equipment found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="equipment_name">Equipment Name</Label>
              <Input
                id="equipment_name"
                name="equipment_name"
                value={data.equipment_name}
                onChange={(e) => setData('equipment_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="fk_employee_id">Employee</Label>
              <select
                id="fk_employee_id"
                name="fk_employee_id"
                value={data.fk_employee_id}
                onChange={(e) => setData('fk_employee_id', e.target.value)}
                className="border border-gray-300 dark:border-neutral-700 p-2 w-full rounded-md"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.pk_employee_id} value={emp.pk_employee_id}>
                    {emp.employee_name}
                  </option>
                ))}
              </select>
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
