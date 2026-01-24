import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileText, CalendarClock, Loader, Truck, CheckCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

// UPDATED INTERFACES
interface Customer { 
  id: number; 
  name: string; 
  customer_name?: string; 
  email: string;
}

interface Item { pk_item_id: number; item_name: string; }
interface Equipment { pk_equipment_id: number; equipment_name: string; }

interface Delivery {
  pk_delivery_id: number;
  mp_no: string;
  truck_no?: string;
  volume: number;
  delivery_status: string;
  fk_equipment_id: number;
  schedule_date?: string | null;
  schedule_time?: string | null;
  equipment?: Equipment | null;
}

interface Transaction {
  pk_transac_id: number;
  so_no: string;
  total_delivery: number;
  date_created: string;
  schedule_date?: string | null;
  schedule_time?: string | null;
  fk_customer_id: number;
  customer?: Customer | null;
  item?: Item | null;
  deliveries?: Delivery[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Manage Transactions', href: '/user/transactions' },
];

// ----------------- StatusBadge -----------------
interface StatusBadgeProps { status: string; }

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    'Batching on Process': { icon: <Loader className="w-4 h-4 animate-spin" />, color: 'bg-yellow-100 text-yellow-800' },
    'Out for Delivery': { icon: <Truck className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800' },
    'Delivered': { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
  };
  const s = map[status] || map['Batching on Process'];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
      {s.icon} {status}
    </span>
  );
};

