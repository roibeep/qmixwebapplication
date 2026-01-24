<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return match($user->role) {
            'superadmin' => redirect('/superadmin/dashboard'),
            'admin' => redirect('/admin/dashboard'),  // Changed to existing route
            'client' => redirect('/client/dashboard'), // Changed to existing route
            'user' => redirect('/user/dashboard'),     // Changed to existing route
            default => redirect('/dashboard'),
        };
    }
}