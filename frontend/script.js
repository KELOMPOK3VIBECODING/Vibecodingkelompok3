// --- DATA INITIAL SEEDING ---
const INITIAL_USERS = [
  { nim: "1001", password: "user1001", nama: "NITA STEFANI" },
  { nim: "1002", password: "user1002", nama: "HELMA ARMYANTI" },
  { nim: "1003", password: "user1003", nama: "NABILA HARIYANI" },
];

const INITIAL_BOOKS = [
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

// --- APP STATE MANAGEMENT VIA LOCALSTORAGE ---
function initDataSeeding() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify(INITIAL_BOOKS));
  }
  if (!localStorage.getItem("loans")) {
    localStorage.setItem("loans", JSON.stringify([]));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function getBooks() {
  return JSON.parse(localStorage.getItem("books")) || [];
}
function setBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}
function getLoans() {
  return JSON.parse(localStorage.getItem("loans")) || [];
}
function setLoans(loans) {
  localStorage.setItem("loans", JSON.stringify(loans));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || null;
}
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}

// --- UTILITY FUNCTIONS ---
function showAlert(message, type = "warning") {
  const container = document.getElementById("alert-container");
  if (!container) return;

  container.classList.remove("hidden");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  container.appendChild(alert);

  setTimeout(() => {
    alert.remove();
    if (container.children.length === 0) {
      container.classList.add("hidden");
    }
  }, 4000);
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

function calculateDueDate(fromDate) {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
}

function getActiveLoansCount(nim) {
  const loans = getLoans();
  return loans.filter((loan) => loan.nim === nim && loan.status === "AKTIF")
    .length;
}

// --- RENDER UI ---
function renderUI() {
  const currentUser = getCurrentUser();
  const loginSection = document.getElementById("login-section");
  const mainSection = document.getElementById("main-section");
  const userNameDisplay = document.getElementById("user-name-display");
  const quotaBadge = document.getElementById("quota-badge");

  if (!currentUser) {
    if (loginSection) loginSection.classList.remove("hidden");
    if (mainSection) mainSection.classList.add("hidden");
    return;
  }

  if (loginSection) loginSection.classList.add("hidden");
  if (mainSection) mainSection.classList.remove("hidden");

  if (userNameDisplay) {
    userNameDisplay.textContent = `${currentUser.nama} (${currentUser.nim})`;
  }

  const activeCount = getActiveLoansCount(currentUser.nim);
  if (quotaBadge) {
    quotaBadge.textContent = `Buku Aktif: ${activeCount}/3`;
    quotaBadge.className =
      activeCount >= 3 ? "badge badge-danger" : "badge badge-info";
  }

  // Render sesuai elemen yang ada di halaman aktif
  if (document.getElementById("book-grid")) {
    renderBooks();
  }
  if (document.getElementById("loan-list-body")) {
    renderLoans();
  }
}

function renderBooks(filterText = "") {
  const bookGrid = document.getElementById("book-grid");
  if (!bookGrid) return;

  const books = getBooks();
  bookGrid.innerHTML = "";

  const filteredBooks = books.filter(
    (book) =>
      book.judul.toLowerCase().includes(filterText.toLowerCase()) ||
      book.pengarang.toLowerCase().includes(filterText.toLowerCase()),
  );

  if (filteredBooks.length === 0) {
    bookGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">Buku tidak ditemukan.</div>`;
    return;
  }

  filteredBooks.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";

    const isAvailable = book.isAvailable;
    const badgeHtml = isAvailable
      ? `<span class="badge badge-success">Tersedia</span>`
      : `<span class="badge badge-danger">Tidak Tersedia</span>`;

    const buttonHtml = isAvailable
      ? `<button class="btn btn-primary btn-block" onclick="handleBorrow('${book.id}')">Pinjam Buku</button>`
      : `<button class="btn btn-disabled btn-block" disabled>Tidak Dapat Dipinjam</button>`;

    card.innerHTML = `
      <img src="${book.gambar}" alt="${book.judul}" class="book-cover" onerror="this.src='https://via.placeholder.com/150'">
      <div class="book-details">
        <h3 class="book-title">${book.judul}</h3>
        <p class="book-author">Oleh: ${book.pengarang}</p>
        <div class="book-status-wrapper">${badgeHtml}</div>
        <div class="book-action">${buttonHtml}</div>
      </div>
    `;

    bookGrid.appendChild(card);
  });
}

