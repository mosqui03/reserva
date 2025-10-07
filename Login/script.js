// Alternar entre login y registro
const loginSection = document.querySelector("main .form-container");
const registerSection = document.getElementById("registerSection");

document.getElementById("showRegister").addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  registerSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  // Simulamos login y vamos a la pantalla de autenticación
  window.location.href = "../Autenticacion/aut.html";
});

