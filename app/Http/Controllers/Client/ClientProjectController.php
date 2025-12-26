<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientProjectController extends Controller
{
    public function index()
    {
        $clientID = auth()->id();

        $projects = Project::where('customerID', $clientID)
            ->orderBy('projectID', 'asc')
            ->get();

        return Inertia::render('Client/Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function deliveries($id)
    {
        $clientID = auth()->id();

        $project = Project::where('projectID', $id)
            ->where('customerID', $clientID)
            ->firstOrFail();

        return response()->json($project->deliveries()->orderBy('deliveryID')->get());
    }
}
