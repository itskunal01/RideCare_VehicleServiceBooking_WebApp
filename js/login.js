const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formTitle = document.getElementById("formTitle");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const USERS_KEY = "ridecare_users";
const CURRENT_USER_KEY = "ridecare_current_user";


showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
  formTitle.textContent = "Create Your RideCare Account";
});


showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
  formTitle.textContent = "Login to RideCare";
});


registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const newUser = {
    name: document.getElementById("registerName").value.trim(),
    email: document.getElementById("registerEmail").value.trim(),
    phone: document.getElementById("registerPhone").value.trim(),
    password: document.getElementById("registerPassword").value
  };

  if (users.some(u => u.email === newUser.email)) {
    alert("Email already registered. Please login instead.");
    return;
  }

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  alert(" Registration successful! You can now login.");
  showLogin.click();
});


loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    alert(` Welcome back, ${user.name}!`);
    window.location.href = "/frontend/index.html";
  } else {
    alert(" Invalid email or password.");
  }
});
