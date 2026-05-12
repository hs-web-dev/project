/* ============================
   HERO IMAGE LOAD
   ============================ */
const heroBg = document.querySelector(".hero-img");
if (heroBg) {
  setTimeout(() => heroBg.classList.add("loaded"), 300);
}

/* ============================
   SCROLL TO STORY
   ============================ */
const scrollStoryBtn = document.getElementById("scroll-to-story");
if (scrollStoryBtn) {
  scrollStoryBtn.onclick = () => {
    document.querySelector(".story").scrollIntoView({ behavior: "smooth" });
  };
}

/* ============================
   SCROLL STORY REVEAL
   ============================ */
const storyBlocks = document.querySelectorAll(".story-block");

const storyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.4 }
);

storyBlocks.forEach((block) => storyObserver.observe(block));

/* ============================
   HEADER — MENU COMPTE
   ============================ */
const btnLogin = document.getElementById("open-login");
const accountMenu = document.getElementById("account-menu");
const accountDropdown = document.getElementById("account-dropdown");
const accountEmailEl = document.getElementById("account-email");
const logoutBtn = document.getElementById("logout-btn");

function showAccountMenu() {
  btnLogin.style.display = "none";
  accountMenu.style.display = "block";

  const email = localStorage.getItem("email");
  accountEmailEl.textContent = email || "";
}

document.getElementById("open-account-menu").onclick = () => {
  accountDropdown.style.display =
    accountDropdown.style.display === "flex" ? "none" : "flex";
};

document.addEventListener("click", (e) => {
  if (!accountMenu.contains(e.target) && e.target !== document.getElementById("open-account-menu")) {
    accountDropdown.style.display = "none";
  }
});

logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.reload();
};

/* ============================
   DELETE ACCOUNT
   ============================ */
document.getElementById("delete-account").onclick = async () => {
  if (!confirm("Supprimer votre compte ?")) return;
  if (!confirm("Dernière confirmation.")) return;

  const token = localStorage.getItem("token");
  if (!token) return alert("Non connecté.");

  const res = await fetch("https://project-nqj7.onrender.com/auth/delete", {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  }).then(r => r.json());

  if (res.success) {
    alert("Compte supprimé.");
    localStorage.clear();
    window.location.reload();
  } else {
    alert("Erreur lors de la suppression.");
  }
};

/* ============================
   LANG SWITCH
   ============================ */
const langSwitch = document.getElementById("lang-switch");
const langDropdown = document.getElementById("lang-dropdown");
const langBtn = langSwitch.querySelector(".lang-btn");

langBtn.onclick = (e) => {
  e.stopPropagation();
  langDropdown.style.display =
    langDropdown.style.display === "flex" ? "none" : "flex";
};

document.addEventListener("click", (e) => {
  if (!langSwitch.contains(e.target)) langDropdown.style.display = "none";
});

langDropdown.querySelectorAll("button").forEach((btn) => {
  btn.onclick = () => {
    const lang = btn.dataset.lang;
    localStorage.setItem("lang", lang);
    langBtn.innerHTML = `<span class="lang-icon">🌐</span> ${lang.toUpperCase()}`;
    location.reload();
  };
});

/* ============================
   INIT
   ============================ */
window.addEventListener("load", () => {
  const lang = localStorage.getItem("lang") || "fr";
  langBtn.innerHTML = `<span class="lang-icon">🌐</span> ${lang.toUpperCase()}`;

  const token = localStorage.getItem("token");
  if (token) showAccountMenu();
});
