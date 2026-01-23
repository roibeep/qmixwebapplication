import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Customers', href: '/admin/customers' },
];

interface Customer {
  id: number;
  customer_name: string;
  contact_person: string;
  contact_number: string;
  address: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminCustomerIndex() {
  const { customers } = usePage<{ customers: Customer[] }>().props;

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none space-y-4">
        <h1 className="text-2xl font-bold">Customers</h1>

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
                <th className="px-4 py-2 text-left font-semibold">Address</th>
                <th className="px-4 py-2 text-left font-semibold">Created</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{customer.customer_name}</td>
                    <td className="px-4 py-2">{customer.contact_person}</td>
                    <td className="px-4 py-2">{customer.contact_number}</td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">{customer.address}</td>
                    <td className="px-4 py-2">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}
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
      </Card>
    </AppLayout>
  );
}