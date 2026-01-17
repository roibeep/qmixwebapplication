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
    // Show deliveries for a transaction (Inertia page)
    public function index($transacId)
    {
        $transaction = Transaction::with(['deliveries.equipment', 'customer', 'equipment', 'item'])
            ->findOrFail($transacId);

        return Inertia::render('SuperAdmin/TrackingDeliveries/Index', [
            'transaction' => $transaction,
            'equipment' => Equipment::all(),
        ]);
    }

    // Store a new delivery
    public function store(Request $request, $transacId)
    {
        $transaction = Transaction::findOrFail($transacId);

        $validated = $request->validate([
            'mp_no' => 'required|string|max:255',
            'volume' => 'required|numeric|min:0',
            'fk_equipment_id' => 'required|exists:equipment,pk_equipment_id',
            'delivery_status' => 'required|string',
        ]);

        TrackingDelivery::create([
            ...$validated,
            'fk_transac_id' => $transacId,
            'overall_volume' => $validated['volume'], // adjust if cumulative
            'date_created' => now(),
        ]);

        return redirect()->route('superadmin.trackingdeliveries.index', $transacId)
            ->with('success', 'Delivery added successfully!');
    }

    // Update delivery
    public function update(Request $request, $id)
    {
        $delivery = TrackingDelivery::findOrFail($id);

        $validated = $request->validate([
            'mp_no' => 'required|string|max:255',
            'volume' => 'required|numeric|min:0',
            'fk_equipment_id' => 'required|exists:equipment,pk_equipment_id',
            'delivery_status' => 'required|string',
        ]);

        $delivery->update([...$validated, 'date_updated' => now()]);

        return redirect()->route('superadmin.trackingdeliveries.index', $delivery->fk_transac_id)
            ->with('success', 'Delivery updated successfully!');
    }

    // Delete delivery
    public function destroy($id)
    {
        $delivery = TrackingDelivery::findOrFail($id);
        $transactionId = $delivery->fk_transac_id;

        $delivery->delete();

        return redirect()->route('superadmin.trackingdeliveries.index', $transactionId)
            ->with('success', 'Delivery deleted successfully!');
    }
}
