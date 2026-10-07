<?php

use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\AgeVerificationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminLogController;
use App\Http\Controllers\CreatorRoleController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\SuperAdminUserController;
use Illuminate\Support\Facades\Route;

Route::get('/age-gate', [AgeVerificationController::class, 'create'])->name('age-gate.create');
Route::post('/age-gate', [AgeVerificationController::class, 'store'])->middleware('throttle:6,1')->name('age-gate.store');
Route::get('/register', [AuthController::class, 'createRegistration'])->name('register.create');
Route::post('/register', [AuthController::class, 'storeRegistration'])->middleware('throttle:6,1')->name('register.store');
Route::get('/login', [AuthController::class, 'createLogin'])->name('login');
Route::post('/login', [AuthController::class, 'storeLogin'])->middleware('throttle:6,1')->name('login.store');
Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/', MarketplaceController::class)->middleware('age.verified')->name('marketplace.index');
Route::post('/become-creator', [CreatorRoleController::class, 'store'])->middleware(['auth', 'age.verified'])->name('creator-role.store');
Route::put('/account/credentials', [AccountController::class, 'updateCredentials'])->middleware('auth')->name('account.credentials.update');
Route::delete('/account', [AccountController::class, 'destroy'])->middleware('auth')->name('account.destroy');
Route::get('/super-admin/logs', SuperAdminLogController::class)->middleware(['auth', 'super.admin'])->name('super-admin.logs');
Route::put('/super-admin/users/{user}/role', [SuperAdminUserController::class, 'updateRole'])->middleware(['auth', 'super.admin'])->name('super-admin.users.role');