// ----------------- UserTransactionIndex -----------------
export default function UserTransactionIndex() {
  const { 
    transactions = [],     
    customers = [], 
    equipment = [],
    items = [], 
    auth 
  } = usePage<{
    transactions: Transaction[];
    customers: Customer[];
    items: Item[];
    equipment: Equipment[];
    auth: any;
  }>().props;

  const currentUser = auth.user;
  const isAuthorized = currentUser.role === 'user' && currentUser.department?.name === 'PRD Department';

  // Helper function to get customer display name
  const getCustomerName = (customer: Customer | null | undefined) => {
    if (!customer) return '-';
    return customer.customer_name || customer.name || customer.email;
  };

  // Helper function to format time to 12-hour AM/PM format
  const formatTime = (time: string | null | undefined) => {
    if (!time) return '-';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minute} ${period}`;
  };

  // --------------- STATE -----------------
  const [search, setSearch] = useState('');
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState<number | null>(null);

  // Transaction form state
  const [transactionForm, setTransactionForm] = useState({
    so_no: '',
    total_delivery: '',
    fk_customer_id: null as number | null,
    fk_item_id: null as number | null,
    schedule_date: '',
    schedule_time: '',
  });

  // Delivery dialog state
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deliveryList, setDeliveryList] = useState<Delivery[]>([]);

  // Delivery form state (for add/edit)
  const [openAddDeliveryDialog, setOpenAddDeliveryDialog] = useState(false);
  const [editDeliveryId, setEditDeliveryId] = useState<number | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    mp_no: '',
    fk_equipment_id: null as number | null,
    volume: 0,
    delivery_status: 'Batching on Process',
    schedule_date: '',
    schedule_time: '',
  });

  // --------------- FILTER -----------------
  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter(
      t =>
        t.so_no.toLowerCase().includes(q) ||
        getCustomerName(t.customer).toLowerCase().includes(q) ||
        t.item?.item_name.toLowerCase().includes(q)
    );
  }, [search, transactions]);

  // --------------- DELIVERY WITH OVERALL VOLUME -----------------
  const deliveryWithOverallVolume = useMemo(() => {
    let runningTotal = 0;
    return deliveryList.map(d => {
      runningTotal += Number(d.volume);
      return { ...d, overall_volume: runningTotal };
    });
  }, [deliveryList]);

  // ---------------- TRANSACTION HANDLERS ----------------
  const openAddTransaction = () => {
    setTransactionForm({
      so_no: '',
      total_delivery: '',
      fk_customer_id: null,
      fk_item_id: null,
      schedule_date: '',
      schedule_time: '',
    });
    setEditTransactionId(null);
    setOpenTransactionDialog(true);
  };

  const openEditTransaction = (t: Transaction) => {
    setTransactionForm({
      so_no: t.so_no,
      total_delivery: String(t.total_delivery ?? ''),
      fk_customer_id: t.customer?.id ?? null,
      fk_item_id: t.item?.pk_item_id ?? null,
      schedule_date: t.schedule_date ?? '',
      schedule_time: t.schedule_time ?? '',
    });
    setEditTransactionId(t.pk_transac_id);
    setOpenTransactionDialog(true);
  };

  const closeTransactionDialog = () => {
    setTransactionForm({
      so_no: '',
      total_delivery: '',
      fk_customer_id: null,
      fk_item_id: null,
      schedule_date: '',
      schedule_time: '',
    });
    setEditTransactionId(null);
    setOpenTransactionDialog(false);
  };

  const submitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTransactionId) {
      router.put(`/user/transactions/${editTransactionId}`, transactionForm, {
        onSuccess: () => router.reload({ only: ['transactions'] }),
      });
    } else {
      router.post(`/user/transactions/store`, transactionForm, {
        onSuccess: () => router.reload({ only: ['transactions'] }),
      });
    }
    closeTransactionDialog();
  };

  const deleteTransaction = (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    router.delete(`/user/transactions/${id}`, {
      onSuccess: () => router.reload({ only: ['transactions'] }),
    });
  };

  // ---------------- DELIVERY HANDLERS ----------------
  const openDeliveryList = (t: Transaction) => {
    setSelectedTransaction(t);
    setDeliveryList(t.deliveries ?? []);
    setOpenDeliveryDialog(true);
  };

  const openAddDelivery = () => {
    setDeliveryForm({
      mp_no: '',
      fk_equipment_id: null,
      volume: 0,
      delivery_status: 'Batching on Process',
      schedule_date: '',
      schedule_time: '',
    });
    setEditDeliveryId(null);
    setOpenAddDeliveryDialog(true);
  };

  const openEditDelivery = (d: Delivery) => {
    setDeliveryForm({
      mp_no: d.mp_no,
      fk_equipment_id: d.fk_equipment_id,
      volume: d.volume,
      delivery_status: d.delivery_status,
      schedule_date: d.schedule_date ?? '',
      schedule_time: d.schedule_time ?? '',
    });
    setEditDeliveryId(d.pk_delivery_id);
    setOpenAddDeliveryDialog(true);
  };

  const submitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    if (editDeliveryId) {
      // Update existing delivery
      router.put(
        `/user/transactions/${selectedTransaction.pk_transac_id}/deliveries/${editDeliveryId}`,
        deliveryForm,
        {
          preserveScroll: true,
          onSuccess: (page: any) => {
            setOpenAddDeliveryDialog(false);
            // Update the selected transaction with fresh data
            const updatedTransaction = page.props.transactions.find(
              (t: Transaction) => t.pk_transac_id === selectedTransaction.pk_transac_id
            );
            if (updatedTransaction) {
              setSelectedTransaction(updatedTransaction);
              setDeliveryList(updatedTransaction.deliveries ?? []);
            }
          },
        }
      );
    } else {
      // Add new delivery
      router.post(
        `/user/transactions/${selectedTransaction.pk_transac_id}/deliveries`,
        deliveryForm,
        {
          preserveScroll: true,
          onSuccess: (page: any) => {
            setOpenAddDeliveryDialog(false);
            // Update the selected transaction with fresh data
            const updatedTransaction = page.props.transactions.find(
              (t: Transaction) => t.pk_transac_id === selectedTransaction.pk_transac_id
            );
            if (updatedTransaction) {
              setSelectedTransaction(updatedTransaction);
              setDeliveryList(updatedTransaction.deliveries ?? []);
            }
          },
        }
      );
    }
  };

  const deleteDelivery = (id: number) => {
    if (!confirm('Are you sure you want to delete this delivery?')) return;
    if (!selectedTransaction) return;

    router.delete(
      `/user/transactions/${selectedTransaction.pk_transac_id}/deliveries/${id}`,
      {
        preserveScroll: true,
        onSuccess: (page: any) => {
          // Update the selected transaction with fresh data
          const updatedTransaction = page.props.transactions.find(
            (t: Transaction) => t.pk_transac_id === selectedTransaction.pk_transac_id
          );
          if (updatedTransaction) {
            setSelectedTransaction(updatedTransaction);
            setDeliveryList(updatedTransaction.deliveries ?? []);
          }
        },
      }
    );
  };

  // ---------------- RENDER ----------------
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          {isAuthorized && <Button onClick={openAddTransaction}>Add Transaction</Button>}
        </div>

        <div className="mb-4 w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">SO No.</th>
                <th className="px-4 py-2 text-left font-semibold">Customer</th>
                <th className="px-4 py-2 text-left font-semibold">Item</th>
                <th className="px-4 py-2 text-left font-semibold">Total Delivery</th>
                <th className="px-4 py-2 text-left font-semibold">Schedule Date</th>
                <th className="px-4 py-2 text-left font-semibold">Schedule Time</th>
                <th className="px-4 py-2 text-left font-semibold">Deliveries</th>
                {isAuthorized && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length ? filteredTransactions.map((t, i) => (
                <tr key={t.pk_transac_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{t.so_no}</td>
                  <td className="px-4 py-2">{getCustomerName(t.customer)}</td>
                  <td className="px-4 py-2">{t.item?.item_name ?? '-'}</td>
                  <td className="px-4 py-2">{t.total_delivery}</td>
                  <td className="px-4 py-2">{t.schedule_date ?? '-'}</td>
                  <td className="px-4 py-2">{formatTime(t.schedule_time)}</td>
                  <td className="px-4 py-2">
                    <Button size="sm" onClick={() => openDeliveryList(t)}>View Deliveries</Button>
                  </td>
                  {isAuthorized && (
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditTransaction(t)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTransaction(t.pk_transac_id)}>Delete</Button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAuthorized ? 9 : 8} className="text-center py-4 text-gray-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ================= DELIVERY DIALOG ================= */}
      <Dialog open={openDeliveryDialog} onOpenChange={setOpenDeliveryDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedTransaction?.so_no} – Delivery Details
            </DialogTitle>
          </DialogHeader>

          {/* Transaction Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-600">SO No.</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {selectedTransaction?.so_no ?? "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Customer</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {getCustomerName(selectedTransaction?.customer)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Item</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {selectedTransaction?.item?.item_name ?? "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Total Delivery</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {selectedTransaction?.total_delivery ?? "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Schedule Date</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {selectedTransaction?.schedule_date ?? "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Schedule Time</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {formatTime(selectedTransaction?.schedule_time)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date Created</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {selectedTransaction?.date_created ?? "-"}
              </p>
            </div>
          </div>

          <hr className="my-4" />

          {/* Delivery List Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Delivery List</h2>
              <Button size="sm" onClick={openAddDelivery}>Add Delivery</Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">MP No</th>
                    <th className="px-4 py-2 text-left font-semibold">Truck</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Time</th>
                    <th className="px-4 py-2 text-left font-semibold">Volume</th>
                    <th className="px-4 py-2 text-left font-semibold">Overall Volume</th>
                    <th className="px-4 py-2 text-left font-semibold">Status</th>
                    <th className="px-4 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryWithOverallVolume.length ? deliveryWithOverallVolume.map(d => (
                    <tr key={d.pk_delivery_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{d.mp_no}</td>
                      <td className="px-4 py-2">{d.equipment?.equipment_name ?? 'Not assigned'}</td>
                      <td className="px-4 py-2">{d.schedule_date ?? '-'}</td>
                      <td className="px-4 py-2">{formatTime(d.schedule_time)}</td>
                      <td className="px-4 py-2">{d.volume}</td>
                      <td className="px-4 py-2 font-bold text-blue-600">{d.overall_volume}</td>
                      <td className="px-4 py-2"><StatusBadge status={d.delivery_status} /></td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDelivery(d)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteDelivery(d.pk_delivery_id)}>Delete</Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-gray-500">No deliveries yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setOpenDeliveryDialog(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= ADD/EDIT TRANSACTION DIALOG ================= */}
      <Dialog open={openTransactionDialog} onOpenChange={setOpenTransactionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editTransactionId ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitTransaction} className="space-y-4 mt-4">
            <div>
              <Label>SO No.</Label>
              <Input
                value={transactionForm.so_no}
                onChange={e => setTransactionForm({ ...transactionForm, so_no: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Customer</Label>
              <select
                value={transactionForm.fk_customer_id ?? ''}
                onChange={e => setTransactionForm({ ...transactionForm, fk_customer_id: Number(e.target.value) })}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.customer_name || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Item</Label>
              <select
                value={transactionForm.fk_item_id ?? ''}
                onChange={e => setTransactionForm({ ...transactionForm, fk_item_id: Number(e.target.value) })}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">-- Select Item --</option>
                {items.map(i => (
                  <option key={i.pk_item_id} value={i.pk_item_id}>{i.item_name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Total Delivery</Label>
              <Input
                type="number"
                value={transactionForm.total_delivery}
                onChange={e => setTransactionForm({ ...transactionForm, total_delivery: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Schedule Date</Label>
              <Input
                type="date"
                value={transactionForm.schedule_date}
                onChange={e => setTransactionForm({ ...transactionForm, schedule_date: e.target.value })}
              />
            </div>

            <div>
              <Label>Schedule Time</Label>
              <Input
                type="time"
                value={transactionForm.schedule_time}
                onChange={e => setTransactionForm({ ...transactionForm, schedule_time: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeTransactionDialog}>Cancel</Button>
              <Button type="submit">{editTransactionId ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= ADD/EDIT DELIVERY DIALOG ================= */}
      <Dialog open={openAddDeliveryDialog} onOpenChange={setOpenAddDeliveryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editDeliveryId ? 'Edit Delivery' : 'Add Delivery'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitDelivery} className="space-y-4 mt-4">
            <div>
              <Label>MP No.</Label>
              <Input
                value={deliveryForm.mp_no}
                onChange={e => setDeliveryForm({ ...deliveryForm, mp_no: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Truck/Equipment</Label>
              <select
                value={deliveryForm.fk_equipment_id ?? ''}
                onChange={e => setDeliveryForm({ ...deliveryForm, fk_equipment_id: Number(e.target.value) })}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">-- Select Truck --</option>
                {equipment.map(eq => (
                  <option key={eq.pk_equipment_id} value={eq.pk_equipment_id}>
                    {eq.equipment_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Volume</Label>
              <Input
                type="number"
                step="0.01"
                value={deliveryForm.volume}
                onChange={e => setDeliveryForm({ ...deliveryForm, volume: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label>Delivery Status</Label>
              <select
                value={deliveryForm.delivery_status}
                onChange={e => setDeliveryForm({ ...deliveryForm, delivery_status: e.target.value })}
                className="border p-2 w-full rounded"
                required
              >
                <option value="Batching on Process">Batching on Process</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div>
              <Label>Schedule Date</Label>
              <Input
                type="date"
                value={deliveryForm.schedule_date}
                onChange={e => setDeliveryForm({ ...deliveryForm, schedule_date: e.target.value })}
              />
            </div>

            <div>
              <Label>Schedule Time</Label>
              <Input
                type="time"
                value={deliveryForm.schedule_time}
                onChange={e => setDeliveryForm({ ...deliveryForm, schedule_time: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAddDeliveryDialog(false)}>Cancel</Button>
              <Button type="submit">{editDeliveryId ? 'Update' : 'Save'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}