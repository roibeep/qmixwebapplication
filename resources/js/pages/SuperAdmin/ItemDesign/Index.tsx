import AppLayout from '@/layouts/app-layout';
import { usePage, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface ItemDesign {
  pk_item_id: number;
  item_name: string;
}

export default function ItemDesignIndex() {
  const { items } = usePage<{ items: ItemDesign[] }>().props;

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const { data, setData, post, put, reset, processing } = useForm({
    item_name: '',
  });

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((item) => item.item_name.toLowerCase().includes(q));
  }, [search, items]);

  const handleOpenAdd = () => {
    reset();
    setIsEdit(false);
    setOpen(true);
  };

  const handleOpenEdit = (item: ItemDesign) => {
    setData({ item_name: item.item_name });
    setEditId(item.pk_item_id);
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
      put(`/superadmin/itemdesign/${editId}`, { onSuccess: handleClose });
    } else {
      post('/superadmin/itemdesign/store', { onSuccess: handleClose });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      router.delete(`/superadmin/itemdesign/${id}`, {
        onSuccess: () => router.reload({ only: ['items'] }),
      });
    }
  };

  return (
    <AppLayout>
      <Card className="p-6 rounded-none">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Item Designs</h1>
          <Button onClick={handleOpenAdd}>Add Item</Button>
        </div>

        <div className="relative w-64 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search items..."
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
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.pk_item_id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <td className="px-4 py-2">{item.pk_item_id}</td>
                  <td className="px-4 py-2">{item.item_name}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(item)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.pk_item_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Item' : 'Add Item'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="item_name">Item Name</Label>
              <Input
                id="item_name"
                name="item_name"
                value={data.item_name}
                onChange={(e) => setData('item_name', e.target.value)}
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
