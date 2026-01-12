<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {

        $user = Auth::user();
        
        Auth::guard('web')->logout();
        
        $request->session()->invalidate();
        
        $request->session()->regenerateToken();
        
        Session::flush();
        
        \Log::info('User logged out', ['user_id' => $user?->id, 'email' => $user?->email]);
        
        return redirect('/login')->with('message', 'Logged out successfully');
    }
}