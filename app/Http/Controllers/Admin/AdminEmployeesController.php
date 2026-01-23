<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminEmployeesController extends Controller
{
    public function index()
    {
        $employees = Employee::orderBy('pk_employee_id')->get();

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
        ]);
    }
}
