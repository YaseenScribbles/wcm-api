<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClothController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::apiResource('cloth',ClothController::class);
Route::apiResource('color',ColorController::class);
Route::apiResource('user',UserController::class);
Route::apiResource('contact',ContactController::class);
Route::apiResource('receipt',ReceiptController::class);
Route::apiResource('sale',SaleController::class);
Route::get('/delivery-stock',[SaleController::class,'stock']);
Route::apiResource('report',ReportController::class)->only(['index','show']);
Route::get('/menus/{id}',[UserController::class,'menus']);
Route::post('/user_menus',[UserController::class,'user_menus']);
Route::get('/user-rights/{id}',[UserController::class,'user_rights']);
Route::post('/user-rights',[UserController::class,'update_user_rights']);

