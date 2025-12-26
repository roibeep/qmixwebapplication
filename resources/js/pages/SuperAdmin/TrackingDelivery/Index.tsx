import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { 
    title: 'Tracking Deliveries', 
    href: '/superadmin/trackingdelivery' 
  },
];

export default function TrackingDeliveryIndex() {
  const { deliveries, projects, auth } = usePage<{
    deliveries: any[];
    projects: any[];
    auth: { user: any };
  }>().props;

  const currentUser = auth.user;
  const isAuthorized = currentUser.role === 'superadmin' || currentUser.department?.name === 'Production';

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    mp_no: '',
    truck_no: '',
    volume: '',
    delivery_status: 'SO Created',
    projectID: '',
  });

  // Dialog for viewing deliveries by project
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [deliveryList, setDeliveryList] = useState<any[]>([]);

  const openDeliveryList = (projectID: number) => {
    router.get(`/superadmin/projects/${projectID}/deliveries`, {}, {
      onSuccess: (page: any) => {
        setDeliveryList(page.props || []);
        setDeliveryDialogOpen(true);
      },
      onError: (error) => console.error(error),
    });
  };

  const handleOpenAdd = () => {
    setForm({ mp_no: '', truck_no: '', volume: '', delivery_status: 'SO Created', projectID: '' });
    setEditId(null);
    setOpen(true);
  };

  const handleOpenEdit = (d: any) => {
    setForm({ mp_no: d.mp_no, truck_no: d.truck_no, volume: d.volume, delivery_status: d.delivery_status, projectID: d.projectID });
    setEditId(d.deliveryID);
    setOpen(true);
  };

  const handleClose = () => {
    setForm({ mp_no: '', truck_no: '', volume: '', delivery_status: 'SO Created', projectID: '' });
    setEditId(null);
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      router.put(`/superadmin/trackingdelivery/${editId}`, form, { onSuccess: handleClose });
    } else {
      router.post(`/superadmin/trackingdelivery/store`, form, { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this delivery?')) {
      router.delete(`/superadmin/trackingdelivery/${id}`, { onSuccess: () => router.reload({ only: ['deliveries'] }) });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tracking Deliveries</h1>
          {isAuthorized && <Button onClick={handleOpenAdd}>Add Delivery</Button>}
        </div>

        <table className="min-w-full border text-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">#</th>
              <th className="px-4 py-2 text-left font-semibold">MP No</th>
              <th className="px-4 py-2 text-left font-semibold">Truck No</th>
              <th className="px-4 py-2 text-left font-semibold">Volume</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              <th className="px-4 py-2 text-left font-semibold">Project</th>
              {isAuthorized && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d, idx) => (
              <tr key={d.deliveryID} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{d.mp_no}</td>
                <td className="px-4 py-2">{d.truck_no}</td>
                <td className="px-4 py-2">{d.volume}</td>
                <td className="px-4 py-2">{d.delivery_status}</td>
                <td className="px-4 py-2">{d.project?.customer?.name || '-'}</td>
                {isAuthorized && (
                  <td className="px-4 py-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(d)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(d.deliveryID)}>Delete</Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add/Edit Delivery Dialog */}
        {isAuthorized && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? 'Update Delivery' : 'Add Delivery'}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="mp_no">MP No</Label>
                  <Input id="mp_no" value={form.mp_no} onChange={(e) => setForm({ ...form, mp_no: e.target.value })} required />
                </div>

                <div>
                  <Label htmlFor="truck_no">Truck No</Label>
                  <Input id="truck_no" value={form.truck_no} onChange={(e) => setForm({ ...form, truck_no: e.target.value })} required />
                </div>

                <div>
                  <Label htmlFor="volume">Volume</Label>
                  <Input id="volume" type="number" step="0.01" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} required />
                </div>

                <div>
                  <Label htmlFor="delivery_status">Status</Label>
                  <select id="delivery_status" value={form.delivery_status} onChange={(e) => setForm({ ...form, delivery_status: e.target.value })} className="border p-2 w-full rounded">
                    <option value="SO Created">SO Created</option>
                    <option value="Schedule Create">Schedule Create</option>
                    <option value="Batching on Process">Batching on Process</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="projectID">Project</Label>
                  <select id="projectID" value={form.projectID} onChange={(e) => setForm({ ...form, projectID: e.target.value })} className="border p-2 w-full rounded" required>
                    <option value="">-- Select Project --</option>
                    {projects.map((p) => (
                      <option key={p.projectID} value={p.projectID}>{p.customer?.name} — {p.project_location}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                  <Button type="submit">{editId ? 'Update' : 'Add'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </Card>
    </AppLayout>
  );
}
