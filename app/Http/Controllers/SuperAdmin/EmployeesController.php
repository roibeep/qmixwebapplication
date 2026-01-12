<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Employees;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeesController extends Controller
{
    public function index()
    {
        $employees = Employee::orderBy('pk_employee_id', 'desc')->get();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_name' => 'required|string|max:255',
        ]);

        Employee::create([
            'employee_name' => $request->employee_name,
        ]);

        return redirect()
            ->route('employees.index')
            ->with('success', 'Employee added successfully!');
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);

        return response()->json($employee, 200);
    }

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
            ->route('employees.index')
            ->with('success', 'Employee updated successfully!');
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return redirect()
            ->route('employees.index')
            ->with('success', 'Employee deleted successfully!');
    }
}
