<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ItemDesign;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemDesignController extends Controller
{
    // List all items
    public function index()
    {
        $items = ItemDesign::orderBy('pk_item_id', 'desc')->get();

        return Inertia::render('SuperAdmin/ItemDesign/Index', [
            'items' => $items,
        ]);
    }

    // Store new item
    public function store(Request $request)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
        ]);

        ItemDesign::create([
            'item_name' => $request->item_name,
        ]);

        return redirect()->route('superadmin.itemdesign.index')
            ->with('success', 'Item added successfully!');
    }

    // Show single item
    public function show($id)
    {
        $item = ItemDesign::findOrFail($id);
        return response()->json($item);
    }

    // Update item
    public function update(Request $request, $id)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
        ]);

        $item = ItemDesign::findOrFail($id);
        $item->update($request->only('item_name'));

        return redirect()->route('superadmin.itemdesign.index')
            ->with('success', 'Item updated successfully!');
    }

    // Delete item
    public function destroy($id)
    {
        $item = ItemDesign::findOrFail($id);
        $item->delete();

        return redirect()->route('superadmin.itemdesign.index')
            ->with('success', 'Item deleted successfully!');
    }
}