function renderLoans() {
  const loanListBody = document.getElementById("loan-list-body");
  if (!loanListBody) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const loans = getLoans().filter(
    (loan) => loan.nim === currentUser.nim && loan.status === "AKTIF",
  );
  const books = getBooks();
  loanListBody.innerHTML = "";

  if (loans.length === 0) {
    loanListBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Anda belum memiliki peminjaman buku aktif.</td>
      </tr>
    `;
    return;
  }

  loans.forEach((loan) => {
    const book = books.find((b) => b.id === loan.bookId);
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><strong>${book ? book.judul : "Buku Tidak Ditemukan"}</strong></td>
      <td>${book ? book.pengarang : "-"}</td>
      <td>${formatDate(loan.tanggalPinjam)}</td>
      <td><strong>${formatDate(loan.tanggalJatuhTempo)}</strong></td>
      <td><span class="badge badge-info">${loan.status}</span></td>
      <td>
        <button class="btn btn-danger-sm" onclick="handleReturn('${loan.id}', '${loan.bookId}')">Kembalikan</button>
      </td>
    `;

    loanListBody.appendChild(row);
  });
}

// --- DOM INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initDataSeeding();

  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const searchInput = document.getElementById("search-input");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nimInput = document.getElementById("nim");
      const passwordInput = document.getElementById("password");

      const nim = nimInput.value.trim();
      const password = passwordInput.value.trim();

      const users = getUsers();
      const user = users.find((u) => u.nim === nim && u.password === password);

      if (user) {
        setCurrentUser({ nim: user.nim, nama: user.nama });
        nimInput.value = "";
        passwordInput.value = "";
        renderUI();
        showAlert(`Selamat datang, ${user.nama}!`, "success");
      } else {
        showAlert("NIM atau Password yang Anda masukan salah!", "danger");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      setCurrentUser(null);
      renderUI();
      showAlert("Anda telah keluar dari sistem.", "warning");
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      renderBooks(e.target.value.trim());
    });
  }

  renderUI();
});

// --- LOGIKA TRANSAKSI ---
window.handleBorrow = function (bookId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showAlert("Silakan login terlebih dahulu.", "danger");
    return;
  }

  const activeCount = getActiveLoansCount(currentUser.nim);
  if (activeCount >= 3) {
    showAlert(
      "PERINGATAN: Anda telah mencapai batas maksimal 3 buku aktif!",
      "warning",
    );
    return;
  }

  const books = getBooks();
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1 || !books[bookIndex].isAvailable) {
    showAlert("Maaf, buku ini sedang tidak tersedia untuk dipinjam.", "danger");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const dueDate = calculateDueDate(today);

  const newLoan = {
    id: `LN-${currentUser.nim}-${Date.now()}`,
    nim: currentUser.nim,
    bookId: bookId,
    tanggalPinjam: today,
    tanggalJatuhTempo: dueDate,
    status: "AKTIF",
  };

  const loans = getLoans();
  loans.push(newLoan);
  setLoans(loans);

  books[bookIndex].isAvailable = false;
  setBooks(books);

  renderUI();
  showAlert(
    `Peminjaman berhasil! Harap kembalikan buku "${books[bookIndex].judul}" sebelum ${formatDate(dueDate)}.`,
    "success",
  );
};

window.handleReturn = function (loanId, bookId) {
  let loans = getLoans();
  loans = loans.filter((loan) => loan.id !== loanId);
  setLoans(loans);

  const books = getBooks();
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isAvailable = true;
    setBooks(books);
  }

  renderUI();
  showAlert(
    "Buku berhasil dikembalikan dan status ketersediaan telah diperbarui.",
    "success",
  );
};
