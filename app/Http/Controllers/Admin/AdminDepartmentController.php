<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDepartmentController extends Controller
{
    // Get all departments
    public function index()
    {
        $departments = Department::all();

        return Inertia::render('SuperAdmin/Department/Index', [
            'departments' => $departments,
        ]);
    }

    public function indexAdmin()
    {
        $departments = Department::all();

        return Inertia::render('Admin/Department/Index', [
            'departments' => $departments,
        ]);
    }
}
