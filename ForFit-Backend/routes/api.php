<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CategoryItemController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\VariableController;
use App\Http\Controllers\SalesController;

// Get the authenticated user details
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getMe']);

// Check email availability (for registration or login)
Route::post('/get-user', [AuthController::class, 'getUser']);
// Login user
Route::post('/login', [AuthController::class, 'login']);

// Register user
Route::post('/register', [AuthController::class,'register']);

// Logout user
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

Route::middleware('auth:api')->group(function () {
    Route::put('/profile/update-email', [ProfileController::class, 'updateEmail']);
    Route::post('/profile/update-profile-picture', [ProfileController::class, 'updateProfilePicture']);
    Route::put('/profile/update-password', [ProfileController::class, 'updatePassword']);
    Route::put('/profile/update-username', [ProfileController::class, 'updateUsername']);
    Route::get('/profile/getUserDetails', [ProfileController::class, 'getUserDetails']);   
    Route::put('/profile/changePassword',[ProfileController::class,'changePassword']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart/cartitems', [CartController::class, 'getCart']);
    Route::post('/cart/create-cartitem', [CartController::class, 'createCartItem']);
    Route::put('/cart/update-cartitem', [CartController::class, 'updateCartItem']);
    Route::delete('/cart/delete-cartitem', [CartController::class, 'deleteCartItem']);
    Route::put('/cart/update-quantity', [CartController::class, 'updateCartItemQuantity']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/wishlist/wishlistitems', [WishlistController::class, 'getwishlist']);
    Route::post('/wishlist/create-wishlistitem', [WishlistController::class, 'creatwishlistitem']);
    Route::delete('/wishlist/delete-wishlistitem', [WishlistController::class, 'deletewishlistitem']);
    Route::delete('/wishlist/clear-wishlist', [WishlistController::class, 'clearwishlist']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/item/getitems', [ItemsController::class, 'getItems']);
    Route::get('/item/getitem', [ItemsController::class, 'GetItem']);
    Route::get('/item/getcurrency', [ItemsController::class, 'getcurrencies']);
    Route::post('/item/review', [ItemsController::class, 'CreateReview']);
    });
Route::middleware('auth:sanctum')->group(function () { 
    
    Route::put('/item/updateitem', [ItemsController::class, 'updateItem']);
    Route::delete('/item/deleteitem', [ItemsController::class, 'DeleteItem']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categories', [CategoryController::class, 'getCategory']);
    Route::get('/category/getcolors', [ItemsController::class, 'getColors']);
    Route::get('/category/getSizeitems', [ItemsController::class, 'getSizeitems']);
});

Route::middleware('auth:sanctum')->group(function () { 
    Route::get('item/getitems',[ItemsController::class, 'getItems']);
    Route::post('/item/additem', [ItemsController::class, 'store']);
    Route::post('/item/addCategory', [ItemsController::class, 'addCategory']);
    Route::put('/item/addColor', [ItemsController::class, 'addColor']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::get('/addresses/{id}', [AddressController::class, 'show']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/category-items', [CategoryItemController::class, 'index']);
    Route::get('/categoryitems/{id}', [CategoryItemController::class, 'getCategoryItems']);
});

Route::middleware('auth:sanctum')->group(function () {

Route::get('/item/search', [ItemsController::class, 'searchItems']);
Route::get('/item/getitem', [ItemsController::class, 'GetItem']);
Route::post('/item/additem', [ItemsController::class, 'addItem']);
});
Route::middleware('auth:sanctum')->group(function () {

Route::get('payment', [PaymentController::class, 'showPaymentForm'])->name('payment.form');
Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
Route::get('payment/success', [PaymentController::class, 'paymentSuccess'])->name('payment.success');
Route::get('payment/error', [PaymentController::class, 'paymentFailure'])->name('payment.failure');

});


Route::middleware('auth:sanctum')->group(function () {

Route::post('/Checkout', [OrderController::class, 'Checkout']);
});

Route::get('/variable', [VariableController::class, 'getVariable']);
Route::post('/update-variable', [VariableController::class, 'updateVariable']);