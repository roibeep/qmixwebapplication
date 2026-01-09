<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\SuperAdmin\SuperAdminDepartmentController;
use App\Http\Controllers\SuperAdmin\SuperAdminUserController;
use App\Http\Controllers\SuperAdmin\SuperAdminProjectController;
use App\Http\Controllers\SuperAdmin\SuperAdminTrackingDeliveryController;
use App\Http\Controllers\SuperAdmin\SuperAdminReviewController;
use App\Http\Controllers\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminTrackingDeliveryController;
use App\Http\Controllers\Admin\AdminDepartmentController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Client\ClientProjectController;
use App\Http\Controllers\Client\ClientReviewController;
use App\Http\Controllers\User\UserProjectController;
use App\Http\Controllers\User\UserTrackingDeliveryController;
use App\Http\Controllers\HomeController;
use App\Models\Department;

Route::get('/', function () {
    return response()->file(public_path('html/index.html'));
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'role:superadmin'])->prefix('superadmin')->group(function () {

    // Super Admin Departments
    Route::get('/department', function () {
        $departments = Department::all();
        return Inertia::render('SuperAdmin/Department/Index', [
            'departments' => $departments,
        ]);
    })->name('superadmin.department');

    Route::get('/department/list', [SuperAdminDepartmentController::class, 'index'])->name('superadmin.department.list'); // Fixed name
    Route::post('/department/store', [SuperAdminDepartmentController::class, 'store']);
    Route::get('/department/{id}', [SuperAdminDepartmentController::class, 'show']);
    Route::put('/department/{id}', [SuperAdminDepartmentController::class, 'update']);
    Route::delete('/department/{id}', [SuperAdminDepartmentController::class, 'destroy']);

    // Super Admin Users
    Route::get('/users', [SuperAdminUserController::class, 'index'])->name('superadmin.users');
    Route::get('/users/list', [SuperAdminUserController::class, 'list']);
    Route::post('/users/store', [SuperAdminUserController::class, 'store']);
    Route::get('/users/{id}', [SuperAdminUserController::class, 'show']);
    Route::put('/users/{id}', [SuperAdminUserController::class, 'update']);
    Route::delete('/users/{id}', [SuperAdminUserController::class, 'destroy']);
    
    // Super Admin Projects
    Route::get('/projects', [SuperAdminProjectController::class, 'index'])->name('superadmin.projects');
    Route::post('/projects/store', [SuperAdminProjectController::class, 'store']);
    Route::put('/projects/{id}', [SuperAdminProjectController::class, 'update']);
    Route::delete('/projects/{id}', [SuperAdminProjectController::class, 'destroy']);
    
    // Super Admin Deliveries
    Route::get('/projects/{projectID}/deliveries', [SuperAdminTrackingDeliveryController::class, 'getByProject'])
        ->name('superadmin.project.deliveries');
    Route::post('/projects/{projectID}/deliveries', [SuperAdminTrackingDeliveryController::class, 'store']);
    
    // Super Admin Tracking Deliveries
    Route::get('/trackingdelivery', [SuperAdminTrackingDeliveryController::class, 'index'])->name('superadmin.tracking');
    Route::get('/trackingdelivery/list', [SuperAdminTrackingDeliveryController::class, 'list']);
    Route::post('/trackingdelivery/store', [SuperAdminTrackingDeliveryController::class, 'store'])->name('superadmin.tracking.store');
    Route::get('/trackingdelivery/{id}', [SuperAdminTrackingDeliveryController::class, 'show'])->name('superadmin.tracking.show');
    Route::put('/trackingdelivery/{id}', [SuperAdminTrackingDeliveryController::class, 'update'])->name('superadmin.tracking.update');
    Route::delete('/trackingdelivery/{id}', [SuperAdminTrackingDeliveryController::class, 'destroy'])->name('superadmin.tracking.destroy');

    // Super Admin Reviews
    Route::get('/reviews', [SuperAdminReviewController::class, 'index'])->name('superadmin.reviews');
    Route::get('/reviews/{id}', [SuperAdminReviewController::class, 'show']);
    Route::put('/reviews/{id}/status', [SuperAdminReviewController::class, 'updateStatus']);
    Route::delete('/reviews/{id}', [SuperAdminReviewController::class, 'destroy']);

    // Super Admin Dashboard
    Route::get('/dashboard', [SuperAdminDashboardController::class, 'index'])
    ->name('superadmin.dashboard');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminUserController::class, 'indexAdmin'])->name('admin.users');
    Route::post('/users/store', [AdminUserController::class, 'store']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Admin Departments
    Route::get('/department', [AdminDepartmentController::class, 'indexAdmin'])->name('admin.department');

    // Admin Projects
    Route::get('/projects', [AdminProjectController::class, 'indexAdmin'])->name('admin.projects');
    Route::get('/projects/{projectID}/deliveries', [AdminTrackingDeliveryController::class, 'getByProject']);

});

Route::middleware(['auth', 'role:client'])->prefix('client')->name('client.')->group(function () {

    // Client Projects
    Route::get('/projects', [ClientProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{id}/deliveries', [ClientProjectController::class, 'deliveries'])->name('projects.deliveries');

    // Client Reviews
    Route::get('/reviews', [ClientReviewController::class, 'index'])->name('reviews.index');
    Route::get('/reviews/create', [ClientReviewController::class, 'create'])->name('reviews.create');
    Route::post('/reviews', [ClientReviewController::class, 'store'])->name('reviews.store');
    
});

Route::middleware(['auth', 'prd.user'])->prefix('user')->group(function () {
    // Projects
    Route::get('/projects', [UserProjectController::class, 'index'])->name('user.projects.index');
    Route::post('/projects/store', [UserProjectController::class, 'store'])->name('user.projects.store');
    Route::get('/projects/{id}', [UserProjectController::class, 'showByProjectPage'])->name('user.project.show');
    Route::put('/projects/{id}', [UserProjectController::class, 'update'])->name('user.projects.update');
    Route::delete('/projects/{id}', [UserProjectController::class, 'destroy'])->name('user.projects.destroy');
    
    // Tracking Deliveries
    Route::get('/projects/{projectID}/deliveries', [UserTrackingDeliveryController::class, 'getByProject']);
    Route::post('/projects/{projectID}/deliveries', [UserTrackingDeliveryController::class, 'store']);
    Route::put('/trackingdelivery/{id}', [UserTrackingDeliveryController::class, 'update']);
    Route::delete('/trackingdelivery/{id}', [UserTrackingDeliveryController::class, 'destroy']);
});



require __DIR__.'/settings.php';
