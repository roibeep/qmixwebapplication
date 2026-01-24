import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Manage Customers', href: '/superadmin/customers' },
];

interface Customer {
  id: number;  // ✅ Changed from pk_customer_id
  customer_name: string;
  contact_person: string;
  contact_number: string;
  address: string;
  email: string;
  role: string;
  created_at: string;  // ✅ Changed from date_created
}

export default function CustomerIndex() {
  const { customers } = usePage<{ customers: Customer[] }>().props;

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    customer_name: '',
    contact_person: '',
    contact_number: '',
    address: '',
    email: '',
    password: '',
  });

  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();

    return customers.filter((c) =>
      c.customer_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.contact_person.toLowerCase().includes(q)
    );
  }, [search, customers]);

  const handleOpenAdd = () => {
    setForm({
      customer_name: '',
      contact_person: '',
      contact_number: '',
      address: '',
      email: '',
      password: '',
    });
    setEditId(null);
    setOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setForm({
      customer_name: customer.customer_name,
      contact_person: customer.contact_person,
      contact_number: customer.contact_number,
      address: customer.address,
      email: customer.email,
      password: '',
    });
    setEditId(customer.id);  // ✅ Changed from pk_customer_id
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      router.put(`/superadmin/customers/${editId}`, form, {
        onSuccess: handleClose,
      });
    } else {
      router.post('/superadmin/customers/store', form, {
        onSuccess: handleClose,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      router.delete(`/superadmin/customers/${id}`);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Customers</h1>
          <Button onClick={handleOpenAdd}>Add Customer</Button>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search customers..."
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
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Customer</th>
                <th className="px-4 py-2 text-left font-semibold">Contact Person</th>
                <th className="px-4 py-2 text-left font-semibold">Contact No</th>
                <th className="px-4 py-2 text-left font-semibold">Email</th>
                <th className="px-4 py-2 text-left font-semibold">Created</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700">  {/* ✅ Changed */}
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{customer.customer_name}</td>
                    <td className="px-4 py-2">{customer.contact_person}</td>
                    <td className="px-4 py-2">{customer.contact_number}</td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}  {/* ✅ Changed */}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(customer)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(customer.id)}>  {/* ✅ Changed */}
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent aria-describedby="customer-dialog-description">
            <DialogHeader>
              <DialogTitle>{editId ? 'Update Customer' : 'Add Customer'}</DialogTitle>
              <p id="customer-dialog-description" className="text-sm text-gray-500 sr-only">
                Fill in the customer information below
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Customer Name</Label>
                <Input
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Contact Person</Label>
                <Input
                  value={form.contact_person}
                  onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Contact Number</Label>
                <Input
                  value={form.contact_number}
                  onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Address</Label>
                <Textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
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

              <div>
                <Label>Password {editId && '(optional)'}</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editId}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editId ? 'Update' : 'Add'}  {/* ✅ Fixed typo */}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </AppLayout>
  );
}