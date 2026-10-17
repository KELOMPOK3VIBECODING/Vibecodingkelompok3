const API_URL = "http://127.0.0.1:8000/api";

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let authToken = localStorage.getItem("authToken") || null;

let books = [];
let loans = [];

// ==========================================
// HEADER API
// ==========================================

function getHeaders(json = true) {
  const headers = {};

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

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
      headers: getHeaders(),
      body: JSON.stringify({ nim, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login gagal.");
      return;
    }

    if (!data.token || !data.user) {
      alert("Respons login tidak berisi token atau data user.");
      return;
    }

    authToken = data.token;
    currentUser = data.user;

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showMainPage();
    await loadData();

    showNotification("Login berhasil!", "success");
  } catch (error) {
    console.error(error);
    alert("Tidak dapat terhubung ke server Laravel.");
  }
}

// ==========================================
// HALAMAN UTAMA
// ==========================================

function showMainPage() {
  document.getElementById("login-section")?.classList.add("hidden");
  document.getElementById("main-section")?.classList.remove("hidden");

  updateUserInfo();
}

// ==========================================
// INFORMASI USER
// ==========================================

function updateUserInfo() {
  const display = document.getElementById("user-name-display");

  if (display && currentUser) {
    display.textContent = currentUser.nama;
  }

  updateQuota();
}

// ==========================================
// TOKEN / SESI TIDAK VALID
// ==========================================

function handleUnauthorized(response) {
  if (response.status !== 401) {
    return false;
  }

  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");

  authToken = null;
  currentUser = null;
  loans = [];

  alert("Sesi login tidak berlaku. Silakan login kembali.");
  window.location.reload();

  return true;
}

// ==========================================
// AMBIL DATA BUKU
// ==========================================

async function fetchBooks() {
  const response = await fetch(`${API_URL}/books`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data buku.");
  }

  books = await response.json();
}

// ==========================================
// AMBIL DATA PEMINJAMAN
// ==========================================

async function fetchLoans() {
  if (!currentUser || !authToken) {
    loans = [];
    return;
  }

  const response = await fetch(
    `${API_URL}/loans/${encodeURIComponent(currentUser.nim)}`,
    {
      headers: getHeaders(false),
    },
  );

  if (handleUnauthorized(response)) {
    throw new Error("Sesi login tidak berlaku.");
  }

  if (!response.ok) {
    throw new Error("Gagal mengambil data peminjaman.");
  }

  loans = await response.json();
}

// ==========================================
// PEMINJAMAN AKTIF
// ==========================================

function getActiveLoans() {
  return loans.filter((loan) => loan.status === "dipinjam");
}

// ==========================================
// KUOTA BUKU
// ==========================================

function updateQuota() {
  const badge = document.getElementById("quota-badge");

  if (badge) {
    badge.textContent = `Buku Aktif: ${getActiveLoans().length}/3`;
  }
}

// ==========================================
// KATALOG BUKU
// ==========================================

function renderBooks() {
  const grid = document.getElementById("book-grid");

  if (!grid) return;

  const input = document.getElementById("search-input");
  const keyword = input ? input.value.toLowerCase().trim() : "";

  const filteredBooks = books.filter((book) => {
    const judul = (book.judul || "").toLowerCase();
    const pengarang = (book.pengarang || "").toLowerCase();

    return judul.includes(keyword) || pengarang.includes(keyword);
  });

  if (filteredBooks.length === 0) {
    grid.innerHTML = `
      <p style="padding:20px">
        Buku tidak ditemukan.
      </p>
    `;
    return;
  }

  const activeLoans = getActiveLoans();

  grid.innerHTML = filteredBooks
    .map((book) => {
      const available =
        book.is_available === true ||
        book.is_available === 1 ||
        book.is_available === "1";

      const alreadyBorrowed = activeLoans.some(
        (loan) => Number(loan.book_id) === Number(book.id),
      );

      let buttonHTML = "";

      if (!available && alreadyBorrowed) {
        buttonHTML = `
          <button class="btn btn-outline" disabled>
            Sedang Anda Pinjam
          </button>
        `;
      } else if (!available) {
        buttonHTML = `
          <button class="btn btn-outline" disabled>
            Sedang Dipinjam
          </button>
        `;
      } else if (activeLoans.length >= 3) {
        buttonHTML = `
          <button class="btn btn-outline" disabled>
            Batas 3 Buku Tercapai
          </button>
        `;
      } else {
        buttonHTML = `
          <button
            class="btn btn-primary"
            onclick="handleBorrow(${Number(book.id)})"
          >
            Pinjam Buku
          </button>
        `;
      }

      const imagePath = book.gambar || "";

      return `
        <div class="book-card">
          <div class="book-image">
            <img
              src="${imagePath}"
              alt="${book.judul || "Buku"}"
              onerror="this.style.display='none'"
            >
          </div>

          <div class="book-info">
            <h3>${book.judul || "-"}</h3>

            <p>${book.pengarang || "-"}</p>

            ${
              available
                ? '<span class="status-available">Tersedia</span>'
                : '<span class="status-unavailable">Sedang Dipinjam</span>'
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
  if (!currentUser || !authToken) {
    alert("Silakan login kembali.");
    return;
  }

  if (getActiveLoans().length >= 3) {
    showNotification("Maksimal peminjaman adalah 3 buku.", "warning");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/loans`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        nim: currentUser.nim,
        book_id: Number(bookId),
      }),
    });

    const data = await response.json();

    if (handleUnauthorized(response)) return;

    if (!response.ok) {
      showNotification(data.message || "Gagal meminjam buku.", "warning");
      return;
    }

    showNotification(data.message || "Buku berhasil dipinjam!", "success");

    await loadData();
  } catch (error) {
    console.error(error);

    if (error.message !== "Sesi login tidak berlaku.") {
      showNotification("Gagal menghubungi API Laravel.", "warning");
    }
  }
}

