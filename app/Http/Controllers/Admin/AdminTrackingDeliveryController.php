<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrackingDelivery;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTrackingDeliveryController extends Controller
{
    // JSON endpoint for deliveries of a project
    public function getByProject($projectID)
    {
        $deliveries = TrackingDelivery::where('projectID', $projectID)
            ->orderBy('created_at') // important: order by creation
            ->get();

        // Calculate running overall_volume
        $runningTotal = 0;
        $deliveries->transform(function ($d) use (&$runningTotal) {
            $runningTotal += $d->volume;
            $d->overall_volume = $runningTotal;
            return $d;
        });

        return response()->json($deliveries);
    }
}
