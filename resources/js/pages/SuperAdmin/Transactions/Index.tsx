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

interface Customer { pk_customer_id: number; customer_name: string; }
interface Equipment { pk_equipment_id: number; equipment_name: string; }
interface Item { pk_item_id: number; item_name: string; }

interface Delivery {
  pk_delivery_id: number;
  mp_no: string;
  truck_no?: string; // Optional, can be filled from equipment
  volume: number;
  delivery_status: string;
  fk_equipment_id: number;
  equipment?: Equipment | null;
}

interface Transaction {
  pk_transac_id: number;
  so_no: string;
  total_delivery: number;
  date_created: string;
  customer?: Customer | null;
  equipment?: Equipment | null;
  item?: Item | null;
  deliveries?: Delivery[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Manage Transactions', href: '/superadmin/transactions' },
];

// ----------------- StatusBadge -----------------
interface StatusBadgeProps { status: string; }

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    'SO Created': { icon: <FileText className="w-4 h-4" />, color: 'bg-gray-200 text-gray-800' },
    'Schedule Create': { icon: <CalendarClock className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
    'Batching on Process': { icon: <Loader className="w-4 h-4 animate-spin" />, color: 'bg-yellow-100 text-yellow-800' },
    'Out for Delivery': { icon: <Truck className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800' },
    'Delivered': { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
  };
  const s = map[status] || map['SO Created'];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
      {s.icon} {status}
    </span>
  );
};

// ----------------- TransactionIndex -----------------
export default function TransactionIndex() {
  const { transactions, customers, equipment, items, auth } = usePage<{
    transactions: Transaction[];
    customers: Customer[];
    equipment: Equipment[];
    items: Item[];
    auth: any;
  }>().props;

  const currentUser = auth.user;
  const isAuthorized = currentUser.role?.toLowerCase() === 'superadmin';

  // --------------- STATE -----------------
  const [search, setSearch] = useState('');
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState<number | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    so_no: '',
    total_delivery: '',
    fk_customer_id: null as number | null,
    fk_equipment_id: null as number | null,
    fk_item_id: null as number | null,
  });

  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deliveryList, setDeliveryList] = useState<Delivery[]>([]);

  const [openAddDeliveryDialog, setOpenAddDeliveryDialog] = useState(false);
  const [editDeliveryId, setEditDeliveryId] = useState<number | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    mp_no: '',
    truck_no: '',
    fk_equipment_id: null as number | null,
    volume: 0,
    delivery_status: 'SO Created',
  });

  // --------------- FILTER -----------------
  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter(
      t =>
        t.so_no.toLowerCase().includes(q) ||
        t.customer?.customer_name.toLowerCase().includes(q) ||
        t.equipment?.equipment_name.toLowerCase().includes(q) ||
        t.item?.item_name.toLowerCase().includes(q)
    );
  }, [search, transactions]);

  // ----------------- PROJECT STATE -----------------
const [openProjectDialog, setOpenProjectDialog] = useState(false);
const [editProjectId, setEditProjectId] = useState<number | null>(null);
const [projectForm, setProjectForm] = useState({
  customerID: null as number | null,
  name: '',
  project_location: '',
  end_location: '',
  design_mix: '',
});

// ----------------- PROJECT HANDLERS -----------------
const openAddProject = () => {
  setProjectForm({ customerID: null, name: '', project_location: '', end_location: '', design_mix: '' });
  setEditProjectId(null);
  setOpenProjectDialog(true);
};

const openEditProject = (project: any) => {
  setProjectForm({
    customerID: project.customerID ?? null,
    name: project.name ?? '',
    project_location: project.project_location ?? '',
    end_location: project.end_location ?? '',
    design_mix: project.design_mix ?? '',
  });
  setEditProjectId(project.id);
  setOpenProjectDialog(true);
};

const closeProjectDialog = () => {
  setProjectForm({ customerID: null, name: '', project_location: '', end_location: '', design_mix: '' });
  setEditProjectId(null);
  setOpenProjectDialog(false);
};

