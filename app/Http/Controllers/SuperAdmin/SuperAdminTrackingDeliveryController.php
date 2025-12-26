<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\TrackingDelivery;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminTrackingDeliveryController extends Controller
{
    public function index()
    {
        return Inertia::render('SuperAdmin/TrackingDelivery/Index', [
            'deliveries' => TrackingDelivery::with('project.customer')
                ->orderBy('deliveryID', 'asc')
                ->get(),

            'projects' => Project::with('customer')->get(),
        ]);
    }
    public function getByProject($projectID)
    {
        return TrackingDelivery::where('projectID', $projectID)
            ->orderBy('deliveryID', 'asc')
            ->get();
    }

    public function store(Request $request, $projectID)
    {
        $data = $request->validate([
            'mp_no' => 'required|string|max:255',
            'truck_no' => 'required|string|max:255',
            'volume' => 'required|numeric',
            'delivery_status' => 'required|string',
        ]);

        $data['projectID'] = $projectID;

        TrackingDelivery::create($data);

        return redirect()->back()->with('success', 'Delivery added successfully.');
        
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'mp_no' => 'required|string|max:255',
            'truck_no' => 'required|string|max:255',
            'volume' => 'required|numeric',
            'delivery_status' => 'required|string',
            'projectID' => 'nullable|exists:projects,projectID',
        ]);

        $delivery = TrackingDelivery::findOrFail($id);
        $delivery->update($data);

        return redirect()->back()->with('success', 'Delivery updated successfully.');
    }

    public function destroy($id)
    {
        TrackingDelivery::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Delivery deleted successfully.');
    }

    public function storeGlobal(Request $request)
    {
        $data = $request->validate([
            'mp_no' => 'required|string|max:255',
            'truck_no' => 'required|string|max:255',
            'volume' => 'required|numeric',
            'delivery_status' => 'required|string',
            'projectID' => 'required|exists:projects,projectID',
        ]);

        TrackingDelivery::create($data);

        return redirect()->back()->with('success', 'Delivery added successfully.');
    }
}
