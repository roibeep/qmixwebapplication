<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect('/login');
        }

        // Get fresh user data from database
        $user = Auth::user()->fresh();
        
        // Log for debugging
        Log::info('RoleMiddleware Check', [
            'expected_role' => $role,
            'actual_role' => $user->role,
            'user_id' => $user->id,
        ]);

        // Check if user has the required role
        if ($user->role !== $role) {
            Log::warning('Role mismatch - 403', [
                'user' => $user->email,
                'expected' => $role,
                'actual' => $user->role,
            ]);
            
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}