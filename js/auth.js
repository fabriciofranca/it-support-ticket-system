// ---- Authentication: sign up, log in, log out, session handling ----

async function signUp(email, password) {
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  return { data, error };
}

async function logIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function logOut() {
  const { error } = await supabaseClient.auth.signOut();
  return { error };
}

async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user; // null if not logged in
}

// Show either the auth screen or the dashboard depending on session state.
async function refreshUI() {
  const user = await getUser();
  const authSection = document.getElementById("auth-section");
  const dashboard = document.getElementById("dashboard");

  if (user) {
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    document.getElementById("profile-email").textContent = user.email;
    await loadTickets(); // from tickets.js
  } else {
    authSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
}

// React automatically to login/logout across tabs.
supabaseClient.auth.onAuthStateChange(() => refreshUI());
