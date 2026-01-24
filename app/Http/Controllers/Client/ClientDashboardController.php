<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ClientDashboardController extends Controller
{
     public function index()
    {
        return Inertia::render('Client/Dashboard/Index', [
            'user' => auth()->user()->load('department'),
        ]);
    }
}
