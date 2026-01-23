<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Transaction;
use App\Models\TrackingDelivery;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Get summary statistics
        $stats = [
            'total_users' => User::count(),
            'total_departments' => Department::count(),
            'total_clients' => User::where('role', 'client')->count(),
            'total_transactions' => Transaction::count(),
            'total_deliveries' => TrackingDelivery::count(),
        ];

        // Get ALL users with their data
        $users = User::with(['department'])
            ->get()
            ->map(function ($user) {
                // Count transactions for this user (if they're a client)
                $transactionsCount = Transaction::where('fk_customer_id', $user->id)->count();
                
                // Count deliveries for this user's transactions
                $deliveriesCount = TrackingDelivery::whereHas('transaction', function ($query) use ($user) {
                    $query->where('fk_customer_id', $user->id);
                })->count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'department' => $user->department?->name ?? 'N/A',
                    'departmentID' => $user->departmentID,
                    'customer_name' => $user->customer_name ?? null,
                    'contact_person' => $user->contact_person ?? null,
                    'contact_number' => $user->contact_number ?? null,
                    'address' => $user->address ?? null,
                    'transactions_count' => $transactionsCount,
                    'deliveries_count' => $deliveriesCount,
                ];
            });

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => $stats,
            'users' => $users,
        ]);
    }
}