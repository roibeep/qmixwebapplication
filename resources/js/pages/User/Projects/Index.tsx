import { useState, useMemo } from 'react';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, FileText, CalendarClock, Loader, Truck, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface Customer { id: number; name: string; }
interface Project { 
  projectID: number; 
  name: string; 
  project_location: string; 
  end_location?: string | null; 
  design_mix?: string | null;
  customer?: Customer | null;
}
interface Delivery { 
  deliveryID: number; 
  mp_no: string; 
  truck_no: string; 
  volume: number; 
  delivery_status: string; 
  overall_volume?: number; 
}

interface PageProps extends InertiaPageProps {
  projects: Project[];
  clients: Customer[];
  auth: {
    user: {
      role: string;
      department?: {
        id: number;
        name: string;
      };
    };
  };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manage Projects and Track Deliveries', href: '/user/projects' }];

export default function UserProjectIndex() {
  const { projects, clients, auth } = usePage<PageProps>().props;

  const currentUser = auth.user;
  // ✅ Fixed: Added .name to compare department
  const isAuthorized = currentUser.role === 'user' && currentUser.department?.name === 'PRD Department';

  /* ================= STATE ================= */
  const [search, setSearch] = useState('');
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({ 
    customerID: '' as number | '', 
    name: '', 
    project_location: '', 
    end_location: '', 
    design_mix: '' 
  });

  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deliveryList, setDeliveryList] = useState<Delivery[]>([]);
  const [openAddDeliveryDialog, setOpenAddDeliveryDialog] = useState(false);
  const [editDeliveryId, setEditDeliveryId] = useState<number | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({ mp_no: '', truck_no: '', volume: 0, delivery_status: 'SO Created' });

