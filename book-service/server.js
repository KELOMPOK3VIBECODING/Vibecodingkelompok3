const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Data 10 Buku Lengkap
let books = [
  {
    id: "BK01",
    judul: "Coding Basics",
    pengarang: "Andrea Hirata",
    gambar: "images/gambar1.jpg",
    isAvailable: true,
  },
  {
    id: "BK02",
    judul: "Computer Science",
    pengarang: "Pramoedya Ananta Toer",
    gambar: "images/gambar2.jpg",
    isAvailable: true,
  },
  {
    id: "BK03",
    judul: "Linux Karnel",
    pengarang: "Thierry Gayet",
    gambar: "images/gambar3.jpg",
    isAvailable: true,
  },
  {
    id: "BK04",
    judul: "Code Firts",
    pengarang: "Oreilly",
    gambar: "images/gambar4.jpg",
    isAvailable: true,
  },
  {
    id: "BK05",
    judul: "Exploring Kotlin",
    pengarang: "Leila S. Chudori",
    gambar: "images/gambar5.jpg",
    isAvailable: true,
  },
  {
    id: "BK06",
    judul: "Eloquent JS",
    pengarang: "Ari Rahmat Nur",
    gambar: "images/gambar6.jpg",
    isAvailable: true,
  },
  {
    id: "BK07",
    judul: "Introducing C++",
    pengarang: "Vera Armiyanti",
    gambar: "images/gambar7.jpg",
    isAvailable: true,
  },
  {
    id: "BK08",
    judul: "The Computer Science",
    pengarang: "Nita",
    gambar: "images/gambar8.jpg",
    isAvailable: true,
  },
  {
    id: "BK09",
    judul: "Learning Python",
    pengarang: "Nabila Stefani",
    gambar: "images/gambar9.jpg",
    isAvailable: true,
  },
  {
    id: "BK10",
    judul: "Java Programmer",
    pengarang: "Helma Hariani",
    gambar: "images/gambar10.jpg",
    isAvailable: true,
  },
];

// Endpoint untuk mengambil semua daftar buku
app.get("/api/books", (req, res) => {
  res.json(books);
});

// Endpoint untuk mengambil detail 1 buku berdasarkan ID
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }
  res.json(book);
});

// Endpoint untuk memperbarui status ketersediaan buku (diakses oleh Borrowing Service)
app.put("/api/books/:id/status", (req, res) => {
  const { isAvailable } = req.body;
  const book = books.find((b) => b.id === req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }

  book.isAvailable = isAvailable;
  res.json({ message: "Status buku berhasil diperbarui", book });
});

app.listen(5001, () => {
  console.log("Book Service jalan di port 5001");
});
