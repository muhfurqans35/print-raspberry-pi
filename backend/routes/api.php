<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PrinterController;
use App\Http\Controllers\PrintJobController;
use App\Http\Controllers\PrintRequestController;
use App\Http\Controllers\UserManagementController;


// Grup middleware untuk auth dan verified, kemudian tambahkan permission untuk tiap route khusus
Route::middleware(['auth:sanctum', 'verified'])->group(function () {

    // Routes untuk Order
    Route::middleware(['permission:order_create_and_index'])->group(function () {
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    });

    Route::middleware(['permission:order_management'])->group(function () {
        Route::patch('/orders/{orderId}/status', [OrderController::class, 'updateStatus'])->name('order.status');
    });

    // Routes untuk Print Job dan Printer
    Route::middleware(['permission:print_management'])->group(function () {
        Route::get('/printjobs', [PrintJobController::class, 'index']);
        Route::apiResource('printers', PrinterController::class);
        Route::post('/submitPrint', [PrintRequestController::class, 'submitPrint']);
    });

    // Routes untuk Product Management
    Route::apiResource('items', ItemController::class)->middleware('permission:product_management')->except(['index']);

    // Routes untuk User Management
    Route::apiResource('usermanagements', UserManagementController::class)->middleware('permission:user_management');
    // Route::post('/usermanagements/{user_id}', [UserManagementController::class, 'update'])->name('usermanagements.update');
});

// Routes untuk File Preview dan Download (tidak membutuhkan middleware auth)
Route::get('/preview', [FileController::class, 'preview'])->name('file.preview');
Route::get('/download', [FileController::class, 'download'])->name('file.download');

// Routes untuk User (tanpa middleware lain)
Route::get('/user', [UserController::class, 'index'])->middleware(['auth:sanctum']);


