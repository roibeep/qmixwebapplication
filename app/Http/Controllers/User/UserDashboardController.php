<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Dashboard/Index', [
            'user' => auth()->user()->load('department'),
        ]);
    }
}