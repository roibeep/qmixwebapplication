<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\TrackingDelivery;
use Illuminate\Http\Request;

class UserTrackingDeliveryController extends Controller
{
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
}