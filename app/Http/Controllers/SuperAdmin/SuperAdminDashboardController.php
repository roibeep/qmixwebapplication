<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\TrackingDelivery;
use Inertia\Inertia;

class SuperAdminDashboardController extends Controller
{
    public function index()
    {
        // Summary statistics
        $stats = [
            'total_users' => User::count(),
            'total_departments' => Department::count(),
            'total_projects' => Project::count(),
            'total_deliveries' => TrackingDelivery::count(),
        ];

        $users = User::with('department')->get()->map(function ($user) {

            // Count transactions per customer
            $transactionsCount = Transaction::where('fk_customer_id', $user->id)->count();

            // Count deliveries via transactions
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
                'projects_count' => $transactionsCount, // rename if needed
                'deliveries_count' => $deliveriesCount,
            ];
        });

        return Inertia::render('SuperAdmin/Dashboard/Index', [
            'stats' => $stats,
            'users' => $users,
        ]);
    }
}
