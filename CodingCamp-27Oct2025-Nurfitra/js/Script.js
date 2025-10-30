const InputKegiatan = document.getElementById("kegiatan-input");
const JadwalKegiatan = document.getElementById("kegiatan-date");
const addBtn = document.getElementById("add-btn");
const ListKegiatan = document.getElementById("kegiatan-list");
const filter = document.getElementById("filter");
const clearBtn = document.getElementById("clear-btn");


let kegiatan = [];

// Penyimpanan
function saveToLocalStorage() {
  localStorage.setItem("kegiatan", JSON.stringify(kegiatan));
}
function loadFromLocalStorage() {
  const raw = localStorage.getItem("kegiatan");
  kegiatan = raw ? JSON.parse(raw) : [];
}

// Generate ID
function generateId() {
  return Date.now() + Math.random().toString(36).slice(2, 9);
}

// Tambah Task
addBtn.addEventListener("click", () => {
  const task = InputKegiatan.value.trim();
  const date = JadwalKegiatan.value;

  // Reset highlight
  InputKegiatan.classList.remove("invalid");
  JadwalKegiatan.classList.remove("invalid");

  // Validasi
  if (!task || !date) {
    if (!task) InputKegiatan.classList.add("invalid");
    if (!date) JadwalKegiatan.classList.add("invalid");
    alert("Tolong Isi Nama Kegiatan serta tanggalnya untuk bisa menambahkan");
    return;
  }

  const kegiatanBaru = { id: generateId(), task, date, completed: false };
  kegiatan.push(kegiatanBaru);
  saveToLocalStorage();
  InputKegiatan.value = "";
  JadwalKegiatan.value = "";
  renderList();
});

// Fitur Delete
function deleteTask(id) {
  kegiatan = kegiatan.filter(t => t.id !== id);
  saveToLocalStorage();
  renderList();
}

// Fitur Delete all
clearBtn.addEventListener("click", deleteAllTasks);
function deleteAllTasks() {
  if (kegiatan.length === 0) {
    alert("Tidak ada kegiatan yang bisa dihapus");
    return;
  }

  if (confirm("Yakin ingin menghapus semua jadwal kegiatan?")) {
    kegiatan = [];
    saveToLocalStorage();
    renderList();
  }
}

// Toggle complete
function toggleComplete(id) {
  kegiatan = kegiatan.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveToLocalStorage();
  renderList();
}

// Filter
filter.addEventListener("change", renderList);

// Render list
function renderList() {
  const f = filter.value;
  let list = kegiatan;
  if (f === "pending") list = kegiatan.filter(t => !t.completed);
  else if (f === "completed") list = kegiatan.filter(t => t.completed);

  if (list.length === 0) {
    ListKegiatan.innerHTML = `<tr><td colspan="4" class="empty">No task found</td></tr>`;
    return;
  }

  ListKegiatan.innerHTML = list.map(t => `
    <tr>
      <td>${escapeHtml(t.task)}</td>
      <td>${t.date || "-"}</td>
      <td>${t.completed ? "✅ Completed" : "⌛ Pending"}</td>
      <td>
        <button class="action-btn complete-btn" onclick="toggleComplete('${t.id}')">
          ${t.completed ? "Undo" : "Done"}
        </button>
        <button class="action-btn delete-btn" onclick="deleteTask('${t.id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
  );
}

// Load on start
window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderList();
});

// Expose for inline onclick
window.deleteTask = deleteTask;
window.deleteAllTasks = deleteAllTasks;
window.toggleComplete = toggleComplete;
