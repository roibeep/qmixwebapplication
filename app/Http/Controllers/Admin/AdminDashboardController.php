<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Project;
use App\Models\TrackingDelivery;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Get summary statistics - ALL data (same as SuperAdmin)
        $stats = [
            'total_users' => User::count(),
            'total_departments' => Department::count(),
            'total_projects' => Project::count(),
            'total_deliveries' => TrackingDelivery::count(),
        ];

        // Get ALL users with their data (same as SuperAdmin)
        $users = User::with(['department'])
            ->get()
            ->map(function ($user) {
                $projectsCount = Project::where('customerID', $user->id)->count();
                $deliveriesCount = TrackingDelivery::whereHas('project', function ($query) use ($user) {
                    $query->where('customerID', $user->id);
                })->count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'department' => $user->department?->name ?? 'N/A',
                    'departmentID' => $user->departmentID,
                    'projects_count' => $projectsCount,
                    'deliveries_count' => $deliveriesCount,
                ];
            });

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => $stats,
            'users' => $users,
        ]);
    }
}