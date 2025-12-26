<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientReviewController extends Controller
{
    public function index()
    {
        return Inertia::render('Client/Reviews/Index');
    }

    public function create()
    {
        return Inertia::render('Client/Reviews/Index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'q1' => 'required|in:yes,no',
            'q2' => 'required|in:yes,no',
            'q3' => 'required|in:yes,no',
            'q4' => 'required|in:yes,no',
            'q5' => 'required|integer|min:1|max:5',
            'q6' => 'required|integer|min:1|max:5',
            'q7' => 'required|string',
            'q8' => 'required|string',
            'q9' => 'required|string',
            'q10' => 'required|string',
        ]);

        Review::create([
            'user_id' => Auth::id(),
            'status' => 'pending',
            'submitted_at' => now(),
            ...$validated, // Spread operator to include all validated fields
        ]);

        return redirect()->back()->with('success', 'Review submitted successfully!');
    }
}