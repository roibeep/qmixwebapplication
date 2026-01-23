<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        // Get only users with role 'client'
        $customers = User::where('role', 'client')
            ->orderBy('id')
            ->get();

        return Inertia::render('SuperAdmin/Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'   => 'required|string|max:255',
            'contact_person'  => 'required|string|max:255',
            'contact_number'  => 'required|string|max:50',
            'address'         => 'required|string',
            'email'           => 'required|email|unique:users,email',
            'password'        => 'required|min:6',
        ]);

        User::create([
            'name'           => $validated['customer_name'], // Use 'name' for User model
            'customer_name'  => $validated['customer_name'],
            'contact_person' => $validated['contact_person'],
            'contact_number' => $validated['contact_number'],
            'address'        => $validated['address'],
            'email'          => $validated['email'],
            'password'       => Hash::make($validated['password']),
            'role'           => 'client',
            'departmentID'   => null, // Clients don't have departments
        ]);

        return redirect()
            ->route('superadmin.customer.index')
            ->with('success', 'Customer added successfully!');
    }

    public function update(Request $request, $id)
    {
        // Find user with role 'client'
        $customer = User::where('role', 'client')->findOrFail($id);

        $validated = $request->validate([
            'customer_name'  => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_number' => 'required|string|max:50',
            'address'        => 'required|string',
            'email'          => 'required|email|unique:users,email,' . $id,
            'password'       => 'nullable|min:6',
        ]);

        $updateData = [
            'name'           => $validated['customer_name'],
            'customer_name'  => $validated['customer_name'],
            'contact_person' => $validated['contact_person'],
            'contact_number' => $validated['contact_number'],
            'address'        => $validated['address'],
            'email'          => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $customer->update($updateData);

        return redirect()
            ->route('superadmin.customer.index')
            ->with('success', 'Customer updated successfully!');
    }

    public function destroy($id)
    {
        // Find user with role 'client'
        $customer = User::where('role', 'client')->findOrFail($id);
        $customer->delete();

        return redirect()
            ->route('superadmin.customer.index')
            ->with('success', 'Customer deleted successfully!');
    }
}