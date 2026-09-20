DOKUMENTASI PROMPT PENGEMBANGAN SISTEM

Arsitektur Microservice --- Sistem Peminjaman Buku Perpustakaan

> AI Coding Tool yang digunakan: Gemini

Dokumen ini menyusun seluruh prompt yang digunakan sepanjang proses
pengembangan sistem peminjaman buku perpustakaan dari versi berbasis
localStorage menjadi arsitektur microservice. Prompt dikelompokkan
berdasarkan tahapan pengerjaan --- mulai dari perancangan awal
arsitektur, analisis perbandingan, perbaikan bug, hingga review dan
pengembangan lanjutan --- agar dapat digunakan sebagai bagian dari
laporan pengembangan sistem.

**I. Tahap Perancangan Arsitektur Microservice**

Tahap ini merupakan instruksi awal untuk mengubah sistem peminjaman buku
yang semula berjalan sepenuhnya di sisi klien menggunakan JavaScript
localStorage menjadi dua service backend yang terpisah dan saling
berkomunikasi melalui API.

**1. Book Service**

Book Service dibangun menggunakan Node.js dan Express, bertugas
mengelola data buku beserta status ketersediaannya.

**2. Borrowing Service**

Borrowing Service dibangun menggunakan Node.js dan Express, bertugas
memproses transaksi peminjaman dengan dua validasi utama: maksimal 3
buku aktif per mahasiswa, dan masa peminjaman 7 hari.

**3. Komunikasi Antar-Service**

Borrowing Service dan Book Service diintegrasikan melalui komunikasi
API, di mana Borrowing Service mengecek ketersediaan buku ke Book
Service sebelum transaksi peminjaman diproses.

**II. Tahap Analisis Perbandingan Arsitektur**

Setelah kedua service pada Bab I selesai dibangun, dilakukan analisis
perbandingan antara versi proyek sebelum pengembangan (VibeLama) dan
versi setelah pengembangan (VibeBaru), dengan tujuan menyusun bahan
laporan pengembangan sistem.

Cakupan analisis yang diminta:

- Arsitektur versi VibeLama (sebelum dikembangkan) dan versi VibeBaru
  (setelah dikembangkan).

- Perubahan struktur folder proyek.

- Perubahan komponen dan alur sistem.

- Perubahan teknologi yang digunakan.

- Perubahan atau penambahan fitur.

Hasil perbandingan diminta disajikan secara jelas dan sistematis agar
dapat langsung dimasukkan ke dalam laporan pengembangan sistem.

**III. Tahap Review, Perbaikan, dan Pengembangan Lanjutan**

Tahap ini adalah kelanjutan dari proyek yang sudah dikembangkan menjadi
arsitektur microservice pada Bab I. Alih-alih membangun ulang dari nol,
permintaan pada tahap ini difokuskan untuk mereview, memperbaiki, dan
melengkapi kode microservice yang sudah berjalan --- khususnya
menyangkut mekanisme login/autentikasi yang belum tersedia secara nyata,
serta integrasi fitur pengembalian buku ke arsitektur microservice.

**A. Kondisi Proyek Saat Ini**

Struktur folder proyek pada tahap ini:

VibeCoding/

├── book-service/

│ ├── package.json

│ └── server.js (Express, port 5001)

├── borrowing-service/

│ ├── package.json

│ └── server.js (Express, port 5002)

├── frontend/

│ ├── index.htm l(halaman katalog buku)

│ ├── peminjaman.html (halaman peminjaman saya)

│ ├── script.js

│ ├── style.css

│ └── images/

└── architecture/(untuk diagram arsitektur)

Kondisi teknis yang perlu dipahami sebelum melakukan perbaikan:

- Book Service menyimpan 10 data buku di memori menggunakan array
  JavaScript, bukan database, dan memiliki endpoint GET /api/books, GET
  /api/books/:id, serta PUT /api/books/:id/status.

- Borrowing Service menyimpan data peminjaman di memori menggunakan
  array, dengan endpoint GET /api/borrowings/:nim dan POST
  /api/borrowings.

- Saat proses peminjaman, Borrowing Service memanggil Book Service
  melalui HTTP untuk mengecek ketersediaan buku dan mengubah statusnya
  menjadi tidak tersedia.

- Validasi maksimal 3 buku aktif per mahasiswa sudah ada di Borrowing
  Service.

- Mekanisme login/autentikasi mahasiswa belum tersedia secara nyata di
  backend --- field NIM pada request peminjaman masih diterima langsung
  tanpa diverifikasi.

- Fitur pengembalian buku sudah tersedia pada sistem sebelumnya dan
  bukan fitur baru, namun implementasinya di sisi backend/microservice
  perlu direview dan dikembangkan agar terintegrasi dengan Borrowing
  Service dan Book Service.

