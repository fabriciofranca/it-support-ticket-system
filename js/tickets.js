// ---- CRUD operations for tickets ----

const CATEGORIES = ["Hardware", "Software", "Network", "Account", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Open", "In Progress", "Resolved"];

// Basic input validation (the DB CHECK constraints back this up server-side).
function validateTicket({ title, category, priority, description }) {
  if (!title || title.trim().length < 3) return "Title must be at least 3 characters.";
  if (!CATEGORIES.includes(category)) return "Invalid category.";
  if (!PRIORITIES.includes(priority)) return "Invalid priority.";
  if (!description || description.trim().length < 5) return "Description must be at least 5 characters.";
  return null;
}

// Escape user text before inserting into the DOM (prevents XSS).
function esc(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

async function createTicket(ticket) {
  const user = await getUser();
  if (!user) return { error: { message: "You must be logged in." } };
  // user_id is set explicitly; RLS also enforces it must equal auth.uid().
  const { error } = await supabaseClient
    .from("tickets")
    .insert([{ ...ticket, user_id: user.id, status: "Open" }]);
  return { error };
}

async function loadTickets() {
  // Optional status filter chosen by the user in the "Your Tickets" toolbar.
  const filterEl = document.getElementById("status-filter");
  const statusFilter = filterEl ? filterEl.value : "All";

  let query = supabaseClient
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "All") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  const list = document.getElementById("ticket-list");
  if (error) {
    list.innerHTML = '<p class="error">Could not load tickets. Please try again.</p>';
    return;
  }
  if (!data.length) {
    const msg = statusFilter && statusFilter !== "All"
      ? 'No tickets match this filter.'
      : 'No tickets yet. Create your first one above.';
    list.innerHTML = '<p class="muted">' + msg + '</p>';
    return;
  }
  list.innerHTML = data.map(renderTicket).join("");
}

function renderTicket(t) {
  const priorityClass = 'badge priority-' + t.priority.toLowerCase();
  const statusClass = 'badge status-' + t.status.toLowerCase().replace(" ", "-");
  return `
  <article class="ticket-card" data-id="${t.id}">
    <div class="ticket-head">
      <h3>${esc(t.title)}</h3>
      <span class="badge category">${esc(t.category)}</span>
    </div>
    <p class="ticket-desc">${esc(t.description)}</p>
    <div class="ticket-meta">
      <span class="${priorityClass}">${esc(t.priority)}</span>
      <span class="${statusClass}">${esc(t.status)}</span>
      <span class="muted">${new Date(t.created_at).toLocaleString()}</span>
    </div>
    <div class="ticket-actions">
      <label>
        Status:
        <select onchange="updateStatus('${t.id}', this.value)" aria-label="Change status">
          ${STATUSES.map(function(s){return '<option ' + (s === t.status ? 'selected' : '') + '>' + s + '</option>';}).join("")}
        </select>
      </label>
      <button onclick="startEdit('${t.id}')" class="btn small">Edit</button>
      <button onclick="deleteTicket('${t.id}')" class="btn small danger">Delete</button>
    </div>
  </article>`;
}

async function updateStatus(id, status) {
  const { error } = await supabaseClient.from("tickets").update({ status }).eq("id", id);
  if (error) alert("Could not update status.");
  await loadTickets();
}

async function deleteTicket(id) {
  if (!confirm("Delete this ticket? This cannot be undone.")) return;
  const { error } = await supabaseClient.from("tickets").delete().eq("id", id);
  if (error) alert("Could not delete ticket.");
  await loadTickets();
}

// Edit: prefill the form, switch it into "update" mode.
async function startEdit(id) {
  const { data, error } = await supabaseClient.from("tickets").select("*").eq("id", id).single();
  if (error || !data) return alert("Could not load ticket.");
  const f = document.getElementById("ticket-form");
  f.title.value = data.title;
  f.category.value = data.category;
  f.priority.value = data.priority;
  f.description.value = data.description;
  f.dataset.editId = id;
  document.getElementById("form-title").textContent = "Edit Ticket";
  document.getElementById("submit-btn").textContent = "Update Ticket";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  const f = document.getElementById("ticket-form");
  f.reset();
  delete f.dataset.editId;
  document.getElementById("form-title").textContent = "New Ticket";
  document.getElementById("submit-btn").textContent = "Create Ticket";
}
