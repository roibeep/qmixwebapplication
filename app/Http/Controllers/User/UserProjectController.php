<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use Inertia\Inertia;

class UserProjectController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $projectsQuery = Project::with('customer')
            ->where('customerID', auth()->id())
            ->orderBy('projectID');

        if(!empty($search)) {
            $projectsQuery->where('name', 'like', "%{$search}%");
        }

        $projects = $projectQuery->get();

        return Inertia::render('User/Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'project_location' => 'required|string|max:255',
            'end_location' => 'nullable|string|max:255',
            'design_mix' => 'nullable|string|max:255'
        ]);

        $data['customerID'] = auth()->id();

        Project::create($data);

        return redirect()->back()->with('success', 'Project added successfully.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'project_location' => 'required|string|max:255',
            'end_location' => 'nullable|string|max:255',
            'design_mix' => 'nullable|string|max:255',
        ]);

        $project = Project::where('customerID', auth()->id())->findOrFail($id);

        $project->update($data);

        return redirect()->back()->with('success', 'Project updated successfully.');
    }

    public function destroy($id)
    {
        $project = Project::where('customerID', auth()->id())->findOrFail($id);

        $project->delete();

        return redirect()->back()->with('success', 'Project deleted successfully.');
    }

    public function showByProjectPage($projectID)
    {
        $project = Project::with('deliveries')
            ->where('customerID', auth()->id())
            ->findOrFail($projectID);

        return Inertia::render('User/Project/ProjectDeliveries', [
            'project' => $project,
            'deliveries' => $project->deliveries,
            'auth' => ['user' => auth()->user()],
        ]);
    }
}
