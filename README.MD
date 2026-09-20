Libraryzzz Engeneeringzz - Microservices System

Aplikasi Sistem Peminjaman Buku Perpustakaan berbasis Microservices Architecture yang dikembangkan menggunakan Node.js,Express.js,HTML/CSS/JS Vanilla,dan dipercepat dengan bantuan AI Coding Tool.

Pembagian Tugas Anggota Kelompok 3:
Nita - (Source Code & README.md, Bagian Codingannya:Book-Service).
Helma Hariyani - (Diagram Architecture/Microservices, Bagian Codingannya:Borrowing-Service).
Vera Armyanti - (Daftar Technology & masalah/kesalahan yang di temukan pada AI, Bagian Codingannya:Frontend).
Nabila Stefani - (Dokumentasi AI Coding Tool).
Ari Rachmad Nur - (Prompt AI).

Data Akun Mahasiswa Terdaftar (Demo Kredensial)

Sistem ini menyediakan akun mahasiswa aktif yang digunakan untuk pengujian alur peminjaman:

| Nama Mahasiswa | NIM (Username) | Password | Peran / Hak Akses | Batas Kuota |
| Nita Stefani| `1001` | `user1001` | Mahasiswa (Akun Uji 1) | Maksimal 3 Buku |
| Helma Armyanti| `1002` | `user1002` | Mahasiswa (Akun Uji 2) | Maksimal 3 Buku |
| nabila hariyani| `1003` | `user1003` | Mahasiswa (Akun Uji 3) | Maksimal 3 Buku |

Panduan Menjalankan Sistem

Untuk menjalankan sistem secara lengkap, Anda membutuhkan "2 terminal terpisah" untuk backend dan membuka frontend di browser:

1. Menjalankan Book Service (Port 5001)
   Buka terminal pertama:

cd book-service
npm install
node server.js

Layanan "Book Service" akan aktif di: `http://localhost:5001`

2. Menjalankan Borrowing Service (Port 5002)

Buka terminal kedua:

cd borrowing-service
npm install
node server.js

Layanan "Borrowing Service" akan aktif di: `http://localhost:5002`

3. Menjalankan Frontend Web Client:

1. Buka direktori/folder `frontend/`.
1. Klik dua kali pada file "`index.html`" untuk memuat antarmuka di browser (atau jalankan menggunakan ekstensi Live Server di VS Code).

Langkah-Langkah Penggunaan & Pengujian Sistem

Berikut panduan langkah demi langkah menggunakan aplikasi saat demo/testing:

Langkah 1: Login ke Sistem

1. Akses halaman `index.html` pada browser.
2. Masukkan salah satu akun mahasiswa, contohnya:

NIM: `1001`
Password: `user1001`

3. Klik tombol "Login" untuk masuk ke sistem.

Langkah 2: Melihat Katalog Buku

- Pada halaman Katalog Buku (`index.html`), sistem memuat daftar buku yang diambil secara _real-time_ via REST API dari "Book Service" (Port 5001).
- Setiap buku yang belum dipinjam akan memiliki status "Tersedia" dan tombol "Pinjam" dalam kondisi aktif.

Langkah 3: Meminjam Buku (Alur Inter-Service)

1. Sebagai mahasiswa (`1001`), klik tombol "Pinjam" pada salah satu buku.
2. "Borrowing Service" (Port 5002) memvalidasi kuota peminjaman, berkomunikasi dengan "Book Service" (Port 5001) via API untuk mengunci status ketersediaan buku, dan mencatat transaksi.
3. Notifikasi peminjaman berhasil akan muncul beserta informasi "tanggal jatuh tempo (7 hari)".
4. Buku yang dipinjam otomatis muncul pada halaman "Peminjaman Saya (`peminjaman.html`)".
5. Pada katalog utama, tombol buku tersebut otomatis berubah statusnya menjadi "Sedang Dipinjam".

Langkah 4: Menguji Batas Maksimal Kuota (Maksimal 3 Buku)

- Jika mahasiswa meminjam hingga "3 buku", sistem akan mengunci fungsi peminjaman.
- Tombol peminjaman pada buku lain di katalog akan otomatis dinonaktifkan dengan status "Batas Tercapai (Maksimal 3 Buku)".

Langkah 5: Mengembalikan Buku

1. Buka halaman Peminjaman Saya (`peminjaman.html`).
2. Klik tombol Kembalikan di sebelah buku yang ingin dikembalikan.
3. Borrowing Service memperbarui transaksi menjadi selesai dan meminta "Book Service" memperbarui status ketersediaan buku kembali menjadi "Tersedia".
4. Buku akan terhapus dari daftar peminjaman aktif dan dapat dipinjam kembali oleh mahasiswa lain.

Diagram Arsitektur Microservice

graph TD
%% Frontend Layer
subgraph Frontend_Layer ["Client Layer (Frontend)"]
UI1["index.html\n(Katalog Buku)"]
UI2["peminjaman.html\n(Peminjaman Saya)"]
JS["script.js\n(Fetch API Client)"]

        UI1 --> JS
        UI2 --> JS
    end

    %% Microservices Layer
    subgraph Microservices_Layer ["Backend Layer (Node.js & Express)"]
        BS["Book Service\n(Port: 5001)\nserver.js"]
        BRS["Borrowing Service\n(Port: 5002)\nserver.js"]
    end

    %% Communication
    JS -- "GET/PATCH /api/books\n(HTTP REST API)" --> BS
    JS -- "GET/POST/DELETE /api/borrowings\n(HTTP REST API)" --> BRS
    BRS -. "Inter-service / Validation Data\n(Status Buku & Limit)" .-> BS

AI Coding Tool Documentation

Pengembangan sistem ini memanfaatkan AI Coding Tool untuk membantu:

1. Generasi struktur awal server Node.js & Express (`server.js`) untuk `book-service` dan `borrowing-service`.
2. Refactoring antarmuka dari monolitik menjadi dua halaman terpisah (`index.html` & `peminjaman.html`).
3. Mengubah logika penyimpanan lokal (`localStorage`) menjadi pemanggilan _asynchronous_ `fetch()` API.
4. Solusi penanganan _CORS Error_ dan pemisahan port service.
