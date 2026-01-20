<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Customer;
use App\Models\ItemDesign;
use App\Models\TrackingDelivery;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    // List all transactions
    public function index()
    {
        return Inertia::render('SuperAdmin/Transactions/Index', [
            'transactions' => Transaction::with(['customer', 'item', 'deliveries.equipment'])->get(),
            'customers' => Customer::all(),
            'items' => ItemDesign::all(),
            'equipment' => Equipment::all(),
        ]);
    }

    // Store new transaction
    public function store(Request $request)
    {
        $validated = $request->validate([
            'so_no' => 'required|string|unique:transactions,so_no',
            'total_delivery' => 'required|numeric|min:0',
            'fk_customer_id' => 'required|exists:customers,pk_customer_id',
            'fk_item_id' => 'nullable|exists:items,pk_item_id',
            'schedule_date' => 'nullable|date',
            'schedule_time' => 'nullable',
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
            'fk_item_id' => 'nullable|exists:items,pk_item_id',
            'schedule_date' => 'nullable|date',
            'schedule_time' => 'nullable',
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

    // Show deliveries for a transaction
    public function deliveries($transactionId)
    {
        $transaction = Transaction::with(['deliveries.equipment', 'customer', 'item'])
            ->findOrFail($transactionId);

        return Inertia::render('SuperAdmin/Transactions/Deliveries', [
            'transaction' => $transaction,
            'deliveries' => $transaction->deliveries,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}