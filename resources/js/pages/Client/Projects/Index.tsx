import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  FileText,
  CalendarClock,
  Loader,
  Truck,
  CheckCircle,
} from 'lucide-react';

interface Project {
  projectID: number;
  name: string;
  project_location: string;
  design_mix?: string;
}

interface Delivery {
  deliveryID: number;
  mp_no: string;
  truck_no: string;
  volume: number;
  delivery_status: string;
  overall_volume?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'My Projects', href: '/client/projects' },
];

export default function ClientProjects() {
  const { projects } = usePage<{ projects: Project[] }>().props;

  const [search, setSearch] = useState('');
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deliveryList, setDeliveryList] = useState<Delivery[]>([]);

  const filteredProjects = useMemo(() => {
    if (!search) return projects || [];
    const q = search.toLowerCase();
    return (projects || []).filter((p) => (p.name || '').toLowerCase().includes(q));
  }, [search, projects]);

  const deliveryWithOverallVolume = useMemo(() => {
    let total = 0;
    return deliveryList.map((d) => {
      total += Number(d.volume);
      return { ...d, overall_volume: total };
    });
  }, [deliveryList]);

  const openDeliveryList = async (proj: Project) => {
    console.log('openDeliveryList clicked for projectID', proj.projectID);
    setSelectedProject(proj);

    try {
      const res = await fetch(`/client/projects/${proj.projectID}/deliveries`);
      if (!res.ok) {
        console.error('Fetch failed', res.status, await res.text());
        return;
      }
      const data = await res.json();
      setDeliveryList(data);
      setOpenDeliveryDialog(true);
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  function StatusBadge({ status }: { status: string }) {
    const map: any = {
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
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-4">My Projects</h1>

        <div className="relative w-64 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <table className="min-w-full border text-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">#</th>
              <th className="px-4 py-2 text-left font-semibold">Project</th>
              <th className="px-4 py-2 text-left font-semibold">Location</th>
              <th className="px-4 py-2 text-left font-semibold">Design Mix</th>
              <th className="px-4 py-2 text-left font-semibold">Deliveries</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj, index) => (
              <tr key={proj.projectID} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-left">{index + 1}</td>
                <td className="px-4 py-2 text-left">{proj.name}</td>
                <td className="px-4 py-2 text-left">{proj.project_location}</td>
                <td className="px-4 py-2 text-left">{proj.design_mix ?? '-'}</td>
                <td className="px-4 py-2 text-left">
                  <Button size="sm" onClick={() => openDeliveryList(proj)}>
                    View Deliveries
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={openDeliveryDialog} onOpenChange={setOpenDeliveryDialog}>
        <DialogContent className="sm:max-w-[900px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedProject?.name} – Delivery Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Top Project Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <p className="mt-1 p-2 border rounded bg-gray-50">
                  {selectedProject?.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Project Location</label>
                <p className="mt-1 p-2 border rounded bg-gray-50">
                  {selectedProject?.project_location}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Design Mix</label>
                <p className="mt-1 p-2 border rounded bg-gray-50">
                  {selectedProject?.design_mix ?? "-"}
                </p>
              </div>
            </div>

            <hr />

            {/* Deliveries Table Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Delivery List</h2>

              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">MP No</th>
                      <th className="px-4 py-2 text-left font-semibold">Truck</th>
                      <th className="px-4 py-2 text-left font-semibold">Volume</th>
                      <th className="px-4 py-2 text-left font-semibold">Overall Volume</th>
                      <th className="px-4 py-2 text-left font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {deliveryWithOverallVolume.length > 0 ? (
                      deliveryWithOverallVolume.map((d) => (
                        <tr key={d.deliveryID} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{d.mp_no}</td>
                          <td className="px-4 py-2">{d.truck_no}</td>
                          <td className="px-4 py-2">{d.volume}</td>
                          <td className="px-4 py-2">{d.overall_volume}</td>
                          <td className="px-4 py-2">
                            <StatusBadge status={d.delivery_status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          No deliveries yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setOpenDeliveryDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
