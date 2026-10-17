# Dokumentasi Penggunaan AI — Sistem API Perpustakaan

## 1. Prompt aktual yang digunakan oleh kelompok

**Tujuan:** Meminta bantuan AI untuk mengimplementasikan backend API perpustakaan terintegrasi secara bertahap, dimulai dari autentikasi dan pembuatan token.

**Prompt asli:**

> Halo! Saya sedang mengerjakan tugas UTS kelompok untuk mengembangkan backend API perpustakaan terintegrasi. Mohon bantu saya untuk mengimplementasikan bagian backend dengan ketentuan berikut:
>
> 1. **Membuat Route API**:
>    - Buat pengelompokan route API dalam satu service utama (mengikuti struktur `/api/auth`, `/api/books`, dan `/api/borrowings`).
>    - Sediakan endpoint untuk Login, Daftar Buku, Detail Buku, Buat Peminjaman, Daftar Transaksi, dan Pengembalian Buku.
> 2. **Autentikasi & Token**:
>    - Implementasikan autentikasi pengguna (`FR-01`) dengan memverifikasi kredensial dari database.
>    - Jika login berhasil, buatkan mekanisme pembuatan token (seperti JWT) agar endpoint yang memerlukan login dapat diamankan menggunakan header Authorization.
> 3. **Penerapan Business Rule**:
>    - Validasi peminjaman maksimal 3 buku aktif per mahasiswa (`BR-01`).
>    - Cek status ketersediaan buku; jika tidak tersedia, peminjaman harus ditolak (`BR-02`).
>    - Tetapkan tanggal jatuh tempo otomatis 7 hari setelah tanggal peminjaman (`BR-03`).
> 4. **Database & Respon**:
>    - Hubungkan dengan database relasional.
>    - Berikan kode yang bersih, terstruktur, serta contoh respon JSON beserta HTTP status code yang sesuai (misal: 200, 401, 404).
>
> Tolong berikan kode secara bertahap dimulai dari sistem autentikasi dan pembuatan token terlebih dahulu.

**Hasil/tujuan yang diminta:** Implementasi route API, autentikasi dan token, validasi business rule peminjaman, koneksi database relasional, serta contoh respons JSON dan HTTP status.

## Tujuan dokumen

Dokumen ini mencatat penggunaan AI untuk pengembangan API perpustakaan terintegrasi dengan Laravel dan MySQL. Output AI harus diperiksa anggota kelompok, disesuaikan dengan kode proyek, lalu divalidasi melalui pengujian.

## Prompt tambahan / template yang dapat digunakan

Bagian berikut adalah prompt tambahan atau template. Cantumkan sebagai prompt yang benar-benar digunakan hanya jika kelompok memang menjalankannya.

### A. Perancangan REST API

**Tujuan:** Membantu menyusun endpoint dan kontrak API sesuai kebutuhan sistem perpustakaan.

**Template prompt:**

> Saya sedang mengembangkan sistem perpustakaan menggunakan Laravel, PHP, dan MySQL. Sistem memiliki data mahasiswa, buku, dan transaksi peminjaman. Bantu susun rancangan REST API untuk login, daftar buku, detail buku, daftar peminjaman berdasarkan NIM, peminjaman buku, dan pengembalian buku. Jelaskan method HTTP, path, parameter, request body, contoh response JSON, status HTTP, validasi, dan aturan bisnis. Jangan menganggap endpoint atau mekanisme autentikasi sudah ada sebelum memeriksa implementasi proyek.

### B. Validasi aturan peminjaman

**Tujuan:** Memeriksa aturan bisnis pada proses peminjaman buku.

**Template prompt:**

> Tinjau kode Laravel untuk proses peminjaman buku pada sistem perpustakaan. Periksa apakah sistem membatasi maksimal tiga peminjaman aktif per mahasiswa, menolak buku yang tidak tersedia, menentukan tanggal jatuh tempo tujuh hari setelah tanggal pinjam, dan menjaga konsistensi data ketika terjadi request bersamaan atau kesalahan database. Sebutkan file/fungsi yang perlu diperiksa, risiko yang ditemukan, dan cara menguji tiap temuan. Bedakan temuan yang terbukti dari hal yang masih perlu diverifikasi.

### C. Review proses pengembalian

**Tujuan:** Memastikan transaksi dan status ketersediaan buku diperbarui dengan benar.

**Template prompt:**

> Tinjau kode endpoint pengembalian buku pada aplikasi Laravel. Periksa apakah ID yang digunakan merupakan ID transaksi peminjaman, apakah transaksi yang sudah dikembalikan ditangani dengan benar, apakah tanggal pengembalian dan status transaksi diperbarui, dan apakah ketersediaan buku dikembalikan menjadi tersedia. Periksa pula kebutuhan transaksi database untuk menjaga konsistensi. Berikan saran perbaikan dan skenario pengujian tanpa mengasumsikan bahwa perbaikan sudah diterapkan.

### D. Review autentikasi dan keamanan

**Tujuan:** Memeriksa validasi login dan perlindungan endpoint.

**Template prompt:**

> Tinjau mekanisme login dan middleware autentikasi pada proyek Laravel ini. Periksa cara verifikasi password, penerbitan dan validasi token bila digunakan, serta endpoint mana yang dilindungi autentikasi. Jelaskan risiko yang benar-benar terlihat dari kode dan rekomendasi perbaikan. Jangan menyimpulkan bahwa endpoint memakai Bearer Token kecuali implementasi proyek membuktikannya.

### E. Membantu penyusunan pengujian Postman

**Tujuan:** Menyusun daftar skenario pengujian berdasarkan kebutuhan UTS.

**Template prompt:**

> Buat daftar kasus uji Postman untuk REST API perpustakaan: login berhasil dan gagal, daftar/detail buku, peminjaman berhasil, peminjaman buku tidak tersedia, batas tiga buku aktif, pengembalian, serta perubahan status ketersediaan buku setelah dipinjam dan dikembalikan. Untuk setiap kasus, tuliskan method, endpoint, data request, hasil yang diharapkan, dan bukti yang perlu disimpan. Tandai hasil sebagai belum diuji sampai ada bukti aktual.
