<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\TrackingDelivery;
use App\Models\Transaction;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminTrackingDeliveryController extends Controller
{
    // Store a new delivery
    public function store(Request $request, $transactionId)
    {
        $transaction = Transaction::findOrFail($transactionId);

        $validated = $request->validate([
            'mp_no' => 'required|string|max:255',
            'volume' => 'required|numeric|min:0',
            'fk_equipment_id' => 'required|exists:equipment,pk_equipment_id',
            'delivery_status' => 'required|string',
            'schedule_date' => 'nullable|date',
            'schedule_time' => 'nullable|string',
        ]);

        TrackingDelivery::create([
            ...$validated,
            'fk_transac_id' => $transactionId,
            'overall_volume' => $validated['volume'],
            'date_created' => now(),
        ]);

        return redirect()->route('transactions.index')
            ->with('success', 'Delivery added successfully!');
    }

    // Update delivery
    public function update(Request $request, $transactionId, $id)
    {
        $delivery = TrackingDelivery::findOrFail($id);

        $validated = $request->validate([
            'mp_no' => 'required|string|max:255',
            'volume' => 'required|numeric|min:0',
            'fk_equipment_id' => 'required|exists:equipment,pk_equipment_id',
            'delivery_status' => 'required|string',
            'schedule_date' => 'nullable|date',
            'schedule_time' => 'nullable|string',
        ]);

        $delivery->update([...$validated, 'date_updated' => now()]);

        return redirect()->route('transactions.index')
            ->with('success', 'Delivery updated successfully!');
    }

    // Delete delivery
    public function destroy($transactionId, $id)
    {
        $delivery = TrackingDelivery::findOrFail($id);
        $delivery->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Delivery deleted successfully!');
    }

    // Update truck/equipment for a delivery
    public function updateTruck(Request $request, $delivery)
    {
        $deliveryModel = TrackingDelivery::findOrFail($delivery);
        
        $validated = $request->validate([
            'fk_equipment_id' => 'required|exists:equipment,pk_equipment_id',
        ]);

        $deliveryModel->update([
            'fk_equipment_id' => $validated['fk_equipment_id'],
            'date_updated' => now(),
        ]);

        return redirect()->route('transactions.index')
            ->with('success', 'Truck updated successfully!');
    }
}