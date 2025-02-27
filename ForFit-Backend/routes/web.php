<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\SalesController;

    Route::get('/', function () {
        return view('admin.login');
    });
    Route::get('/test', function () {
        return view('welcome');
    });
    Route::prefix('admin')->group(function () {
    Route::get('login', [AdminController::class, 'showLoginForm'])->name('admin.login');
    Route::post('login', [AdminController::class, 'login']);
    Route::post('logout', [AdminController::class, 'logout'])->name('logout');
    Route::get('dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::resource('items', ItemsController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('colors', ColorController::class);    
    Route::get('colors', [ColorController::class, 'index'])->name('admin.colors');
    Route::get('sales', [SalesController::class, 'index'])->name('admin.sales');
    Route::resource('categories', CategoryController::class);
    Route::get('categories', [CategoryController::class, 'index'])->name('admin.categories');
    Route::post('addsale', [SalesController::class, 'createSale'])->name('addsale');
    Route::delete('deletesale/{id}', [SalesController::class, 'DeleteSale'])->name('sales.destroy');
    Route::put('updatesale/{id}', [SalesController::class, 'UpdateSales'])->name('updatesale');
});
