function switchRole(role) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => tab.classList.remove("active"));

  if (role === "user") {
    tabs[0].classList.add("active");
  } else {
    tabs[1].classList.add("active");
  }
}





let currentRole = "User"; // default role

function switchRole(role) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => tab.classList.remove("active"));

  if (role === "user") {
    tabs[0].classList.add("active");
    currentRole = "User";
  } else {
    tabs[1].classList.add("active");
    currentRole = "Staff";
  }
}

/* LOGIN DATA */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      page: "Login",
      role: currentRole,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    console.log("=== LOGIN DATA ===");
    console.log(data);

    window.location.href = "home.html";

  });
}

/* SIGNUP DATA */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      page: "Sign Up",
      role: currentRole,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value
    };

    console.log("=== SIGNUP DATA ===");
    console.log(data);


    window.location.href = "home.html";

  });
}



