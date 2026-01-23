<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeesController extends Controller
{
    // Show Employees page
    public function index()
    {
        $employees = Employee::orderBy('pk_employee_id')->get();

        return Inertia::render('SuperAdmin/Employees/Index', [
            'employees' => $employees,
        ]);
    }

    // Store employee
    public function store(Request $request)
    {
        $request->validate([
            'employee_name' => 'required|string|max:255',
        ]);

        Employee::create([
            'employee_name' => $request->employee_name,
        ]);

        return redirect()
            ->route('superadmin.employees')
            ->with('success', 'Employee added successfully!');
    }

    // Get single employee
    public function show($id)
    {
        return response()->json(
            Employee::findOrFail($id)
        );
    }

    // Update employee
    public function update(Request $request, $id)
    {
        $request->validate([
            'employee_name' => 'required|string|max:255',
        ]);

        $employee = Employee::findOrFail($id);

        $employee->update([
            'employee_name' => $request->employee_name,
        ]);

        return redirect()
            ->route('superadmin.employees')
            ->with('success', 'Employee updated successfully!');
    }

    // Delete employee
    public function destroy($id)
    {
        Employee::findOrFail($id)->delete();

        return redirect()
            ->route('superadmin.employees')
            ->with('success', 'Employee deleted successfully!');
    }
}
