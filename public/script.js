const API_URL = "/api/raw-bookings";
const ROWS_PER_PAGE = 8;

let bookings = [];
let currentPage = 1;

async function fetchBookings() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();

    if (!json.success) throw new Error("API error");

    bookings = json.data;
    renderTable();
    renderPagination();
  } catch (err) {
    document.getElementById("table-body").innerHTML =
      `<div class="loading">Failed to load bookings</div>`;
  }
}

function renderTable() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  const pageData = bookings.slice(start, end);

  pageData.forEach((b) => {
    const row = document.createElement("div");
    row.className = "table-row";

    row.innerHTML = `
      <div>${b.full_name}</div>
      <div>${b.email}</div>
      <div>${b.number_of_guests}</div>
      <div>${formatDate(b.check_in)}</div>
      <div>${formatDate(b.check_out)}</div>
      <div><span class="badge ${b.payment_method}">
        ${b.payment_method}
      </span></div>
      <div>${formatDateTime(b.created_at)}</div>
    `;

    tableBody.appendChild(row);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(bookings.length / ROWS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.toggle("active", i === currentPage);
    btn.onclick = () => {
      currentPage = i;
      renderTable();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function formatDateTime(date) {
  return new Date(date).toLocaleString();
}

fetchBookings();
