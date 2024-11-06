<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;


Route::get('/user', [UserController::class, 'index'])->middleware(['auth:sanctum']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('/items', [ItemController::class, 'index']);
    Route::post('/items', [ItemController::class, 'store']);
    Route::get('/items/{id}', [ItemController::class, 'show']);
    Route::post('/items/{id}', [ItemController::class, 'update']);
    Route::delete('/items/{id}', [ItemController::class, 'destroy']);
});


 Route::get('/preview', [FileController::class, 'preview'])->name('file.preview');
 Route::get('/download', [FileController::class, 'download'])->name('file.download');

