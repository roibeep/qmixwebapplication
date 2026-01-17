<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Customer;
use App\Models\Equipment;
use App\Models\ItemDesign;
use App\Models\TrackingDelivery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    // List all transactions
    public function index()
    {
        return Inertia::render('SuperAdmin/Transactions/Index', [
            'transactions' => Transaction::with(['customer', 'equipment', 'item', 'deliveries.equipment'])->get(),
            'customers' => Customer::all(),
            'equipment' => Equipment::all(),
            'items' => ItemDesign::all(),
        ]);
    }

    // Store new transaction
    public function store(Request $request)
    {
        $validated = $request->validate([
            'so_no' => 'required|string|unique:transactions,so_no',
            'total_delivery' => 'required|numeric|min:0',
            'fk_customer_id' => 'required|exists:customers,pk_customer_id',
            'fk_equipment_id' => 'nullable|exists:equipment,pk_equipment_id',
            'fk_item_id' => 'nullable|exists:items,pk_item_id',
        ]);

        Transaction::create([
            ...$validated,
            'date_created' => now(),
        ]);

        return redirect()->route('transactions.index')->with('success', 'Transaction added successfully!');
    }

    // Update transaction
    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'so_no' => 'required|string|unique:transactions,so_no,' . $transaction->pk_transac_id . ',pk_transac_id',
            'total_delivery' => 'required|numeric|min:0',
            'fk_customer_id' => 'required|exists:customers,pk_customer_id',
            'fk_equipment_id' => 'nullable|exists:equipment,pk_equipment_id',
            'fk_item_id' => 'nullable|exists:items,pk_item_id',
        ]);

        $transaction->update([...$validated, 'date_updated' => now()]);

        return redirect()->route('transactions.index')->with('success', 'Transaction updated successfully!');
    }

    // Delete transaction
    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully!');
    }

    // Show deliveries for a transaction (Inertia page)
    public function deliveries($transactionId)
    {
        $transaction = Transaction::with(['deliveries.equipment', 'customer', 'equipment', 'item'])
            ->findOrFail($transactionId);

        return Inertia::render('SuperAdmin/Transactions/Deliveries', [
            'transaction' => $transaction,
            'deliveries' => $transaction->deliveries,
            'equipment' => Equipment::all(),
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