const submitProject = (e: React.FormEvent) => {
  e.preventDefault();
  if (editProjectId) {
    router.put(`/projects/${editProjectId}`, projectForm, { onSuccess: () => router.reload({ only: ['projects'] }) });
  } else {
    router.post(`/projects/store`, projectForm, { onSuccess: () => router.reload({ only: ['projects'] }) });
  }
  closeProjectDialog();
};


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
    setTransactionForm({ so_no: '', total_delivery: '', fk_customer_id: null, fk_equipment_id: null, fk_item_id: null });
    setEditTransactionId(null);
    setOpenTransactionDialog(true);
  };

  const openEditTransaction = (t: Transaction) => {
    setTransactionForm({
      so_no: t.so_no,
      total_delivery: String(t.total_delivery ?? ''),
      fk_customer_id: t.customer?.pk_customer_id ?? null,
      fk_equipment_id: t.equipment?.pk_equipment_id ?? null,
      fk_item_id: t.item?.pk_item_id ?? null,
    });
    setEditTransactionId(t.pk_transac_id);
    setOpenTransactionDialog(true);
  };

  const closeTransactionDialog = () => {
    setTransactionForm({ so_no: '', total_delivery: '', fk_customer_id: null, fk_equipment_id: null, fk_item_id: null });
    setEditTransactionId(null);
    setOpenTransactionDialog(false);
  };

  const submitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTransactionId) {
      router.put(`/superadmin/transactions/${editTransactionId}`, transactionForm, { onSuccess: () => router.reload({ only: ['transactions'] }) });
    } else {
      router.post(`/superadmin/transactions/store`, transactionForm, { onSuccess: () => router.reload({ only: ['transactions'] }) });
    }
    closeTransactionDialog();
  };

  const deleteTransaction = (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    router.delete(`/superadmin/transactions/${id}`, { onSuccess: () => router.reload({ only: ['transactions'] }) });
  };

  // ---------------- DELIVERY HANDLERS ----------------
  const openDeliveryList = (t: Transaction) => {
    setSelectedTransaction(t);
    setDeliveryList(t.deliveries ?? []);
    setOpenDeliveryDialog(true);
  };

  const openAddDelivery = () => {
    setDeliveryForm({ mp_no: '', truck_no: '', fk_equipment_id: null, volume: 0, delivery_status: 'SO Created' });
    setEditDeliveryId(null);
    setOpenAddDeliveryDialog(true);
  };

  const openEditDelivery = (d: Delivery) => {
    setDeliveryForm({
      mp_no: d.mp_no,
      truck_no: d.truck_no ?? d.equipment?.equipment_name ?? '',
      fk_equipment_id: d.fk_equipment_id,
      volume: d.volume,
      delivery_status: d.delivery_status,
    });
    setEditDeliveryId(d.pk_delivery_id);
    setOpenAddDeliveryDialog(true);
  };

  const submitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    const url = editDeliveryId
      ? `/superadmin/trackingdelivery/${editDeliveryId}`
      : `/superadmin/transactions/${selectedTransaction.pk_transac_id}/deliveries`;
    const method = editDeliveryId ? 'put' : 'post';

    router[method](url, { ...deliveryForm, fk_transac_id: selectedTransaction.pk_transac_id }, {
      onSuccess: () => {
        const updated = transactions.find(t => t.pk_transac_id === selectedTransaction?.pk_transac_id);
        setDeliveryList(updated?.deliveries ?? []);
        setOpenAddDeliveryDialog(false);
        setEditDeliveryId(null);
      },
    });
  };

  const deleteDelivery = (id: number) => {
    if (!confirm('Are you sure you want to delete this delivery?')) return;
    router.delete(`/superadmin/trackingdelivery/${id}`, {
      onSuccess: () => setDeliveryList(prev => prev.filter(d => d.pk_delivery_id !== id)),
    });
  };

  // ---------------- RENDER ----------------
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          {isAuthorized && <Button onClick={openAddProject}>Add Transaction</Button>}
        </div>

        <div className="mb-4 w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">SO No.</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Truck</th>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Total Delivery</th>
                <th className="px-4 py-2">Deliveries</th>
                {isAuthorized && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length ? filteredTransactions.map((t, i) => (
                <tr key={t.pk_transac_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{t.so_no}</td>
                  <td className="px-4 py-2">{t.customer?.customer_name ?? '-'}</td>
                  <td className="px-4 py-2">{t.equipment?.equipment_name ?? '-'}</td>
                  <td className="px-4 py-2">{t.item?.item_name ?? '-'}</td>
                  <td className="px-4 py-2">{t.total_delivery}</td>
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
                  <td colSpan={isAuthorized ? 8 : 7} className="text-center py-4 text-gray-500">No transactions found.</td>
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
                {selectedTransaction?.customer?.customer_name ?? "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Truck</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">
                {selectedTransaction?.equipment?.equipment_name ?? "-"}
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
                      <td className="px-4 py-2">{d.truck_no ?? '-'}</td>
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
                      <td colSpan={6} className="text-center py-6 text-gray-500">No deliveries yet.</td>
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

      {/* ======= Add/Edit Project Dialog ======= */}
      <Dialog open={openProjectDialog} onOpenChange={setOpenProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editProjectId ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitProject} className="space-y-4 mt-4">
            <div>
              <Label>Customer</Label>
              <select
                value={projectForm.customerID ?? ''}
                onChange={(e) => setProjectForm({ ...projectForm, customerID: Number(e.target.value) })}
                className="border p-2 w-full rounded"
                required
                disabled={!!editProjectId}
              >
                <option value="">-- Select Customer --</option>
                {customers.map(c => <option key={c.pk_customer_id} value={c.pk_customer_id}>{c.customer_name}</option>)}
              </select>
            </div>
            <div>
              <Label>Project Name</Label>
              <Input value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} required />
            </div>
            <div>
              <Label>Project Location</Label>
              <Input value={projectForm.project_location} onChange={(e) => setProjectForm({ ...projectForm, project_location: e.target.value })} required />
            </div>
            <div>
              <Label>End Location</Label>
              <Input value={projectForm.end_location} onChange={(e) => setProjectForm({ ...projectForm, end_location: e.target.value })} />
            </div>
            <div>
              <Label>Design Mix</Label>
              <Input value={projectForm.design_mix} onChange={(e) => setProjectForm({ ...projectForm, design_mix: e.target.value })} />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={closeProjectDialog}>Cancel</Button>
              <Button type="submit">{editProjectId ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= ADD/EDIT DELIVERY DIALOG ================= */}
      <Dialog open={openAddDeliveryDialog} onOpenChange={setOpenAddDeliveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDeliveryId ? 'Edit Delivery' : 'Add Delivery'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitDelivery} className="space-y-4 mt-4">
            <div>
              <Label>MP No</Label>
              <Input value={deliveryForm.mp_no} onChange={e => setDeliveryForm({ ...deliveryForm, mp_no: e.target.value })} required />
            </div>
            <div>
              <Label>Truck No</Label>
              <Input value={deliveryForm.truck_no} onChange={e => setDeliveryForm({ ...deliveryForm, truck_no: e.target.value })} required />
            </div>
            <div>
              <Label>Volume</Label>
              <Input type="number" value={deliveryForm.volume} onChange={e => setDeliveryForm({ ...deliveryForm, volume: Number(e.target.value) })} required />
            </div>
            <div>
              <Label>Status</Label>
              <select value={deliveryForm.delivery_status} onChange={e => setDeliveryForm({ ...deliveryForm, delivery_status: e.target.value })} className="border p-2 w-full rounded" required>
                <option value="">-- Select Status --</option>
                <option value="Batching on Process">Batching on Process</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAddDeliveryDialog(false)}>Cancel</Button>
              <Button type="submit">{editDeliveryId ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
