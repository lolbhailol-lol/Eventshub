const API_BASE_URL = window.API_BASE_URL || "http://127.0.0.1:8000";
const SIGNUP_URL = `${API_BASE_URL}/auth/signup`;
const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const TOKEN_KEY = "access_token";

function getErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;
  return fallback;
}

async function handleSignup(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
  };

  try {
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(getErrorMessage(data, "Signup failed."));
      return;
    }

    alert("Signup successful. Please login.");
    form.reset();
    window.location.href = "login.html";
  } catch (_error) {
    alert("Network error while signing up.");
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const payload = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(getErrorMessage(data, "Login failed."));
      return;
    }

    if (!data.access_token) {
      alert("Login succeeded but token is missing.");
      return;
    }

    localStorage.setItem(TOKEN_KEY, data.access_token);
    alert("Login successful.");
    window.location.href = "index.html";
  } catch (_error) {
    alert("Network error while logging in.");
  }
}

function setupLogout() {
  const logoutButtons = document.querySelectorAll("#logoutBtn");
  if (!logoutButtons.length) return;

  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));
  logoutButtons.forEach((button) => {
    button.style.display = hasToken ? "inline-block" : "none";
    button.addEventListener("click", () => {
      localStorage.removeItem(TOKEN_KEY);
      alert("Logged out successfully.");
      window.location.href = "login.html";
    });
  });
}

function init() {
  const signupForm = document.querySelector("#signupForm");
  const loginForm = document.querySelector("#loginForm");

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  setupLogout();
}

document.addEventListener("DOMContentLoaded", init);