- URL antar-service saat ini masih ditulis langsung (hardcode) di dalam
  kode dan perlu dikonfigurasi dengan lebih baik.

**B. User Story (Wajib Dipertahankan)**

- US-01: Sebagai mahasiswa, saya ingin mendapatkan peringatan jika
  meminjam buku lebih dari 7 hari, sehingga saya tidak lupa
  mengembalikan buku tersebut.

- US-02: Sebagai mahasiswa, saya ingin melihat daftar buku beserta
  status ketersediaannya, sehingga saya dapat mengetahui buku yang masih
  bisa dipinjam.

- US-03: Sebagai mahasiswa, saya ingin mendapatkan peringatan ketika
  jumlah buku yang saya pinjam sudah mencapai batas maksimal, sehingga
  saya mengetahui bahwa saya tidak dapat meminjam buku lagi.

**C. Acceptance Criteria (Wajib Dipertahankan)**

- AC-01: Given mahasiswa sudah login dan buku tersedia, When mahasiswa
  memilih tombol pinjam, Then sistem berhasil memproses peminjaman buku.

- AC-02: Given mahasiswa sudah memiliki 3 buku aktif, When mahasiswa
  mencoba meminjam buku ke-4, Then sistem menolak peminjaman.

- AC-03: Given buku sedang dipinjam oleh mahasiswa lain, When mahasiswa
  mencoba meminjam buku tersebut, Then sistem menolak peminjaman.

- AC-04: Given peminjaman berhasil dilakukan, When mahasiswa melihat
  informasi peminjaman, Then sistem menampilkan tanggal peminjaman dan
  tanggal jatuh tempo 7 hari kemudian.

AC-01 mensyaratkan mahasiswa sudah login. Kondisi ini belum sepenuhnya
terpenuhi pada implementasi backend saat ini karena belum ada mekanisme
autentikasi yang nyata, sehingga perlu diperbaiki tanpa mengubah
acceptance criteria yang sudah ditetapkan.

**D. Business Rules (Wajib Dipertahankan)**

1.  Mahasiswa wajib login sebelum dapat melakukan peminjaman buku.

2.  Hanya buku yang berstatus tersedia yang dapat dipinjam.

3.  Satu buku hanya dapat dipinjam oleh satu mahasiswa pada satu waktu.

4.  Setiap mahasiswa maksimal memiliki 3 buku aktif yang sedang
    dipinjam.

5.  Masa peminjaman adalah 7 hari sejak tanggal peminjaman.

6.  Sistem harus mencatat dan menampilkan informasi peminjaman, yaitu
    buku yang dipinjam, tanggal peminjaman, dan tanggal jatuh tempo.

7.  Setelah buku dipinjam, status buku berubah menjadi tidak tersedia
    sehingga mahasiswa lain tidak bisa meminjam buku yang sama.

Selain ketujuh business rule di atas, proses pengembalian buku yang
sudah tersedia sebelumnya harus tetap dipertahankan: ketika buku
dikembalikan, data peminjaman harus diperbarui dan status buku pada Book
Service harus kembali menjadi tersedia.

**E. Acuan Instruksi Tugas**

Sembilan poin acuan resmi yang menjadi dasar seluruh permintaan
perbaikan pada tahap ini:

a.  Gunakan proyek yang telah dikerjakan sebelumnya sebagai basis;
    jangan membangun ulang proyek dari nol.

b.  Gunakan kembali User Story dan Acceptance Criteria yang sudah ada.

c.  Kembangkan arsitektur proyek menjadi minimal 2 service/microservice
    --- Book Service dan Borrowing Service sudah ada, namun pembagian
    tanggung jawabnya perlu dievaluasi, terutama terkait autentikasi
    mahasiswa.

d.  Teknologi boleh dikembangkan atau diubah sesuai kebutuhan proyek.

e.  Gunakan AI Coding Tool untuk membantu proses pengembangan.

f.  Sediakan minimal 1 alur fitur yang berjalan dengan melibatkan
    komunikasi antar-service --- proses peminjaman yang sudah melibatkan
    Borrowing Service dan Book Service perlu dipastikan berjalan baik
    dan dapat diverifikasi.

g.  Setiap service harus memiliki fungsi/tanggung jawab yang jelas
    sesuai prinsip single responsibility.

h.  Antar-service harus berkomunikasi menggunakan API, khususnya REST
    API.

i.  Kode hasil AI harus diperiksa dan diperbaiki sendiri sebelum
    digunakan sebagai hasil akhir tugas.

**F. Rincian Permintaan Pengerjaan**

**1. Review Arsitektur Saat Ini**

