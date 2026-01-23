import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Loader, Truck, CheckCircle, Package } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

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
  { title: 'My Deliveries', href: '/client/projects' },
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

// ----------------- ClientProjectsIndex -----------------
export default function ClientProjectsIndex() {
  const { 
    transactions = [],
    equipment = [],
    auth 
  } = usePage<{
    transactions: Transaction[];
    equipment: Equipment[];
    auth: any;
  }>().props;

  const currentUser = auth.user;

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

  // Filter transactions to only show current client's transactions
  const myTransactions = useMemo(() => {
    return transactions.filter(t => t.fk_customer_id === currentUser.id);
  }, [transactions, currentUser.id]);

  // --------------- STATE -----------------
  const [search, setSearch] = useState('');
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deliveryList, setDeliveryList] = useState<Delivery[]>([]);

  // --------------- FILTER -----------------
  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase();
    return myTransactions.filter(
      t =>
        t.so_no.toLowerCase().includes(q) ||
        t.item?.item_name.toLowerCase().includes(q)
    );
  }, [search, myTransactions]);

  // --------------- DELIVERY WITH OVERALL VOLUME -----------------
  const deliveryWithOverallVolume = useMemo(() => {
    let runningTotal = 0;
    return deliveryList.map(d => {
      runningTotal += Number(d.volume);
      return { ...d, overall_volume: runningTotal };
    });
  }, [deliveryList]);

  // ---------------- DELIVERY HANDLERS ----------------
  const openDeliveryList = (t: Transaction) => {
    setSelectedTransaction(t);
    setDeliveryList(t.deliveries ?? []);
    setOpenDeliveryDialog(true);
  };

  const markAsDelivered = (deliveryId: number) => {
    if (!confirm('Mark this delivery as delivered?')) return;
    
    router.put(
      `/client/deliveries/${deliveryId}/mark-delivered`,
      {},
      {
        preserveScroll: true,
        onSuccess: (page: any) => {
          // Update the selected transaction with fresh data
          const updatedTransaction = page.props.transactions.find(
            (t: Transaction) => t.pk_transac_id === selectedTransaction?.pk_transac_id
          );
          if (updatedTransaction) {
            setSelectedTransaction(updatedTransaction);
            setDeliveryList(updatedTransaction.deliveries ?? []);
          }
        },
      }
    );
  };

  const markAsOutForDelivery = (deliveryId: number) => {
    if (!confirm('Change status back to "Out for Delivery"?')) return;
    
    router.put(
      `/client/deliveries/${deliveryId}/mark-out-for-delivery`,
      {},
      {
        preserveScroll: true,
        onSuccess: (page: any) => {
          // Update the selected transaction with fresh data
          const updatedTransaction = page.props.transactions.find(
            (t: Transaction) => t.pk_transac_id === selectedTransaction?.pk_transac_id
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
        {/* Header - Same as SuperAdmin but NO Add Transaction button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Deliveries</h1>
          {/* NO ADD TRANSACTION BUTTON */}
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
                <th className="px-4 py-2 text-left font-semibold">Item</th>
                <th className="px-4 py-2 text-left font-semibold">Total Delivery</th>
                <th className="px-4 py-2 text-left font-semibold">Schedule Date</th>
                <th className="px-4 py-2 text-left font-semibold">Schedule Time</th>
                <th className="px-4 py-2 text-left font-semibold">Deliveries</th>
                {/* NO ACTIONS COLUMN */}
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length ? filteredTransactions.map((t, i) => (
                <tr key={t.pk_transac_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-semibold">{t.so_no}</td>
                  <td className="px-4 py-2">{t.item?.item_name ?? '-'}</td>
                  <td className="px-4 py-2">{t.total_delivery}</td>
                  <td className="px-4 py-2">{t.schedule_date ?? '-'}</td>
                  <td className="px-4 py-2">{formatTime(t.schedule_time)}</td>
                  <td className="px-4 py-2">
                    <Button size="sm" onClick={() => openDeliveryList(t)}>
                      View Deliveries
                    </Button>
                  </td>
                  {/* NO EDIT/DELETE BUTTONS */}
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">No deliveries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ================= DELIVERY DIALOG (READ-ONLY) ================= */}
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
              {/* NO ADD DELIVERY BUTTON */}
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
                    <th className="px-4 py-2 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryWithOverallVolume.length ? deliveryWithOverallVolume.map(d => (
                    <tr key={d.pk_delivery_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold">{d.mp_no}</td>
                      <td className="px-4 py-2">
                        {/* READ-ONLY TRUCK NAME (NO DROPDOWN) */}
                        {d.equipment?.equipment_name ?? 'Not assigned'}
                      </td>
                      <td className="px-4 py-2">{d.schedule_date ?? '-'}</td>
                      <td className="px-4 py-2">{formatTime(d.schedule_time)}</td>
                      <td className="px-4 py-2">{d.volume}</td>
                      <td className="px-4 py-2 font-bold text-blue-600">{d.overall_volume}</td>
                      <td className="px-4 py-2"><StatusBadge status={d.delivery_status} /></td>
                      <td className="px-4 py-2">
                        {/* MARK DELIVERED BUTTON OR CHANGE STATUS BUTTON */}
                        {d.delivery_status !== 'Delivered' && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => markAsDelivered(d.pk_delivery_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {d.delivery_status === 'Delivered' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsOutForDelivery(d.pk_delivery_id)}
                            className="border-orange-600 text-orange-600 hover:bg-orange-50"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Mark Out for Delivery
                          </Button>
                        )}
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
    </AppLayout>
  );
}