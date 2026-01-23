<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index()
    {
        // Get only users with role 'client'
        $customers = User::where('role', 'client')
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
        ]);
    }
}
