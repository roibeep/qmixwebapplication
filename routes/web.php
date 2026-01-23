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
use App\Http\Controllers\SuperAdmin\EmployeesController;
use App\Http\Controllers\SuperAdmin\EquipmentController;
use App\Http\Controllers\SuperAdmin\ItemDesignController;
use App\Http\Controllers\SuperAdmin\CustomerController;
use App\Http\Controllers\SuperAdmin\TransactionController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminTrackingDeliveryController;
use App\Http\Controllers\Admin\AdminDepartmentController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminEquipmentController;
use App\Http\Controllers\Admin\AdminEmployeesController;
use App\Http\Controllers\Admin\AdminItemDesignController;
use App\Http\Controllers\Admin\AdminCustomerController;
use App\Http\Controllers\Client\ClientProjectController;
use App\Http\Controllers\Client\ClientReviewController;
use App\Http\Controllers\User\UserProjectController;
use App\Http\Controllers\User\UserTrackingDeliveryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LogoutController;
use App\Models\Department;

Route::get('/', function () {
    return response()->file(public_path('html/index.html'));
})->name('home');

Route::get('/branch', function () {
    return response()->file(public_path('html/site.html'));
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
});

Route::post('/logout', LogoutController::class)
    ->middleware('auth')
    ->name('logout');

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
    //Route::get('/projects', [TransactionController::class, 'index'])->name('superadmin.projects');
    //Route::post('/projects/store', [TransactionController::class, 'store']);
    //Route::put('/projects/{id}', [TransactionController::class, 'update']);
    //Route::delete('/projects/{id}', [TransactionController::class, 'destroy']);

    // Super Admin Deliveries
    //Route::get('/projects/{projectID}/deliveries', [SuperAdminTrackingDeliveryController::class, 'getByProject'])
        //->name('superadmin.project.deliveries');
    //Route::post('/projects/{projectID}/deliveries', [SuperAdminTrackingDeliveryController::class, 'store']);

    /// Super Admin Transaction
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions/store', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    // Transaction Deliveries
    Route::post('/transactions/{id}/deliveries', [SuperAdminTrackingDeliveryController::class, 'store'])->name('superadmin.trackingdeliveries.store');
    Route::put('/transactions/{transactionId}/deliveries/{id}', [SuperAdminTrackingDeliveryController::class, 'update'])->name('superadmin.trackingdeliveries.update');
    Route::delete('/transactions/{transactionId}/deliveries/{id}', [SuperAdminTrackingDeliveryController::class, 'destroy'])->name('superadmin.trackingdeliveries.destroy');
    Route::put('/deliveries/{delivery}/update-truck', [SuperAdminTrackingDeliveryController::class, 'updateTruck'])->name('deliveries.updateTruck');

    // Super Admin Reviews
    Route::get('/reviews', [SuperAdminReviewController::class, 'index'])->name('superadmin.reviews');
    Route::get('/reviews/{id}', [SuperAdminReviewController::class, 'show']);
    Route::put('/reviews/{id}/status', [SuperAdminReviewController::class, 'updateStatus']);
    Route::delete('/reviews/{id}', [SuperAdminReviewController::class, 'destroy']);

    // Super Admin Dashboard
    Route::get('/dashboard', [SuperAdminDashboardController::class, 'index'])->name('superadmin.dashboard');

    //Super Admin Employees
    Route::get('/employees', [EmployeesController::class, 'index'])->name('superadmin.employees');
    Route::post('/employees/store', [EmployeesController::class, 'store'])->name('superadmin.employees.store');
    Route::get('/employees/{id}', [EmployeesController::class, 'show'])->name('superadmin.employees.show');
    Route::put('/employees/{id}', [EmployeesController::class, 'update'])->name('superadmin.employees.update');
    Route::delete('/employees/{id}', [EmployeesController::class, 'destroy'])->name('superadmin.employees.destroy');

    //Super Admin Equipment
    Route::get('/equipment', [EquipmentController::class, 'index'])->name('superadmin.equipment.index');
    Route::post('/equipment/store', [EquipmentController::class, 'store']);
    Route::get('/equipment/{id}', [EquipmentController::class, 'show']);
    Route::put('/equipment/{id}', [EquipmentController::class, 'update']);
    Route::delete('/equipment/{id}', [EquipmentController::class, 'destroy']);

    //Super Admin Item Design
    Route::get('/itemdesign', [ItemDesignController::class, 'index'])->name('superadmin.itemdesign.index');
    Route::post('/itemdesign/store', [ItemDesignController::class, 'store']);
    Route::get('/itemdesign/{id}', [ItemDesignController::class, 'show']);
    Route::put('/itemdesign/{id}', [ItemDesignController::class, 'update']);
    Route::delete('/itemdesign/{id}', [ItemDesignController::class, 'destroy']);

    //Super Admin Customer
    Route::get('/customers', [CustomerController::class, 'index'])->name('superadmin.customer.index');
    Route::post('/customers/store', [CustomerController::class, 'store'])->name('superadmin.customer.store');
    Route::put('/customers/{id}', [CustomerController::class, 'update'])->name('superadmin.customer.update');
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->name('superadmin.customer.destroy');

});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [AdminUserController::class, 'indexAdmin'])->name('admin.users');
    Route::post('/users/store', [AdminUserController::class, 'store']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Admin Departments
    Route::get('/department', [AdminDepartmentController::class, 'indexAdmin'])->name('admin.department');

    // Admin Projects
    Route::get('/projects', [AdminProjectController::class, 'index'])->name('admin.projects');
    Route::get('/projects/{projectID}/deliveries', [AdminTrackingDeliveryController::class, 'getByProject']);

    //Admin Employees
    Route::get('/employees', [AdminEmployeesController::class, 'index'])->name('admin.employees.index');

    //Admin Equipment
    Route::get('/equipment', [AdminEquipmentController::class, 'index'])->name('admin.equipment.index');

    //Super Admin Item Design
    Route::get('/itemdesign', [AdminItemDesignController::class, 'index'])->name('admin.itemdesign.index');

    //Super Admin Customer
    Route::get('/customers', [AdminCustomerController::class, 'index'])->name('admin.customer.index');

});

Route::middleware(['auth', 'role:client'])->prefix('client')->name('client.')->group(function () {

    // Client Projects
    Route::get('/projects', [ClientProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{id}/deliveries', [ClientProjectController::class, 'deliveries'])->name('projects.deliveries');
    Route::put('/deliveries/{deliveryId}/mark-delivered', [ClientProjectController::class, 'markDelivered'])->name('deliveries.mark-delivered');
    Route::put('/deliveries/{deliveryId}/mark-out-for-delivery', [ClientProjectController::class, 'markOutForDelivery'])->name('deliveries.mark-out-for-delivery');

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
