<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\LoanController;

// ==========================================
// AUTHENTICATION
// ==========================================

// Login tidak memerlukan token
Route::post('/login', [AuthController::class, 'login']);

// ==========================================
// BOOKS
// ==========================================

// Daftar buku
Route::get('/books', [BookController::class, 'index']);

// Detail buku
Route::get('/books/{id}', [BookController::class, 'show']);

// ==========================================
// BORROWINGS / LOANS
// Wajib menggunakan token Sanctum
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    // Daftar transaksi peminjaman mahasiswa
    Route::get('/loans/{nim}', [LoanController::class, 'index']);

    // Membuat peminjaman buku
    Route::post('/loans', [LoanController::class, 'store']);

    // Mengembalikan buku
    Route::put('/loans/{id}/return', [LoanController::class, 'returnBook']);

});