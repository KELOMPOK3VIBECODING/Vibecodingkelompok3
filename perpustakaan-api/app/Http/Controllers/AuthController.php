<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validasi input
        $request->validate([
            'nim' => 'required|string',
            'password' => 'required|string',
        ]);

        // Cari pengguna berdasarkan NIM
        $user = User::where('nim', $request->nim)->first();

        // Periksa pengguna dan password
        if (!$user || $user->password !== $request->password) {
            return response()->json([
                'message' => 'NIM atau password salah'
            ], 401);
        }

        // Hapus token lama jika diperlukan agar satu login
        // hanya menggunakan satu token aktif.
        $user->tokens()->delete();

        // Buat token Sanctum
        $token = $user->createToken('perpustakaan-token')->plainTextToken;

        // Kirim token dan informasi pengguna
        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nim' => $user->nim,
                'nama' => $user->nama,
            ],
        ], 200);
    }
}