Mengevaluasi apakah pembagian Book Service dan Borrowing Service sudah
tepat sesuai prinsip single responsibility, serta apakah perlu
ditambahkan service ketiga (misalnya auth-service) agar business rule
mengenai kewajiban login mahasiswa benar-benar dapat diterapkan.

Sebelum menulis atau mengubah kode, hal-hal berikut perlu dijelaskan
terlebih dahulu:

- Kondisi arsitektur saat ini.

- Tanggung jawab masing-masing service.

- Masalah yang ditemukan.

- Rekomendasi arsitektur.

- Alasan penambahan atau tidak adanya service baru.

**2. Penambahan Mekanisme Login/Autentikasi yang Nyata**

Identitas mahasiswa belum diverifikasi secara nyata pada backend.
Mekanisme login sederhana perlu ditambahkan, baik berupa service baru
bernama auth-service maupun endpoint autentikasi pada service yang sudah
ada, disertai penjelasan pilihan dan alasannya.

Mekanisme tersebut harus memenuhi ketentuan berikut:

- Mahasiswa harus login menggunakan NIM dan password.

- Data mahasiswa boleh menggunakan data dummy/seed.

- Setelah login berhasil, sistem menerbitkan token atau session.

- Borrowing Service harus memvalidasi token sebelum memproses
  peminjaman.

- Borrowing Service tidak boleh hanya mempercayai NIM yang dikirim
  langsung melalui request.

- Komunikasi autentikasi antar-service harus dapat dijelaskan dan diuji.

**3. Perbaikan Komunikasi Antar-Service**

Komunikasi antara Borrowing Service dan Book Service perlu direview
dengan langkah-langkah berikut:

- Mengubah URL antar-service yang masih hardcode agar dapat
  dikonfigurasi melalui environment variable.

- Mereview dan memperbaiki error handling ketika Book Service tidak
  aktif atau tidak memberikan respons.

- Mereview kemungkinan race condition atau masalah konsistensi data,
  mengingat pengecekan ketersediaan buku dan perubahan status buku
  dilakukan melalui dua request HTTP terpisah.

- Menjelaskan risiko yang mungkin terjadi dan apakah solusi yang
  diterapkan sudah cukup untuk skala prototype tugas ini.

**4. Tahap Perbaikan Bug pada Fitur Pencarian Buku**

Berdasarkan hasil analisis pada Bab II, ditemukan dua permasalahan pada
source code yang menyebabkan fitur website tidak berjalan sebagaimana
mestinya. Kedua permasalahan ini diminta untuk diperbaiki tanpa mengubah
tampilan atau fitur lain yang sudah berjalan baik.

**A. Elemen yang Tidak Terhubung dengan Benar**

