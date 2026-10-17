# API Contract — Sistem Perpustakaan

## 1. Base URL

Base URL merupakan alamat utama yang digunakan untuk mengakses REST API backend sistem perpustakaan.

```text
http://127.0.0.1:8000/api
```

Seluruh endpoint API di bawah ini menggunakan Base URL tersebut.

## 2. Daftar Endpoint

| Method | Endpoint             | Fungsi                                                           |
| ------ | -------------------- | ---------------------------------------------------------------- |
| POST   | `/login`             | Melakukan login mahasiswa menggunakan NIM dan password.          |
| GET    | `/books`             | Menampilkan seluruh daftar buku.                                 |
| GET    | `/books/{id}`        | Menampilkan detail buku berdasarkan ID.                          |
| GET    | `/loans/{nim}`       | Menampilkan data peminjaman berdasarkan NIM mahasiswa.           |
| POST   | `/loans`             | Membuat transaksi peminjaman buku.                               |
| PUT    | `/loans/{id}/return` | Memproses pengembalian buku berdasarkan ID transaksi peminjaman. |

**Keterangan:**

- `POST` digunakan untuk mengirim data atau membuat transaksi baru.
- `GET` digunakan untuk mengambil data.
- `PUT` digunakan untuk memperbarui data.
- `{id}` merupakan ID buku atau ID transaksi peminjaman, sesuai endpoint yang digunakan.
- `{nim}` merupakan Nomor Induk Mahasiswa yang digunakan untuk mencari data peminjaman mahasiswa.

## 3. Detail Request Endpoint

### 3.1 Login Mahasiswa

**Method:** `POST`

**Endpoint:** `/login`

**URL lengkap:** `http://127.0.0.1:8000/api/login`

**Request Body (JSON):**

```json
{
  "nim": "2441919017",
  "password": "123456"
}
```

**Penjelasan parameter:**

- `nim`: Nomor Induk Mahasiswa yang digunakan untuk login.
- `password`: Password akun mahasiswa.

**Hasil yang diharapkan:** Jika kredensial valid, API mengembalikan respons login berhasil beserta informasi akun dan token autentikasi apabila mekanisme token digunakan.

### 3.2 Menampilkan Daftar Buku

**Method:** `GET`

**Endpoint:** `/books`

**URL lengkap:** `http://127.0.0.1:8000/api/books`

**Request Body:** Tidak diperlukan.

**Hasil yang diharapkan:** API mengembalikan daftar buku yang tersedia di database, termasuk informasi buku yang dikembalikan oleh backend.

### 3.3 Menampilkan Detail Buku

**Method:** `GET`

**Endpoint:** `/books/{id}`

**Contoh URL:** `http://127.0.0.1:8000/api/books/1`

**Request Body:** Tidak diperlukan.

**Hasil yang diharapkan:** API mengembalikan detail buku berdasarkan ID yang diminta. Jika buku tidak ditemukan, API dapat mengembalikan status `404 Not Found`.

### 3.4 Menampilkan Peminjaman Mahasiswa

**Method:** `GET`

**Endpoint:** `/loans/{nim}`

**Contoh URL:** `http://127.0.0.1:8000/api/loans/2441919017`

**Request Body:** Tidak diperlukan.

**Hasil yang diharapkan:** API mengembalikan data peminjaman milik mahasiswa berdasarkan NIM yang diberikan.

### 3.5 Meminjam Buku

**Method:** `POST`

**Endpoint:** `/loans`

**URL lengkap:** `http://127.0.0.1:8000/api/loans`

**Request Body (JSON):**

```json
{
  "nim": "2441919017",
  "book_id": 1
}
```

**Penjelasan parameter:**

- `nim`: NIM mahasiswa yang melakukan peminjaman.
- `book_id`: ID buku yang ingin dipinjam.

**Aturan bisnis:**

1. Mahasiswa maksimal memiliki tiga buku dengan status peminjaman aktif.
2. Buku yang sedang dipinjam tidak boleh dipinjam mahasiswa lain.
3. Tanggal jatuh tempo ditetapkan tujuh hari setelah tanggal peminjaman.
4. Data transaksi peminjaman disimpan ke database.

**Hasil yang diharapkan:** Jika permintaan valid dan seluruh aturan bisnis terpenuhi, transaksi peminjaman dibuat dan status ketersediaan buku diperbarui.

### 3.6 Mengembalikan Buku

**Method:** `PUT`

**Endpoint:** `/loans/{id}/return`

**Contoh URL:** `http://127.0.0.1:8000/api/loans/1/return`

**Request Body:** Tidak diperlukan, kecuali backend menetapkan parameter tambahan.

**Penjelasan parameter:**

- `{id}`: ID transaksi peminjaman pada tabel `loans`, bukan ID buku.

**Hasil yang diharapkan:** Status transaksi diperbarui menjadi `dikembalikan`, tanggal pengembalian dicatat, dan buku kembali tersedia untuk dipinjam.

## 4. HTTP Status Codes

- **200 OK**: Permintaan berhasil diproses.
- **201 Created**: Data baru berhasil dibuat.
- **401 Unauthorized**: Autentikasi tidak tersedia atau tidak valid pada endpoint yang dilindungi.
- **404 Not Found**: Endpoint atau data yang diminta tidak ditemukan.
- **422 Unprocessable Content**: Data permintaan gagal melewati validasi atau tidak memenuhi aturan yang diterapkan API.

Kode status aktual mengikuti implementasi backend Laravel.

## 5. Autentikasi

Endpoint yang dilindungi autentikasi harus menerima token yang valid melalui header berikut:

```text
Authorization: Bearer <token>
```

Token diperoleh dari respons login apabila endpoint login menghasilkan token autentikasi.

Kebutuhan autentikasi setiap endpoint harus disesuaikan dengan middleware dan konfigurasi route yang benar-benar digunakan dalam proyek.
