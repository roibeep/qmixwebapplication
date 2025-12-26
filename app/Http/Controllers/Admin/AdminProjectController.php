<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminProjectController extends Controller
{
    public function indexAdmin(Request $request)
    {
        $search = $request->input('search');

        $projectsQuery = Project::with('customer')->orderBy('projectID');

        if (!empty($search)) {
            $projectsQuery->where('name', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
        }

        $projects = $projectsQuery->get();

        $clients = User::where('role', 'client')->get();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'clients' => $clients,
            'filters' => $request->only('search')
        ]);
    }
}
