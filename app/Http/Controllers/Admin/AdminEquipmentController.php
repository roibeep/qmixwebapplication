<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminEquipmentController extends Controller
{
    public function index()
    {
        $equipment = Equipment::with('employee')
            ->orderBy('pk_equipment_id')
            ->get();

        $employees = Employee::all();

        return Inertia::render('Admin/Equipment/Index', [
            'equipment' => $equipment,
            'employees' => $employees,
        ]);
    }
}
