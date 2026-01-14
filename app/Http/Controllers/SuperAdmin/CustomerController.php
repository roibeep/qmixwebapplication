<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::orderBy('pk_customer_id')->get();

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
            'email'           => 'required|email|unique:customers,email',
            'password'        => 'required|min:6',
        ]);

        Customer::create([
            'customer_name'  => $validated['customer_name'],
            'contact_person' => $validated['contact_person'],
            'contact_number' => $validated['contact_number'],
            'address'        => $validated['address'],
            'email'          => $validated['email'],
            'password'       => Hash::make($validated['password']),
            'role'           => 'client',
        ]);

        return redirect()
            ->route('superadmin.customer.index')
            ->with('success', 'Customer added successfully!');
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'customer_name'  => $validated['customer_name'],
            'contact_person' => $validated['contact_person'],
            'contact_number' => $validated['contact_number'],
            'address'        => $validated['address'],
            'email'          => $validated['email'],
            'password'       => Hash::make($validated['password']),
            'role'           => 'client',
        ]);

        $updateData = [
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
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return redirect()
            ->route('superadmin.customer.index')
            ->with('success', 'Customer deleted successfully!');
    }
}