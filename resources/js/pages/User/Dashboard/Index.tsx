import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/user/dashboard' },
];

export default function UserDashboard() {
  const { user } = usePage<{ user: any }>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">

      </div>
    </AppLayout>
  );
}