// ==========================================
// KEMBALIKAN BUKU
// ==========================================

async function handleReturn(loanId) {
  if (!currentUser || !authToken) {
    alert("Silakan login kembali.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/loans/${Number(loanId)}/return`, {
      method: "PUT",
      headers: getHeaders(false),
    });

    const data = await response.json();

    if (handleUnauthorized(response)) return;

    if (!response.ok) {
      showNotification(data.message || "Gagal mengembalikan buku.", "warning");
      return;
    }

    showNotification(data.message || "Buku berhasil dikembalikan!", "success");

    await loadData();
  } catch (error) {
    console.error(error);

    if (error.message !== "Sesi login tidak berlaku.") {
      showNotification("Gagal menghubungi API Laravel.", "warning");
    }
  }
}

// ==========================================
// TABEL PEMINJAMAN SAYA
// ==========================================

function renderLoans() {
  const body = document.getElementById("loan-list-body");

  if (!body) return;

  const activeLoans = getActiveLoans();

  if (activeLoans.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center">
          Belum ada buku yang sedang dipinjam.
        </td>
      </tr>
    `;
    return;
  }

  body.innerHTML = activeLoans
    .map((loan) => {
      const book = books.find(
        (item) => Number(item.id) === Number(loan.book_id),
      );

      return `
        <tr>
          <td>${book ? book.judul : "Buku tidak ditemukan"}</td>

          <td>${book ? book.pengarang : "-"}</td>

          <td>${formatDate(loan.tanggal_pinjam)}</td>

          <td>${formatDate(loan.tanggal_jatuh_tempo)}</td>

          <td>
            <span class="status-available">Dipinjam</span>
          </td>

          <td>
            <button
              class="btn btn-primary"
              onclick="handleReturn(${Number(loan.id)})"
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

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ==========================================
// MUAT ULANG DATA
// ==========================================

async function loadData() {
  try {
    await fetchBooks();

    if (currentUser && authToken) {
      await fetchLoans();
    } else {
      loans = [];
    }

    renderBooks();
    renderLoans();
    updateQuota();
    updateUserInfo();
  } catch (error) {
    console.error(error);

    if (error.message !== "Sesi login tidak berlaku.") {
      showNotification("Gagal memuat data dari Laravel.", "warning");
    }
  }
}

// ==========================================
// LOGOUT
// ==========================================

function handleLogout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");

  currentUser = null;
  authToken = null;
  books = [];
  loans = [];

  window.location.href = "index.html";
}

// ==========================================
// PENCARIAN BUKU
// ==========================================

function setupSearch() {
  document
    .getElementById("search-input")
    ?.addEventListener("input", renderBooks);
}

// ==========================================
// NOTIFIKASI
// ==========================================

function showNotification(message, type = "success") {
  const container = document.getElementById("alert-container");

  if (!container) {
    alert(message);
    return;
  }

  container.textContent = message;

  container.classList.remove("hidden", "warning", "error");

  if (type === "warning") {
    container.classList.add("warning");
  }

  if (type === "error") {
    container.classList.add("error");
  }

  setTimeout(() => {
    container.classList.add("hidden");
  }, 2500);
}

// ==========================================
// SAAT HALAMAN DIBUKA
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("login-form")
    ?.addEventListener("submit", handleLogin);

  document
    .getElementById("logout-btn")
    ?.addEventListener("click", handleLogout);

  setupSearch();

  if (currentUser && authToken) {
    showMainPage();
    await loadData();
  } else {
    document.getElementById("login-section")?.classList.remove("hidden");

    document.getElementById("main-section")?.classList.add("hidden");
  }
});
