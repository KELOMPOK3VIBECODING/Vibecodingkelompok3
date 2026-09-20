Libraryzzz Engeneeringzz - Microservices System

Aplikasi Sistem Peminjaman Buku Perpustakaan berbasis Microservices Architecture yang dikembangkan menggunakan Node.js,Express.js,HTML/CSS/JS Vanilla,dan dipercepat dengan bantuan AI Coding Tool.

Pembagian Tugas Anggota Kelompok 3:
Nita - (Source Code & README.md, Bagian Codingannya:Book-Service).
Helma Hariyani - (Diagram Architecture/Microservices, Bagian Codingannya:Borrowing-Service).
Vera Armyanti - (Daftar Technology & masalah/kesalahan yang di temukan pada AI, Bagian Codingannya:Frontend).
Nabila Stefani - (Dokumentasi AI Coding Tool).
Ari Rachmad Nur - (Prompt AI).

Diagram Arsitektur Microservice

Aplikasi ini dipecah menjadi 3 layer terpisah yang saling berkomunikasi menggunakan RESTful API dan mekanisme CORS:

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
