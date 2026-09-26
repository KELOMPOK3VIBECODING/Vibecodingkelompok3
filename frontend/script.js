const API_URL = "http://localhost:8000/api";

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let books = [];
let loans = [];

// ==========================================
// LOGIN
// ==========================================

async function handleLogin(event) {
  event.preventDefault();

  const nim = document.getElementById("nim").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nim: nim,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login gagal");
      return;
    }

    currentUser = data.user;

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showMainPage();

    showNotification("Login berhasil!", "success");

    await loadData();
  } catch (error) {
    console.error(error);
    alert("Tidak dapat terhubung ke server Laravel.");
  }
}

// ==========================================
// TAMPILKAN HALAMAN UTAMA
// ==========================================

function showMainPage() {
  const loginSection = document.getElementById("login-section");
  const mainSection = document.getElementById("main-section");

  if (loginSection) {
    loginSection.classList.add("hidden");
  }

  if (mainSection) {
    mainSection.classList.remove("hidden");
  }

  updateUserInfo();
}

// ==========================================
// INFORMASI USER
// ==========================================

function updateUserInfo() {
  const userNameDisplay = document.getElementById("user-name-display");

  if (userNameDisplay && currentUser) {
    userNameDisplay.textContent = currentUser.nama;
  }

  updateQuota();
}

// ==========================================
// AMBIL DATA BUKU DARI LARAVEL
// ==========================================

async function fetchBooks() {
  try {
    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
      throw new Error("Gagal mengambil data buku");
    }

    books = await response.json();
  } catch (error) {
    console.error(error);
    alert("Gagal mengambil data buku dari Laravel.");
  }
}

// ==========================================
// AMBIL DATA PEMINJAMAN
// ==========================================

async function fetchLoans() {
  if (!currentUser) {
    loans = [];
    return;
  }

  try {
    const response = await fetch(`${API_URL}/loans/${currentUser.nim}`);

    if (!response.ok) {
      throw new Error("Gagal mengambil data peminjaman");
    }

    loans = await response.json();
  } catch (error) {
    console.error(error);
    alert("Gagal mengambil data peminjaman.");
  }
}

// ==========================================
// BUKU YANG MASIH DIPINJAM
// ==========================================

function getActiveLoans() {
  return loans.filter((loan) => loan.status === "dipinjam");
}

// ==========================================
// UPDATE QUOTA
// ==========================================

function updateQuota() {
  const quotaBadge = document.getElementById("quota-badge");

  if (!quotaBadge) {
    return;
  }

  const activeLoans = getActiveLoans();

  quotaBadge.textContent = `Buku Aktif: ${activeLoans.length}/3`;
}

// ==========================================
// TAMPILKAN BUKU
// ==========================================

function renderBooks() {
  const bookGrid = document.getElementById("book-grid");

  if (!bookGrid) {
    return;
  }

  const searchInput = document.getElementById("search-input");

  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filteredBooks = books.filter((book) => {
    const judul = (book.judul || "").toLowerCase();

    const pengarang = (book.pengarang || "").toLowerCase();

    return judul.includes(keyword) || pengarang.includes(keyword);
  });

  if (filteredBooks.length === 0) {
    bookGrid.innerHTML = `
            <p style="padding: 20px;">
                Buku tidak ditemukan.
            </p>
        `;

    return;
  }

  const activeLoans = getActiveLoans();

  bookGrid.innerHTML = filteredBooks
    .map((book) => {
      const isAvailable = book.is_available;

      const alreadyBorrowed = activeLoans.some(
        (loan) => Number(loan.book_id) === Number(book.id),
      );

      let buttonHTML = "";

      if (!isAvailable) {
        buttonHTML = `
    <button
      class="btn btn-outline"
      disabled
    >
      Sedang Dipinjam
    </button>
  `;
      } else if (alreadyBorrowed) {
        buttonHTML = `
    <button
      class="btn btn-outline"
      disabled
    >
      Sedang Anda Pinjam
    </button>
  `;
      } else {
        buttonHTML = `
    <button
      class="btn btn-primary"
      onclick="handleBorrow(${book.id})"
    >
      Pinjam Buku
    </button>
  `;
      }

      return `
            <div class="book-card">

                <div class="book-image">
                    <img
                        src="${book.gambar || ""}"
                        alt="${book.judul}"
                        onerror="this.style.display='none'"
                    >
                </div>

                <div class="book-info">

                    <h3>${book.judul}</h3>

                    <p>
                        ${book.pengarang}
                    </p>

                    ${
                      isAvailable
                        ? `<span class="status-available">Tersedia</span>`
                        : `<span class="status-unavailable">Sedang Dipinjam</span>`
                    }

                    ${buttonHTML}

                </div>

            </div>
        `;
    })
    .join("");
}

