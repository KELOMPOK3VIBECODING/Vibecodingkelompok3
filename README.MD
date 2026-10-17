# Libraryzzz Engeneeringzz

# API Perpustakaan Terintegrasi

Backend REST API untuk proyek UTS Vibe Coding Kelompok 4. Aplikasi ini menggunakan Laravel, PHP, MySQL, dan Laravel Sanctum untuk menyediakan autentikasi mahasiswa, katalog buku, serta transaksi peminjaman dan pengembalian buku.

## 1. Teknologi yang Digunakan

- **Bahasa backend:** PHP (`composer.json` mensyaratkan PHP `^8.3`)
- **Framework:** Laravel (`composer.json` mensyaratkan `laravel/framework` `^13.17`)
- **Autentikasi token:** Laravel Sanctum (`^4.3`)
- **Database:** MySQL
- **Komunikasi:** REST API melalui HTTP/JSON
- **Pengujian API:** Postman
- **Lingkungan pengembangan yang digunakan:** XAMPP untuk MySQL dan PHP/Composer yang tersedia di komputer pengembang

Periksa versi aktual pada komputer dengan `php -v` dan `php artisan --version`.

## 2. Persyaratan

Pastikan perangkat sudah memiliki:

- PHP 8.3 atau versi yang memenuhi persyaratan proyek
- Composer
- MySQL (misalnya melalui XAMPP)
- Postman atau aplikasi sejenis untuk pengujian API

## 3. Instalasi dan Menjalankan Backend

1. Jalankan layanan MySQL melalui XAMPP.
2. Buka terminal pada folder backend:

   ```bash
   cd C:\xampp\VibeCoding\perpustakaan-api
   ```

3. Jika dependency belum terpasang, jalankan:

   ```bash
   composer install
   ```

4. Pastikan file `.env` tersedia. Jika belum, buat salinan dari `.env.example`:

   ```bat
   copy .env.example .env
   ```

5. Jika `APP_KEY` belum dibuat, jalankan:

   ```bash
   php artisan key:generate
   ```

6. Buat database bernama `perpustakaan` melalui phpMyAdmin atau MySQL. Atur koneksi database pada `.env`:

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=perpustakaan
   DB_USERNAME=root
   DB_PASSWORD=
   ```

   Sesuaikan username dan password dengan konfigurasi MySQL lokal.

7. Pastikan tabel dan data yang diperlukan sudah tersedia. Implementasi controller menggunakan tabel `users`, `books`, dan `loans`. Database proyek sebelumnya dapat dibuat secara manual. **Jangan menjalankan `php artisan migrate` sebelum memeriksa migration**, karena migration bawaan Laravel pada folder `database/migrations` belum tentu sama dengan skema database perpustakaan yang digunakan.

8. Jalankan backend:

   ```bash
   php artisan serve
   ```

Secara default server Laravel berjalan pada:

```text
http://127.0.0.1:8000
```

## 4. Base URL API

```text
http://127.0.0.1:8000/api
```

Route API didefinisikan dalam `routes/api.php`.

## 5. Daftar Endpoint

| Method | Endpoint             | Autentikasi  | Fungsi                                           |
| ------ | -------------------- | ------------ | ------------------------------------------------ |
| POST   | `/login`             | Tidak        | Login mahasiswa dan mendapatkan token            |
| GET    | `/books`             | Tidak        | Menampilkan daftar buku                          |
| GET    | `/books/{id}`        | Tidak        | Menampilkan detail buku                          |
| GET    | `/loans/{nim}`       | Bearer token | Menampilkan transaksi peminjaman berdasarkan NIM |
| POST   | `/loans`             | Bearer token | Membuat transaksi peminjaman                     |
| PUT    | `/loans/{id}/return` | Bearer token | Mengembalikan buku berdasarkan ID transaksi      |

**Catatan:** route transaksi peminjaman dilindungi middleware `auth:sanctum`. Pada implementasi saat ini, `nim` pada request peminjaman dikirim dalam body; pengujian harus memastikan bahwa identitas mahasiswa tidak dapat dimanipulasi hanya dengan mengganti NIM.

## 6. Cara Menguji dengan Postman

Pastikan backend berjalan sebelum mengirim request. Untuk request JSON, pilih **Body → raw → JSON**.

### 6.1 Login

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/login`
- Body:

  ```json
  {
    "nim": "2441919017",
    "password": "123456"
  }
  ```

Jika berhasil, API mengembalikan `200 OK` beserta token dan informasi pengguna. Simpan token dari respons untuk request yang dilindungi.

### 6.2 Menampilkan daftar buku

- Method: `GET`
- URL: `http://127.0.0.1:8000/api/books`

### 6.3 Menampilkan detail buku

- Method: `GET`
- URL contoh: `http://127.0.0.1:8000/api/books/1`

Ganti `1` dengan ID buku yang tersedia di database.

### 6.4 Melihat transaksi mahasiswa