  /* ================= FILTER ================= */
  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      p => p.name.toLowerCase().includes(q) || (p.customer?.name.toLowerCase().includes(q) ?? false)
    );
  }, [search, projects]);

  /* ================= OVERALL VOLUME LOGIC ================= */
  const deliveryWithOverallVolume = useMemo(() => {
    let runningTotal = 0;
    return deliveryList.map(d => {
      runningTotal += Number(d.volume);
      return { ...d, overall_volume: runningTotal };
    });
  }, [deliveryList]);

  /* ================= STATUS BADGE COMPONENT ================= */
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

  /* ================= PROJECT HANDLERS ================= */
  const openAddProject = () => {
    setProjectForm({ customerID: '', name: '', project_location: '', end_location: '', design_mix: '' });
    setEditProjectId(null);
    setOpenProjectDialog(true);
  };

  const openEditProject = (proj: Project) => {
    setProjectForm({
      customerID: proj.customer?.id || '',
      name: proj.name,
      project_location: proj.project_location,
      end_location: proj.end_location || '',
      design_mix: proj.design_mix || '',
    });
    setEditProjectId(proj.projectID);
    setOpenProjectDialog(true);
  };

  const closeProjectDialog = () => {
    setProjectForm({ customerID: '', name: '', project_location: '', end_location: '', design_mix: '' });
    setEditProjectId(null);
    setOpenProjectDialog(false);
  };

  const submitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProjectId) {
      router.put(`/user/projects/${editProjectId}`, projectForm, { 
        onSuccess: () => router.reload({ only: ['projects'] }) 
      });
    } else {
      router.post('/user/projects/store', projectForm, { 
        onSuccess: () => router.reload({ only: ['projects'] }) 
      });
    }
    closeProjectDialog();
  };

  const deleteProject = (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    router.delete(`/user/projects/${id}`, { 
      onSuccess: () => router.reload({ only: ['projects'] }) 
    });
  };

  /* ================= DELIVERY HANDLERS ================= */
  const openDeliveryList = async (proj: Project) => {
    setSelectedProject(proj);
    try {
      const res = await fetch(`/user/projects/${proj.projectID}/deliveries`);
      setDeliveryList(await res.json());
      setOpenDeliveryDialog(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddDelivery = () => {
    setDeliveryForm({ mp_no: '', truck_no: '', volume: 0, delivery_status: 'SO Created' });
    setEditDeliveryId(null);
    setOpenAddDeliveryDialog(true);
  };

  const openEditDelivery = (d: Delivery) => {
    setDeliveryForm({ mp_no: d.mp_no, truck_no: d.truck_no, volume: d.volume, delivery_status: d.delivery_status });
    setEditDeliveryId(d.deliveryID);
    setOpenAddDeliveryDialog(true);
  };

  const submitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    const url = editDeliveryId
      ? `/user/trackingdelivery/${editDeliveryId}`
      : `/user/projects/${selectedProject.projectID}/deliveries`;
    const method = editDeliveryId ? 'put' : 'post';
    router[method](url, editDeliveryId ? { ...deliveryForm, projectID: selectedProject.projectID } : deliveryForm, {
      onSuccess: async () => {
        const res = await fetch(`/user/projects/${selectedProject.projectID}/deliveries`);
        setDeliveryList(await res.json());
        setOpenAddDeliveryDialog(false);
        setEditDeliveryId(null);
      },
    });
  };

  const deleteDelivery = (id: number) => {
    if (!confirm('Are you sure you want to delete this delivery?')) return;
    router.delete(`/user/trackingdelivery/${id}`, {
      onSuccess: async () => {
        if (!selectedProject) return;
        const res = await fetch(`/user/projects/${selectedProject.projectID}/deliveries`);
        setDeliveryList(await res.json());
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-4">My Projects</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search project..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>

          {isAuthorized && <Button onClick={openAddProject}>Add Project</Button>}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Customer</th>
                <th className="px-4 py-2 text-left font-semibold">Project Name</th>
                <th className="px-4 py-2 text-left font-semibold">Project Location</th>
                <th className="px-4 py-2 text-left font-semibold">End Location</th>
                <th className="px-4 py-2 text-left font-semibold">Design Mix</th>
                <th className="px-4 py-2 text-left font-semibold">Deliveries</th>
                {isAuthorized && <th className="px-4 py-2 text-left font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj, idx) => (
                  <tr key={proj.projectID} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{proj.customer?.name || '-'}</td>
                    <td className="px-4 py-2">{proj.name}</td>
                    <td className="px-4 py-2">{proj.project_location}</td>
                    <td className="px-4 py-2">{proj.end_location || '-'}</td>
                    <td className="px-4 py-2">{proj.design_mix || '-'}</td>
                    <td className="px-4 py-2">
                      <Button size="sm" onClick={() => openDeliveryList(proj)}>View Deliveries</Button>
                    </td>
                    {isAuthorized && (
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditProject(proj)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProject(proj.projectID)}>Delete</Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAuthorized ? 8 : 7} className="text-center py-4 text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===== Add/Edit Project Dialog ===== */}
      <Dialog open={openProjectDialog} onOpenChange={setOpenProjectDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editProjectId ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitProject} className="space-y-4 mt-4">
            <div>
              <Label>Customer</Label>
              <select
                value={projectForm.customerID}
                onChange={(e) => setProjectForm({ ...projectForm, customerID: Number(e.target.value) })}
                className="border p-2 w-full rounded"
                required
                disabled={!!editProjectId}
              >
                <option value="">-- Select Customer --</option>
                {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

      {/* ===== Delivery Dialog - Add/Edit Delivery ===== */}
      <Dialog open={openAddDeliveryDialog} onOpenChange={setOpenAddDeliveryDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editDeliveryId ? 'Edit Delivery' : 'Add Delivery'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitDelivery} className="space-y-4 mt-4">
            <div>
              <Label>MP No</Label>
              <Input value={deliveryForm.mp_no} onChange={(e) => setDeliveryForm({ ...deliveryForm, mp_no: e.target.value })} required />
            </div>
            <div>
              <Label>Truck No</Label>
              <Input value={deliveryForm.truck_no} onChange={(e) => setDeliveryForm({ ...deliveryForm, truck_no: e.target.value })} required />
            </div>
            <div>
              <Label>Volume</Label>
              <Input type="number" value={deliveryForm.volume} onChange={(e) => setDeliveryForm({ ...deliveryForm, volume: Number(e.target.value) })} required />
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={deliveryForm.delivery_status}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, delivery_status: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="SO Created">SO Created</option>
                <option value="Schedule Create">Schedule Create</option>
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

      {/* ===== View Deliveries Dialog ===== */}
      <Dialog open={openDeliveryDialog} onOpenChange={setOpenDeliveryDialog}>
        <DialogContent className="sm:max-w-[900px] p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{selectedProject?.name} – Delivery Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Project Name</Label>
                <p className="mt-1 p-2 border rounded bg-gray-50">{selectedProject?.name}</p>
              </div>
              <div>
                <Label>Project Location</Label>
                <p className="mt-1 p-2 border rounded bg-gray-50">{selectedProject?.project_location}</p>
              </div>
              <div>
                <Label>Design Mix</Label>
                <p className="mt-1 p-2 border rounded bg-gray-50">{selectedProject?.design_mix ?? "-"}</p>
              </div>
            </div>

            <hr />

            <div>
              <div className="flex justify-between items-center mb-3">
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
                    {deliveryWithOverallVolume.length > 0 ? (
                      deliveryWithOverallVolume.map((d) => (
                        <tr key={d.deliveryID} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{d.mp_no}</td>
                          <td className="px-4 py-2">{d.truck_no}</td>
                          <td className="px-4 py-2">{d.volume}</td>
                          <td className="px-4 py-2 font-bold text-blue-600">{d.overall_volume}</td>
                          <td className="px-4 py-2"><StatusBadge status={d.delivery_status} /></td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditDelivery(d)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteDelivery(d.deliveryID)}>Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-gray-500">No deliveries yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setOpenDeliveryDialog(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </AppLayout>
  );
}