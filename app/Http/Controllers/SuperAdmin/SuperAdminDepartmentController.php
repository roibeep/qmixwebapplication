<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminDepartmentController extends Controller
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

    // Create new department
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Department::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Use the same route name you defined for index
        return redirect()->route('superadmin.department')->with('success', 'Department added successfully!');
    }

    // Show single department
    public function show($id)
    {
        $department = Department::findOrFail($id);
        return response()->json($department, 200);
    }

    // Update department
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $department = Department::findOrFail($id);
        $department->update($request->only('name', 'description'));

        return redirect()->route('superadmin.department')->with('success', 'Department updated successfully!');
    }

    // Delete department
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return redirect()->route('superadmin.department')->with('success', 'Department deleted successfully!');
    }
}
