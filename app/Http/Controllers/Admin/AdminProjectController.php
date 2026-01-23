<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Equipment;
use App\Models\TrackingDelivery;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminProjectController extends Controller
{
    public function index()
    {
        // Get ALL transactions with relationships
        $transactions = Transaction::with(['customer', 'item', 'deliveries.equipment'])
            ->orderBy('date_created')
            ->get();
        
        $equipment = Equipment::all();

        return Inertia::render('Admin/Projects/Index', [
            'transactions' => $transactions,
            'equipment' => $equipment,
        ]);
    }
}