- Method: `GET`
- URL contoh: `http://127.0.0.1:8000/api/loans/2441919017`
- Tab **Authorization**: pilih **Bearer Token**, lalu masukkan token hasil login.

### 6.5 Meminjam buku

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/loans`
- Authorization: **Bearer Token**
- Body:

  ```json
  {
    "nim": "2441919017",
    "book_id": 1
  }
  ```

Gunakan ID buku yang ada dan tersedia. Jika berhasil, implementasi saat ini mengembalikan `201 Created`.

### 6.6 Mengembalikan buku

- Method: `PUT`
- URL contoh: `http://127.0.0.1:8000/api/loans/1/return`
- Authorization: **Bearer Token**

Angka `1` pada contoh adalah **ID transaksi pada tabel `loans`, bukan ID buku**. Gunakan ID transaksi yang benar-benar ada di database. Endpoint ini tidak memerlukan body pada implementasi saat ini.

### 6.7 Memeriksa perubahan ketersediaan

1. Kirim `GET /api/books` dan catat nilai `is_available` untuk buku yang akan diuji.
2. Pinjam buku melalui `POST /api/loans`.
3. Kirim ulang `GET /api/books`; buku yang berhasil dipinjam seharusnya memiliki `is_available: false`.
4. Kembalikan transaksi melalui `PUT /api/loans/{id}/return`.
5. Kirim ulang `GET /api/books`; setelah pengembalian berhasil, buku seharusnya memiliki `is_available: true`.

Simpan screenshot respons yang benar-benar diperoleh di folder `api-test/`.

## 7. Aturan Bisnis yang Diharapkan

- Mahasiswa maksimal memiliki tiga peminjaman aktif.
- Buku yang tidak tersedia ditolak ketika hendak dipinjam.
- Tanggal jatuh tempo ditetapkan tujuh hari setelah tanggal peminjaman.
- Saat pengembalian berhasil, status transaksi menjadi `dikembalikan` dan buku tersedia kembali.

Aturan ini harus diverifikasi melalui pengujian. Controller yang ada saat ini mengembalikan `400` untuk buku tidak tersedia, batas peminjaman tercapai, dan transaksi yang sudah dikembalikan; status aktual tersebut perlu dicocokkan dengan kontrak API dan kebutuhan dosen.

## 8. HTTP Status Code

- `200 OK`: permintaan berhasil diproses, misalnya login atau membaca data.
- `201 Created`: transaksi peminjaman baru berhasil dibuat.
- `400 Bad Request`: pada implementasi saat ini digunakan untuk beberapa kondisi bisnis yang ditolak.
- `401 Unauthorized`: kredensial login salah atau request ke endpoint terlindungi tidak memiliki autentikasi valid.
- `404 Not Found`: data buku, pengguna, atau transaksi tidak ditemukan.
- `422 Unprocessable Content`: data request tidak lolos validasi Laravel.

Respons aktual dapat berbeda tergantung jalur kode dan validasi yang dijalankan.

## 9. Akun Uji

Akun yang tercatat untuk pengujian lokal:

| NIM          | Password |
| ------------ | -------- |
| `2441919017` | `123456` |
| `2441919010` | `123456` |
| `2441919015` | `123456` |
| `2441919055` | `123456` |
| `2441919056` | `123456` |

Pastikan akun tersebut tersedia di database sebelum digunakan. Kredensial ini hanya untuk data uji lokal, bukan untuk penggunaan produksi.

## 10. Struktur Proyek dan Dokumentasi

File penting backend:

```text
perpustakaan-api/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   ├── BookController.php
│   │   └── LoanController.php
│   └── Models/
├── routes/
│   └── api.php
├── database/
│   └── migrations/
├── docs/
│   ├── API-CONTRACT.md
│   ├── CODE_REVIEW_LOG.md
│   └── AI-PROMPTS.md
├── api-test/
├── .env
├── composer.json
└── README.md
```

Dokumentasi pendukung:

- `docs/API-CONTRACT.md` — detail kontrak endpoint.
- `docs/CODE_REVIEW_LOG.md` — temuan review kode dan tindak lanjut.
- `docs/AI-PROMPTS.md` — prompt AI dan catatan validasi.
- `api-test/` — screenshot atau Postman Collection hasil pengujian.

Jangan mengunggah `.env` berisi kredensial database atau rahasia lain ke repositori publik.

## 11. Catatan Review Sebelum Pengumpulan

- Implementasi login pada `AuthController.php` saat ini membandingkan password langsung dengan nilai pada database. Untuk keamanan yang benar, gunakan hashing password dan verifikasi dengan mekanisme seperti `Hash::check`, setelah data password disesuaikan.
- Pastikan seluruh aturan bisnis diuji melalui Postman, termasuk buku tidak tersedia, batas tiga buku aktif, dan pengembalian.
- Cocokkan dokumentasi dengan hasil aktual dari API, bukan hanya hasil yang diharapkan.
- Jangan menyatakan tes lulus sebelum bukti respons atau pemeriksaan database tersedia.
