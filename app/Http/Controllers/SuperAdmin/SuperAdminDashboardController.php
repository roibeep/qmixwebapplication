<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\Projects;
use App\Models\TrackingDelivary;
use Illuminate\Http\Request;

class SuperAdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_department' => Department::count(),
            'total_projects' => Project::count(),
            'total_deliveries' => TrackingDelivery::count(),
        ];

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
        
            return Inertia::render('SuperAdmin/Dashboard/Index', [
                'stats' => $stats,
                'users' => $users,
            ]);
    }
}
