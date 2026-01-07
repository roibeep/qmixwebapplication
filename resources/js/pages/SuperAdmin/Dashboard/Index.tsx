import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users, Building2, FolderKanban, Truck } from 'lucide-react';

// Types
interface Department {
  departmentID: number;
  name: string;
  description?: string;
}

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

interface PageProps {
  stats: Stats;
  users: UserData[];
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/superadmin/dashboard' },
];

export default function DashboardIndex() {
  const { stats, users } = usePage<PageProps>().props;
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of all users, departments, projects, and deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
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

      {/* Users Table */}
      <Card className="p-6 rounded-none">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Details</h2>
        </div>

        {/* Search */}
        <div className="mb-4">
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
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm rounded-lg">
            <thead className="bg-gray-100">
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
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{user.name}</td>
                    <td className="px-4 py-2 text-gray-600">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">{user.department}</td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-semibold">
                        {user.projects_count}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-800 font-semibold">
                        {user.deliveries_count}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
            <span className="font-semibold">{users.length}</span> users
          </p>
        </div>
      </Card>
    </div>
  );
}