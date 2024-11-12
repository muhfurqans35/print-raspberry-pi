<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PrinterController;
use App\Http\Controllers\PrintJobController;
use App\Http\Controllers\PrintRequestController;


Route::get('/user', [UserController::class, 'index'])->middleware(['auth:sanctum']);

Route::middleware(['auth:sanctum', 'permission:order_create_and_index', 'verified'])->group(function () {
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

});

Route::middleware(['auth:sanctum', 'permission:order_management', 'verified'])->group(function () {
    Route::patch('/orders/{orderId}/status', [OrderController::class, 'updateStatus'])->name('order.status');
});

Route::middleware(['auth:sanctum', 'permission:print_management', 'verified'])->group(function () {
    // Route::get('/printindex', [ItemController::class, 'index']);
    Route::get('/printjobs', [PrintJobController::class, 'index']);
    Route::apiResource('printers', PrinterController::class);
    Route::post('/submitPrint', [PrintRequestController::class, 'submitPrint']);
});

Route::middleware(['auth:sanctum', 'permission:product_management', 'verified'])->group(function () {
    Route::apiResource('items', ItemController::class);
});

Route::get('/preview', [FileController::class, 'preview'])->name('file.preview');
Route::get('/download', [FileController::class, 'download'])->name('file.download');




