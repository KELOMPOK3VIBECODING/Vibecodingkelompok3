<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\User;
use App\Models\Book;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LoanController extends Controller
{
    // Menampilkan riwayat peminjaman mahasiswa
    public function index($nim)
    {
        $user = User::where('nim', $nim)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $loans = Loan::where('nim', $nim)
                     ->orderBy('id', 'desc')
                     ->get();

        return response()->json($loans);
    }

    // Meminjam buku
    public function store(Request $request)
    {
        $request->validate([
            'nim' => 'required',
            'book_id' => 'required|integer',
        ]);

        $user = User::where('nim', $request->nim)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $book = Book::find($request->book_id);

        if (!$book) {
            return response()->json([
                'message' => 'Buku tidak ditemukan'
            ], 404);
        }

        // Cek apakah buku sedang dipinjam
        if (!$book->is_available) {
            return response()->json([
                'message' => 'Buku sedang dipinjam'
            ], 400);
        }

        // Hitung jumlah buku yang sedang dipinjam mahasiswa
        $activeLoans = Loan::where('nim', $request->nim)
                           ->where('status', 'dipinjam')
                           ->count();

        // Maksimal 3 buku
        if ($activeLoans >= 3) {
            return response()->json([
                'message' => 'Maksimal peminjaman adalah 3 buku'
            ], 400);
        }

        $tanggalPinjam = Carbon::today();
        $tanggalJatuhTempo = Carbon::today()->addDays(7);

        $loan = Loan::create([
            'nim' => $request->nim,
            'book_id' => $request->book_id,
            'tanggal_pinjam' => $tanggalPinjam,
            'tanggal_jatuh_tempo' => $tanggalJatuhTempo,
            'tanggal_kembali' => null,
            'status' => 'dipinjam',
        ]);

        // Buku menjadi tidak tersedia
        $book->is_available = false;
        $book->save();

        return response()->json([
            'message' => 'Buku berhasil dipinjam',
            'loan' => $loan
        ], 201);
    }

    // Mengembalikan buku
    public function returnBook($id)
    {
        $loan = Loan::find($id);

        if (!$loan) {
            return response()->json([
                'message' => 'Data peminjaman tidak ditemukan'
            ], 404);
        }

        if ($loan->status === 'dikembalikan') {
            return response()->json([
                'message' => 'Buku sudah dikembalikan'
            ], 400);
        }

        $loan->tanggal_kembali = Carbon::today();
        $loan->status = 'dikembalikan';
        $loan->save();

        // Buku menjadi tersedia kembali
        $book = Book::find($loan->book_id);

        if ($book) {
            $book->is_available = true;
            $book->save();
        }

        return response()->json([
            'message' => 'Buku berhasil dikembalikan',
            'loan' => $loan
        ]);
    }
}