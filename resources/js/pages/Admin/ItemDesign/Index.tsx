import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface ItemDesign {
  pk_item_id: number;
  item_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Item Designs', href: '/admin/itemdesign' },
];

export default function AdminItemDesignIndex() {
  const { items } = usePage<{ items: ItemDesign[] }>().props;

  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((item) => item.item_name.toLowerCase().includes(q));
  }, [search, items]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-4">Item Designs</h1>

        <div className="mb-4 w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search items..."
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
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.pk_item_id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-2">{item.pk_item_id}</td>
                    <td className="px-4 py-2">{item.item_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-500">
                    No items found.
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