> Perlu diperiksa dan diperbaiki bagian kode yang menyebabkan fitur atau
> fungsi tidak berjalan sebagaimana mestinya, dengan memastikan setiap
> elemen HTML, CSS, dan JavaScript saling terhubung dengan benar serta
> tidak ada pemanggilan elemen atau fungsi yang keliru.
>
> **B. Ketidaksesuaian ID (Mismatch) pada Fitur Pencarian**
>
> Pada index.html, input pencarian menggunakan id berikut:
>
> id=\"search-box-input\"
>
> Sedangkan pada script.js, JavaScript mencari elemen dengan id yang
> berbeda:
>
> document.getElementById(\"search-input\")
>
> Kedua id ini perlu disamakan agar fitur pencarian dapat berfungsi ---
> ketika pengguna mengetik judul buku atau nama pengarang, daftar buku
> harus langsung terfilter sesuai kata kunci yang diketik.
>
> **C. Ketentuan Setelah Perbaikan**
>
> 1\. Tidak mengubah tampilan atau fitur lain yang sudah berjalan dengan
> baik.
>
> 2\. Mempertahankan struktur kode yang sudah ada sebisa mungkin.
>
> 3 .Memastikan tidak ada error JavaScript setelah diperbaiki.
>
> 4\. Menampilkan bagian kode yang diperbaiki disertai penjelasan
> singkat perubahan yang dilakukan.
>
> 5\. Memastikan kedua permasalahan benar-benar terselesaikan dan fitur
> website tetap berjalan normal.

**5. Integrasi Fitur Pengembalian Buku**

Fitur pengembalian buku sudah tersedia pada sistem sebelumnya dan harus
tetap dipertahankan --- bukan diperlakukan sebagai fitur baru.
Implementasinya di sisi backend/microservice perlu direview dan
dikembangkan agar:

- Proses pengembalian ditangani oleh Borrowing Service.

- Data peminjaman diperbarui setelah buku dikembalikan.

- Borrowing Service berkomunikasi dengan Book Service untuk mengubah
  status buku kembali menjadi tersedia.

- Buku yang sudah dikembalikan dapat dipinjam kembali.

- Proses pengembalian tetap sesuai dengan business rules yang sudah
  ditentukan.

Jika implementasi pengembalian yang sudah ada masih menggunakan
localStorage atau hanya ditangani di sisi frontend, bagian mana yang
perlu dipindahkan atau diintegrasikan ke backend perlu dijelaskan.

**6. Review Business Rules dan Acceptance Criteria**

Business rule 1 sampai 7 serta AC-01 sampai AC-04 perlu direview satu
per satu, dengan penjelasan untuk masing-masing:

- Apakah sudah terpenuhi oleh kode saat ini.

- Jika belum terpenuhi, apa yang kurang.

- Bagaimana cara memperbaikinya.

- Service mana yang bertanggung jawab terhadap validasi tersebut.

- Alasan validasi ditempatkan pada service tersebut.

Tidak ada business rule maupun acceptance criteria yang boleh
dihilangkan atau diubah dalam proses ini.

**7. Penyesuaian Frontend**

index.html, peminjaman.html, script.js, dan style.css perlu direview dan
disesuaikan agar frontend benar-benar mengikuti alur backend yang telah
diperbaiki, sehingga frontend dapat:

- Melakukan login.

- Menerima dan menyimpan token/session.

- Menggunakan token saat melakukan request yang membutuhkan autentikasi.

- Menampilkan daftar buku beserta status ketersediaannya.

- Melakukan peminjaman.

- Menampilkan informasi peminjaman.

- Melakukan pengembalian buku.

- Menampilkan informasi atau pesan error yang sesuai.

Desain visual yang sudah ada tidak boleh diubah kecuali benar-benar
diperlukan untuk menambahkan atau memperbaiki fungsi yang diminta.

**8. Pembuatan/Pembaruan Diagram Arsitektur**

Folder architecture/ digunakan untuk menyimpan diagram arsitektur, dalam
format Mermaid atau deskripsi teks terstruktur, yang menunjukkan:

- Frontend.

- Seluruh service yang digunakan beserta tanggung jawab masing-masing.

- Arah komunikasi antar-service dan endpoint utama yang digunakan.

- Alur login.

- Alur melihat daftar buku.

- Alur peminjaman.

- Alur melihat informasi peminjaman.

- Alur pengembalian buku.

Alur komunikasi dari awal sampai akhir perlu ditampilkan dengan jelas
dalam diagram tersebut.

**8. Penjelasan Hasil Perubahan**

Setelah seluruh perubahan selesai dilakukan, hal-hal berikut perlu
dijelaskan secara terstruktur:

1.  Apa saja yang ditambahkan atau diubah dari kode yang sudah ada,
    beserta alasan perubahan tersebut.

2.  Perubahan arsitektur dan alasan pembagian tanggung jawab setiap
    service.

3.  Cara menjalankan seluruh proyek secara lokal, termasuk urutan
    menjalankan setiap service dan port yang digunakan.

4.  Skenario pengujian manual untuk memverifikasi AC-01 sampai AC-04.

5.  Skenario pengujian untuk fitur login dan pengembalian buku.

6.  Bukti bahwa komunikasi antar-service dapat berjalan.

7.  Potensi kelemahan yang masih tersisa, misalnya dari sisi keamanan,
    penyimpanan data di memori, skalabilitas, token, atau race
    condition.

8.  Bagian yang masih bersifat prototype dan belum cocok untuk
    lingkungan production.

**G. Catatan Penting**

- Tidak menghapus atau mengubah 10 data buku yang sudah ada di Book
  Service kecuali benar-benar diperlukan secara teknis.

- Tidak membangun ulang proyek dari nol.

- Tidak mengubah User Story dan Acceptance Criteria.

- Tidak menghilangkan fitur yang sudah tersedia.

- Fitur pengembalian buku bukan fitur baru --- harus dipertahankan dan
  dikembangkan implementasinya pada arsitektur microservice.

- Tidak menambahkan fitur di luar yang diminta, seperti fitur admin,
  denda, atau notifikasi, kecuali memang diperlukan untuk memenuhi
  kebutuhan yang sudah disebutkan.

- Kode yang benar secara fungsional dan mudah diaudit menjadi prioritas.

- Kode yang dihasilkan akan diperiksa dan diuji sendiri sebelum
  digunakan sebagai tugas akhir.

- Komentar perlu diberikan pada bagian kode yang penting, terutama
  logika validasi business rules, autentikasi, pengembalian buku, dan
  komunikasi antar-service.

- Sebelum melakukan perubahan besar pada kode, alasan dan dampaknya
  terhadap arsitektur perlu dijelaskan terlebih dahulu.
  
