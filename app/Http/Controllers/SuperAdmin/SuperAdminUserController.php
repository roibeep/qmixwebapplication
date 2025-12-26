<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminUserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $usersQuery = User::with('department')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('role', 'like', "%{$search}%")
                      ->orWhereHas('department', function ($dq) use ($search) {
                          $dq->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy('name');

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

        $departments = Department::all()->map(function($dept) {
            return [
                'departmentID' => $dept->departmentID,
                'name' => $dept->name,
            ];
        });

        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => $users,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users',
            'role'         => 'required|string',
            'departmentID' => 'nullable|exists:departments,departmentID',
            'password'     => 'required|min:6',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        User::create($validated);

        return redirect()->back()->with('success', 'User added successfully');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email,' . $user->id,
            'role'         => 'required|string',
            'departmentID' => 'nullable|exists:departments,departmentID',
            'password'     => 'nullable|min:6',
        ]);

        $validated['password'] = $request->filled('password') 
            ? bcrypt($request->password) 
            : $user->password;

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (auth()->user()->role === 'admin' && $user->role === 'superadmin') {
            abort(403, 'Unauthorized');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }
}
