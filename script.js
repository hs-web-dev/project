const btn = document.getElementById("login-btn");
const status = document.getElementById("status");

btn.addEventListener("click", () => {
  status.textContent = "Bouton connexion cliqué.";
});
