<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user')
            ->latest('submitted_at')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user_name' => $review->user->name,
                    'q1' => $review->q1,
                    'q2' => $review->q2,
                    'q3' => $review->q3,
                    'q4' => $review->q4,
                    'q5' => $review->q5,
                    'q6' => $review->q6,
                    'q7' => $review->q7,
                    'q8' => $review->q8,
                    'q9' => $review->q9,
                    'q10' => $review->q10,
                    'status' => $review->status,
                    'submitted_at' => $review->submitted_at?->format('M d, Y h:i A'),
                ];
            });
        
        return Inertia::render('SuperAdmin/Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    public function show($id)
    {
        $review = Review::with('user')->findOrFail($id);
        
        return response()->json([
            'id' => $review->id,
            'user_name' => $review->user->name,
            'q2' => $review->q2,
            'q3' => $review->q3,
            'q4' => $review->q4,
            'q5' => $review->q5,
            'q6' => $review->q6,
            'q7' => $review->q7,
            'q8' => $review->q8,
            'q9' => $review->q9,
            'q10' => $review->q10,
            'status' => $review->status,
            'submitted_at' => $review->submitted_at?->format('M d, Y h:i A'),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // Added: actually update the review
        $review = Review::findOrFail($id);
        $review->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Review status updated!');
    }

    public function destroy($id)
    {
        // Added: missing destroy method
        $review = Review::findOrFail($id);
        $review->delete();

        return redirect()->back()->with('success', 'Review deleted!');
    }
}