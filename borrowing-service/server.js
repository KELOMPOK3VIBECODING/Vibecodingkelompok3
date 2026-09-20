const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let loans = [];

function calculateDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
}

app.get("/api/borrowings/:nim", (req, res) => {
  const userLoans = loans.filter(
    (l) => l.nim === req.params.nim && l.status === "AKTIF",
  );
  res.json(userLoans);
});

app.post("/api/borrowings", async (req, res) => {
  const { nim, bookId } = req.body;

  const activeLoans = loans.filter(
    (l) => l.nim === nim && l.status === "AKTIF",
  );
  if (activeLoans.length >= 3) {
    return res
      .status(400)
      .json({
        message: "PERINGATAN: Anda telah mencapai batas maksimal 3 buku aktif!",
      });
  }

  try {
    const bookResponse = await fetch(
      `http://localhost:5001/api/books/${bookId}`,
    );
    if (!bookResponse.ok)
      return res
        .status(404)
        .json({ message: "Buku tidak ditemukan pada katalog" });
    const book = await bookResponse.json();

    if (!book.isAvailable) {
      return res
        .status(400)
        .json({ message: "Buku sedang tidak tersedia untuk dipinjam" });
    }

    const newLoan = {
      id: `LN-${nim}-${Date.now()}`,
      nim,
      bookId,
      tanggalPinjam: new Date().toISOString().split("T")[0],
      tanggalJatuhTempo: calculateDueDate(),
      status: "AKTIF",
    };
    loans.push(newLoan);

    await fetch(`http://localhost:5001/api/books/${bookId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: false }),
    });

    res.status(201).json({ message: "Peminjaman berhasil", loan: newLoan });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Gagal terhubung ke Book Service",
        error: error.message,
      });
  }
});

app.listen(5002, () => console.log("Borrowing Service jalan di port 5002"));