// ==========================================
// PINJAM BUKU
// ==========================================

async function handleBorrow(bookId) {
  if (!currentUser) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const activeLoans = getActiveLoans();

  if (activeLoans.length >= 3) {
    showNotification(
      "PERINGATAN: Anda telah mencapai batas maksimal 3 buku!",
      "warning",
    );
    return;
  }

  try {
    const response = await fetch(`${API_URL}/loans`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nim: currentUser.nim,
        book_id: Number(bookId),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Gagal meminjam buku.");
      return;
    }

    showNotification("Buku berhasil dipinjam!", "success");

    await loadData();
  } catch (error) {
    console.error(error);

    alert("Tidak dapat terhubung ke server Laravel.");
  }
}

// ==========================================
// KEMBALIKAN BUKU
// ==========================================

async function handleReturn(loanId) {
  try {
    const response = await fetch(`${API_URL}/loans/${loanId}/return`, {
      method: "PUT",
    });

    const data = await response.json();

    if (!response.ok) {
      showNotification(data.message || "Gagal mengembalikan buku.", "warning");
      return;
    }

    showNotification("Buku berhasil dikembalikan!", "success");

    await loadData();
  } catch (error) {
    console.error(error);

    showNotification("Tidak dapat terhubung ke server Laravel.", "warning");
  }
}
// ==========================================
// TAMPILKAN DATA PEMINJAMAN
// ==========================================

function renderLoans() {
  const loanListBody = document.getElementById("loan-list-body");

  if (!loanListBody) {
    return;
  }

  // Hanya tampilkan peminjaman yang masih aktif
  const activeLoans = loans.filter((loan) => loan.status === "dipinjam");

  // Kalau tidak ada peminjaman
  if (activeLoans.length === 0) {
    loanListBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    Belum ada buku yang sedang dipinjam.
                </td>
            </tr>
        `;

    return;
  }

  loanListBody.innerHTML = activeLoans
    .map((loan) => {
      // Cari data buku berdasarkan book_id
      const book = books.find(
        (book) => Number(book.id) === Number(loan.book_id),
      );

      const judul = book ? book.judul : "Buku tidak ditemukan";

      const pengarang = book ? book.pengarang : "-";

      return `
            <tr>

                <td>${judul}</td>

                <td>${pengarang}</td>

                <td>${formatDate(loan.tanggal_pinjam)}</td>

                <td>${formatDate(loan.tanggal_jatuh_tempo)}</td>

                <td>
                    <span class="status-available">
                        Dipinjam
                    </span>
                </td>

                <td>
                    <button
                        class="btn btn-primary"
                        onclick="handleReturn(${loan.id})"
                    >
                        Kembalikan
                    </button>
                </td>

            </tr>
        `;
    })
    .join("");
}

// ==========================================
// FORMAT TANGGAL
// ==========================================

function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ==========================================
// LOAD SEMUA DATA
// ==========================================

async function loadData() {
  await fetchBooks();

  if (currentUser) {
    await fetchLoans();
  }

  renderBooks();

  renderLoans();

  updateQuota();

  updateUserInfo();
}

// ==========================================
// LOGOUT
// ==========================================

function handleLogout() {
  localStorage.removeItem("currentUser");

  currentUser = null;
  books = [];
  loans = [];

  window.location.href = "index.html";
}

// ==========================================
// SEARCH BUKU
// ==========================================

function setupSearch() {
  const searchInput = document.getElementById("search-input");

  if (searchInput) {
    searchInput.addEventListener("input", renderBooks);
  }
}

// ==========================================
// SAAT HALAMAN DIBUKA
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  // Login
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Tombol logout
  const logoutButton = document.getElementById("logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  // Search
  setupSearch();

  // Kalau sudah pernah login
  if (currentUser) {
    showMainPage();

    await loadData();
  } else {
    // Kalau belum login,
    // pastikan login tampil
    const loginSection = document.getElementById("login-section");

    const mainSection = document.getElementById("main-section");

    if (loginSection) {
      loginSection.classList.remove("hidden");
    }

    if (mainSection) {
      mainSection.classList.add("hidden");
    }
  }
});

// ==========================================
// NOTIFIKASI
// ==========================================

function showNotification(message, type = "success") {
  const alertContainer = document.getElementById("alert-container");

  if (!alertContainer) {
    return;
  }

  alertContainer.textContent = message;

  alertContainer.classList.remove("hidden", "warning", "error");

  if (type === "warning") {
    alertContainer.classList.add("warning");
  }

  if (type === "error") {
    alertContainer.classList.add("error");
  }

  setTimeout(() => {
    alertContainer.classList.add("hidden");
  }, 2500);
}
