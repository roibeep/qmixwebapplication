<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminUserController extends Controller
{
    public function indexAdmin(Request $request)
    {
        $admin = Auth::user();
        $adminDepartmentID = $admin->departmentID;

        $search = $request->input('search');

        // Only get users from admin's department
        $usersQuery = User::with('department')
            ->where('departmentID', $adminDepartmentID)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('role', 'like', "%{$search}%")
                      ->orWhereHas('department', function ($dq) use ($search) {
                          $dq->where('name', 'like', "%{$search}%");
                      });
                });
            });

        $users = $usersQuery->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $user->department ? [
                    'departmentID' => $user->department->departmentID,
                    'name' => $user->department->name,
                ] : null,
            ];
        });

        // Only show admin's department
        $departments = Department::where('departmentID', $adminDepartmentID)
            ->get()
            ->map(function($dept) {
                return [
                    'departmentID' => $dept->departmentID,
                    'name' => $dept->name,
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $admin = Auth::user();
        $adminDepartmentID = $admin->departmentID;

        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users',
            'role'         => 'required|string',
            'password'     => 'required|min:6',
        ]);

        // Force the new user to be in admin's department
        $validated['departmentID'] = $adminDepartmentID;
        $validated['password'] = bcrypt($validated['password']);

        User::create($validated);

        return redirect()->back()->with('success', 'User added successfully');
    }

    public function update(Request $request, $id)
    {
        $admin = Auth::user();
        $adminDepartmentID = $admin->departmentID;

        $user = User::findOrFail($id);

        // Check if user belongs to admin's department
        if ($user->departmentID !== $adminDepartmentID) {
            abort(403, 'Unauthorized - User not in your department');
        }

        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email,' . $user->id,
            'role'         => 'required|string',
            'password'     => 'nullable|min:6',
        ]);

        // Keep user in the same department
        $validated['departmentID'] = $adminDepartmentID;
        $validated['password'] = $request->filled('password') 
            ? bcrypt($request->password) 
            : $user->password;

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function destroy($id)
    {
        $admin = Auth::user();
        $adminDepartmentID = $admin->departmentID;

        $user = User::findOrFail($id);

        // Check if user belongs to admin's department
        if ($user->departmentID !== $adminDepartmentID) {
            abort(403, 'Unauthorized - User not in your department');
        }

        // Prevent admin from deleting superadmin
        if ($user->role === 'superadmin') {
            abort(403, 'Cannot delete superadmin');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function show($id)
    {
        $admin = Auth::user();
        $adminDepartmentID = $admin->departmentID;

        $user = User::where('id', $id)
            ->where('departmentID', $adminDepartmentID)
            ->firstOrFail();

        return response()->json($user, 200);
    }
}