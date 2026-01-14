<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    // List all equipment
    public function index()
    {
        $equipment = Equipment::with('employee')
            ->orderBy('pk_equipment_id', 'desc')
            ->get();

        $employees = Employee::all();

        return Inertia::render('SuperAdmin/Equipment/Index', [
            'equipment' => $equipment,
            'employees' => $employees,
        ]);
    }

    // Store new equipment
    public function store(Request $request)
    {
        $request->validate([
            'equipment_name' => 'required|string|max:255',
            'fk_employee_id' => 'required|exists:employees,pk_employee_id',
        ]);

        Equipment::create([
            'equipment_name' => $request->equipment_name,
            'fk_employee_id' => $request->fk_employee_id,
        ]);

        return redirect()->route('superadmin.equipment.index')
            ->with('success', 'Equipment added successfully!');
    }

    // Show single equipment
    public function show($id)
    {
        $equipment = Equipment::with('employee')->findOrFail($id);
        return response()->json($equipment);
    }

    // Update equipment
    public function update(Request $request, $id)
    {
        $request->validate([
            'equipment_name' => 'required|string|max:255',
            'fk_employee_id' => 'required|exists:employees,pk_employee_id',
        ]);

        $equipment = Equipment::findOrFail($id);
        $equipment->update($request->only('equipment_name', 'fk_employee_id'));

        return redirect()->route('superadmin.equipment.index')
            ->with('success', 'Equipment updated successfully!');
    }

    // Delete equipment
    public function destroy($id)
    {
        $equipment = Equipment::findOrFail($id);
        $equipment->delete();

        return redirect()->route('superadmin.equipment.index')
            ->with('success', 'Equipment deleted successfully!');
    }
}
