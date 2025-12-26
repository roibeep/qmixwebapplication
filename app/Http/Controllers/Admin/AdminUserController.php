<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function indexAdmin()
    {
        $users = User::with('department')->get();
        $departments = Department::all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'departments' => $departments,
        ]);
    }
}
