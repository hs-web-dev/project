/* ============================
   SCROLL REVEAL
   ============================ */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ============================
   HERO IMAGE LOAD
   ============================ */
const heroBg = document.querySelector(".hero-img");
if (heroBg) {
  setTimeout(() => heroBg.classList.add("loaded"), 300);
}

/* ============================
   SCROLL TO PROJECTS
   ============================ */
const scrollBtn = document.getElementById("scroll-to-projects");
if (scrollBtn) {
  scrollBtn.onclick = () => {
    document.getElementById("projets").scrollIntoView({ behavior: "smooth" });
  };
}

/* ============================
   TYPEWRITER
   ============================ */
const codeLines = [
  "> init assistant...",
  "> voice.listen()",
  "> model: gpt-4o",
  "> tokens: 1024",
  '> response: "Bonjour!"',
  "> status: ✓ online",
];

const codeTextEl = document.getElementById("code-text");

if (codeTextEl) {
  let lineIndex = 0;
  let charIndex = 0;

  function typeChar() {
    if (lineIndex >= codeLines.length) {
      setTimeout(() => {
        lineIndex = 0;
        charIndex = 0;
        codeTextEl.textContent = "";
        typeChar();
      }, 2000);
      return;
    }

    const currentLine = codeLines[lineIndex];

    if (charIndex <= currentLine.length) {
      const prevLines = codeLines.slice(0, lineIndex).join("\n");
      const current = currentLine.slice(0, charIndex);
      codeTextEl.textContent =
        prevLines + (lineIndex > 0 ? "\n" : "") + current;
      charIndex++;
      setTimeout(typeChar, 55);
    } else {
      charIndex = 0;
      lineIndex++;
      setTimeout(typeChar, 300);
    }
  }

  typeChar();
}

/* ============================
   POPUPS
   ============================ */
const popupLogin = document.getElementById("popup-login");
const popupRegister = document.getElementById("popup-register");
const popupVerify = document.getElementById("popup-verify");

document.getElementById("open-login").onclick = () =>
  popupLogin.classList.add("active");

document.getElementById("open-register").onclick = () => {
  popupLogin.classList.remove("active");
  popupRegister.classList.add("active");
};

document.getElementById("open-login-from-register").onclick = () => {
  popupRegister.classList.remove("active");
  popupLogin.classList.add("active");
};

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.onclick = () => btn.closest(".login-popup").classList.remove("active");
});

/* ============================
   VERIFY CODE INPUTS
   ============================ */
const vcodeInputs = document.querySelectorAll(".vcode");

vcodeInputs.forEach((input, idx) => {
  input.addEventListener("input", () => {
    if (input.value.length === 1 && idx < vcodeInputs.length - 1) {
      vcodeInputs[idx + 1].focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && idx > 0) {
      vcodeInputs[idx - 1].focus();
    }
  });
});

function getVerificationCode() {
  let code = "";
  vcodeInputs.forEach((i) => (code += i.value));
  return code;
}

/* ============================
   API BASE
   ============================ */
const API_BASE = "https://project-nqj7.onrender.com/auth";

/* ============================
   REGISTER
   ============================ */
document.getElementById("register-submit").onclick = async () => {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

  if (res.success) {
    popupRegister.classList.remove("active");
    popupVerify.classList.add("active");
    window.currentEmail = email;
  } else {
    alert(res.message || "Erreur lors de l'inscription");
  }
};

/* ============================
   VERIFY EMAIL
   ============================ */
document.getElementById("verify-submit").onclick = async () => {
  const code = getVerificationCode();

  const res = await fetch(`${API_BASE}/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: window.currentEmail, code }),
  }).then((r) => r.json());

  if (res.success) {
    popupVerify.classList.remove("active");
    popupLogin.classList.add("active");
    alert("Email vérifié !");
  } else {
    alert(res.message || "Code invalide ou expiré");
  }
};

/* ============================
   LOGIN
   ============================ */
document.getElementById("login-submit").onclick = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

  if (res.success) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("email", email);

    popupLogin.classList.remove("active");
    showAccountMenu();
  } else if (res.needVerification) {
    popupLogin.classList.remove("active");
    popupVerify.classList.add("active");
    window.currentEmail = email;
  } else {
    alert("Email ou mot de passe incorrect");
  }
};

/* ============================
   ACCOUNT MENU
   ============================ */
const btnLogin = document.getElementById("open-login");
const accountMenu = document.getElementById("account-menu");
const accountDropdown = document.getElementById("account-dropdown");
const accountEmailEl = document.getElementById("account-email");
const logoutBtn = document.getElementById("logout-btn");

function showAccountMenu() {
  if (btnLogin) btnLogin.style.display = "none";
  if (accountMenu) accountMenu.style.display = "block";

  const email = localStorage.getItem("email");
  if (accountEmailEl) accountEmailEl.textContent = email || "";
}

document.getElementById("open-account-menu").onclick = () => {
  accountDropdown.style.display =
    accountDropdown.style.display === "flex" ? "none" : "flex";
};

document.addEventListener("click", (e) => {
  if (
    accountMenu &&
    !accountMenu.contains(e.target) &&
    e.target !== document.getElementById("open-account-menu")
  ) {
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
  if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) return;
  if (!confirm("Dernière confirmation : supprimer définitivement ?")) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Non connecté.");
    return;
  }

  const res = await fetch(`${API_BASE}/delete`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  }).then((r) => r.json());

  if (res.success) {
    alert("Compte supprimé.");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.reload();
  } else {
    alert("Erreur lors de la suppression du compte.");
  }
};

/* ============================
   LANG SWITCH
   ============================ */
const langSwitch = document.getElementById("lang-switch");
const langDropdown = document.getElementById("lang-dropdown");
const langBtn = langSwitch?.querySelector(".lang-btn");

if (langBtn && langDropdown && langSwitch) {
  langBtn.onclick = (e) => {
    e.stopPropagation();
    langDropdown.style.display =
      langDropdown.style.display === "flex" ? "none" : "flex";
  };

  document.addEventListener("click", (e) => {
    if (!langSwitch.contains(e.target)) {
      langDropdown.style.display = "none";
    }
  });

  langDropdown.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => {
      const lang = btn.dataset.lang;
      localStorage.setItem("lang", lang);
      langBtn.innerHTML = `<span class="lang-icon">🌐</span> ${lang.toUpperCase()}`;
      loadLanguage(lang);
    };
  });
}

/* ============================
   LOAD TRANSLATION
   ============================ */
async function loadLanguage(lang) {
  try {
    const res = await fetch(`./lang/${lang}.json`);
    const dict = await res.json();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.innerHTML = dict[key];
    });
  } catch (err) {
    console.error("Erreur chargement langue :", err);
  }
}

/* ============================
   INIT
   ============================ */
window.addEventListener("load", () => {
  const lang = localStorage.getItem("lang") || "fr";
  if (langBtn) {
    langBtn.innerHTML = `<span class="lang-icon">🌐</span> ${lang.toUpperCase()}`;
  }
  loadLanguage(lang);
});

/* ============================
   PROJECTS SLIDER DRAG
   ============================ */
const slider = document.querySelector(".projects-slider");
let isDown = false;
let startX;
let scrollLeft;

if (slider) {
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
}
