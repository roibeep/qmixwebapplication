<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Equipment;
use App\Models\TrackingDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientProjectController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get ALL transactions (same as superadmin), but we'll filter in the component
        $transactions = Transaction::with(['customer', 'item', 'deliveries.equipment'])
            ->orderBy('date_created')
            ->get();
        
        $equipment = Equipment::all();

        return Inertia::render('Client/Projects/Index', [
            'transactions' => $transactions, // Pass all transactions
            'equipment' => $equipment,
        ]);
    }

    public function markDelivered($deliveryId)
    {
        try {
            $delivery = TrackingDelivery::findOrFail($deliveryId);
            
            // Verify this delivery belongs to the current client
            $transaction = Transaction::where('pk_transac_id', $delivery->fk_transac_id)
                ->where('fk_customer_id', Auth::id())
                ->firstOrFail();
            
            // Update delivery status
            $delivery->update([
                'delivery_status' => 'Delivered'
            ]);

            return redirect()->back()->with('success', 'Delivery marked as delivered!');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update delivery status.');
        }
    }

    public function markOutForDelivery($deliveryId)
    {
        try {
            $delivery = TrackingDelivery::findOrFail($deliveryId);
            
            // Verify this delivery belongs to the current client
            $transaction = Transaction::where('pk_transac_id', $delivery->fk_transac_id)
                ->where('fk_customer_id', Auth::id())
                ->firstOrFail();
            
            // Update delivery status back to Out for Delivery
            $delivery->update([
                'delivery_status' => 'Out for Delivery'
            ]);

            return redirect()->back()->with('success', 'Delivery status updated to Out for Delivery!');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update delivery status.');
        }
    }
}