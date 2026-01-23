<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ItemDesign;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminItemDesignController extends Controller
{
    public function index()
    {
        $items = ItemDesign::orderBy('pk_item_id')->get();

        return Inertia::render('Admin/ItemDesign/Index', [
            'items' => $items,
        ]);
    }
}
