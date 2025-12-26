import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Trash2 } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface Review {
  id: number;
  user_name: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: number;
  q6: number;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  status: string;
  submitted_at: string;
}

interface PageProps extends InertiaPageProps {
  reviews: Review[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Client Reviews', href: '/superadmin/reviews' },
];

export default function SuperAdminReviewIndex() {
  const { reviews } = usePage<PageProps>().props;

  const [search, setSearch] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const filteredReviews = useMemo(() => {
    if (!search) return reviews;
    const q = search.toLowerCase();
    return reviews.filter(
      r => r.user_name.toLowerCase().includes(q)
    );
  }, [search, reviews]);

  const viewReview = (review: Review) => {
    setSelectedReview(review);
    setOpenViewDialog(true);
  };

  const updateStatus = (id: number, status: string) => {
    router.put(
      `/superadmin/reviews/${id}/status`,
      { status },
      {
        preserveScroll: true,
        onSuccess: () => {
          router.reload({ only: ['reviews'] });
        },
      }
    );
  };

  const deleteReview = (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    router.delete(`/superadmin/reviews/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['reviews'] });
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Card className="p-6 rounded-none">
        <h1 className="text-2xl font-bold mb-4">Client Reviews</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Client Name</th>
                <th className="px-4 py-2 text-left font-semibold">Email</th>
                <th className="px-4 py-2 text-left font-semibold">Submitted</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, idx) => (
                  <tr key={review.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{review.user_name}</td>
                    <td className="px-4 py-2">{review.submitted_at}</td>
                    <td className="px-4 py-2">{getStatusBadge(review.status)}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => viewReview(review)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <select
                          className="border rounded px-2 py-1 text-xs"
                          value={review.status}
                          onChange={(e) => updateStatus(review.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <Button size="sm" variant="destructive" onClick={() => deleteReview(review.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Review Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Review Details - {selectedReview?.user_name}
            </DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6 mt-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-600">Client Name</p>
                  <p className="text-base">{selectedReview.user_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted</p>
                  <p className="text-base">{selectedReview.submitted_at}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-base">{getStatusBadge(selectedReview.status)}</p>
                </div>
              </div>

              <hr />

              {/* Yes/No Questions */}
              <div>
                <h3 className="font-semibold mb-3">Yes/No Questions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="p-3 border rounded">
                      <p className="text-sm font-medium">Question {n}</p>
                      <p className="text-lg font-semibold capitalize">
                        {selectedReview[`q${n}` as keyof Review]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="font-semibold mb-3">Ratings (1-5)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[5, 6].map((n) => (
                    <div key={n} className="p-3 border rounded">
                      <p className="text-sm font-medium">Rating {n - 4}</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {selectedReview[`q${n}` as keyof Review]} / 5
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essay Answers */}
              <div>
                <h3 className="font-semibold mb-3">Essay Responses</h3>
                <div className="space-y-4">
                  {[7, 8, 9, 10].map((n) => (
                    <div key={n} className="p-4 border rounded bg-gray-50">
                      <p className="text-sm font-medium mb-2">Question {n}</p>
                      <p className="text-base whitespace-pre-wrap">
                        {selectedReview[`q${n}` as keyof Review]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}