<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SuperAdminProjectController extends Controller
{
    public function index(Request $request)
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

        return Inertia::render('SuperAdmin/Projects/Index', [
            'projects' => $projects,
            'clients' => $clients,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'customerID'       => 'required|exists:users,id',
            'project_location' => 'required|string|max:255',
            'end_location'     => 'nullable|string|max:255',
            'design_mix'       => 'nullable|string|max:255',
        ]);

        Project::create($data);

        return redirect()->back()->with('success', 'Project added successfully.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'customerID' => 'required|exists:users,id',
            'project_location' => 'required|string|max:255',
            'end_location' => 'nullable|string|max:255',
            'design_mix' => 'nullable|string|max:255',
        ]);

        $project = Project::findOrFail($id);
        $project->update($data);

        return redirect()->back()->with('success', 'Project updated successfully.');
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()->back()->with('success', 'Project deleted successfully.');
    }

    public function showByProjectPage($projectID)
    {
        $project = Project::with('customer', 'deliveries')->findOrFail($projectID);

        return Inertia::render('SuperAdmin/Project/ProjectDeliveries', [
            'project' => $project,
            'deliveries' => $project->deliveries,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
    
}