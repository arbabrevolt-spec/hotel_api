let isUser = true;
function switchRole(role) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  if (role === "user") {
    tabs[0].classList.add("active");
    currentRole = "User";
    isUser = true;
  } else {
    tabs[1].classList.add("active");
    currentRole = "Staff";
    isUser = false;
  }
}

let currentRole = "User";

/* ==============================
   TOAST
============================== */
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s forwards";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==============================
   LOGIN
============================== */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!isUser) {
      showToast("Logged in successfully!", "success");
      setTimeout(() => (window.location.href = "/admin"), 1000);
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        const msg =
          data?.data?.[0]?.message ||
          data?.error?.message ||
          data?.message ||
          "Login failed";
        showToast(msg, "error");
        return;
      }

      localStorage.setItem("token", data.data.token);
      showToast("Logged in successfully!", "success");
      setTimeout(() => (window.location.href = "/home"), 1000);
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Log in";
    }
  });
}

/* ==============================
   SIGNUP
============================== */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing up...";

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        const msg =
          data?.data?.[0]?.message ||
          data?.error?.message ||
          data?.message ||
          "Sign up failed";
        showToast(msg, "error");
        return;
      }

      localStorage.setItem("token", data.data.token);
      showToast("Signed up successfully!", "success");
      setTimeout(() => (window.location.href = "/home.html"), 1000);
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign up";
    }
  });
}
