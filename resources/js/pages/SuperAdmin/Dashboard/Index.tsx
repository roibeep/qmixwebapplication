import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users, Building2, FolderKanban, Truck } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

// Types
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  departmentID: number | null;
  projects_count: number;
  deliveries_count: number;
}

interface Stats {
  total_users: number;
  total_departments: number;
  total_projects: number;
  total_deliveries: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/superadmin/dashboard' },
];

export default function DashboardIndex() {
  const { stats, users } = usePage().props as unknown as { stats: Stats; users: UserData[] };
  const [search, setSearch] = useState('');

  // Filtered users based on search
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();

    return users.filter((user) =>
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q) ||
      user.department.toLowerCase().includes(q)
    );
  }, [search, users]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Departments',
      value: stats.total_departments,
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Total Projects',
      value: stats.total_projects,
      icon: FolderKanban,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Deliveries',
      value: stats.total_deliveries,
      icon: Truck,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">

        {/* Users Table */}
        <Card className="p-6 rounded-none">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <h1 className="text-2xl font-bold">User Details</h1>
          
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <table className="min-w-full border text-sm rounded-lg">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Email</th>
                <th className="px-4 py-2 text-left font-semibold">Role</th>
                <th className="px-4 py-2 text-left font-semibold">Department</th>
                <th className="px-4 py-2 text-left font-semibold">Projects</th>
                <th className="px-4 py-2 text-left font-semibold">Deliveries</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">{user.department}</td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-semibold text-xs text-left">
                        {user.projects_count}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 font-semibold text-xs text-left">
                        {user.deliveries_count}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Summary Footer */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
              <span className="font-semibold">{users.length}</span> users
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}