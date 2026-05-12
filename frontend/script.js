// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ── HERO IMAGE PARALLAX LOAD ──
const heroBg = document.querySelector('.hero-img');
if (heroBg) {
  const img = new Image();
  img.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80';
  img.onload = () => heroBg.classList.add('loaded');
}

// ── SCROLL TO PROJECTS ──
const scrollBtn = document.getElementById('scroll-to-projects');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    document.getElementById('projets').scrollIntoView({ behavior: 'smooth' });
  });
}

// ── TYPEWRITER IN HERO CODE BLOCK ──
const codeLines = [
  '> init assistant...',
  '> voice.listen()',
  '> model: gpt-4o',
  '> tokens: 1024',
  '> response: "Bonjour!"',
  '> status: ✓ online',
];

const codeTextEl = document.getElementById('code-text');

if (codeTextEl) {
  let lineIndex = 0;
  let charIndex = 0;

  function typeChar() {
    if (lineIndex >= codeLines.length) {
      setTimeout(() => {
        lineIndex = 0;
        charIndex = 0;
        codeTextEl.textContent = '';
        typeChar();
      }, 2000);
      return;
    }

    const currentLine = codeLines[lineIndex];

    if (charIndex <= currentLine.length) {
      const prevLines = codeLines.slice(0, lineIndex).join('\n');
      const current   = currentLine.slice(0, charIndex);
      codeTextEl.textContent = prevLines + (lineIndex > 0 ? '\n' : '') + current;
      charIndex++;
      setTimeout(typeChar, 55);
    } else {
      charIndex = 0;
      lineIndex++;
      setTimeout(typeChar, lineIndex < codeLines.length ? 320 : 1500);
    }
  }

  typeChar();
}

// ── HEADER SCROLL EFFECT ──
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.style.background = 'rgba(13, 15, 14, 0.95)';
  } else {
    header.style.background = 'rgba(13, 15, 14, 0.7)';
  }
}, { passive: true });

// ── POPUP SYSTEM ──
const popupLogin = document.getElementById("popup-login");
const popupRegister = document.getElementById("popup-register");
const popupVerify = document.getElementById("popup-verify");

const openLoginBtn = document.getElementById("open-login");

if (openLoginBtn) {
  openLoginBtn.onclick = () => popupLogin.classList.add("active");
}

document.getElementById("open-register").onclick = () => {
  popupLogin.classList.remove("active");
  popupRegister.classList.add("active");
};

document.getElementById("open-login-from-register").onclick = () => {
  popupRegister.classList.remove("active");
  popupLogin.classList.add("active");
};

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.onclick = () => {
    btn.closest(".login-popup").classList.remove("active");
  };
});

// ── GESTION DES 6 INPUTS DE CODE ──
const vcodeInputs = document.querySelectorAll(".vcode");

if (vcodeInputs.length === 6) {
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
}

function getVerificationCode() {
  let code = "";
  vcodeInputs.forEach(input => {
    code += (input.value || "").trim();
  });
  return code;
}

// ── API BASE URL ──
const API_BASE = "https://project-nqj7.onrender.com/auth";

// ── REGISTER ──
document.getElementById("register-submit").onclick = async () => {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  if (!email || !password) {
    alert("Merci de remplir email et mot de passe.");
    return;
  }

  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(r => r.json()).catch(err => {
    console.error(err);
    return { success: false, message: "Erreur réseau" };
  });

  console.log("REGISTER RESPONSE:", res);

  if (res.success && res.needVerification) {
    popupRegister.classList.remove("active");
    popupVerify.classList.add("active");
    window.currentEmail = email;
  } else {
    alert(res.message || "Erreur lors de l'inscription");
  }
};

// ── VERIFY EMAIL ──
document.getElementById("verify-submit").onclick = async () => {
  const code = getVerificationCode();

  if (code.length !== 6) {
    alert("Merci de saisir les 6 chiffres du code.");
    return;
  }

  const res = await fetch(`${API_BASE}/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: window.currentEmail, code })
  }).then(r => r.json()).catch(err => {
    console.error(err);
    return { success: false, message: "Erreur réseau" };
  });

  console.log("VERIFY RESPONSE:", res);

  if (res.success) {
    popupVerify.classList.remove("active");
    popupLogin.classList.add("active");
    alert("Email vérifié, vous pouvez vous connecter.");
  } else {
    alert(res.message || "Code incorrect ou expiré");
  }
};

// ── LOGIN ──
document.getElementById("login-submit").onclick = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Merci de remplir email et mot de passe.");
    return;
  }

  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(r => r.json()).catch(err => {
    console.error(err);
    return { success: false, message: "Erreur réseau" };
  });

  console.log("LOGIN RESPONSE:", res);

  if (res.success) {
    alert("Connexion réussie !");
    popupLogin.classList.remove("active");
    localStorage.setItem("token", res.token);
    localStorage.setItem("email", email);
    showAccountMenu();
  } else if (res.needVerification) {
    popupLogin.classList.remove("active");
    popupVerify.classList.add("active");
    window.currentEmail = email;
  } else {
    alert("Email ou mot de passe incorrect");
  }
};

// ── ACCOUNT MENU LOGIC ──
const btnLogin = document.getElementById("open-login");
const accountMenu = document.getElementById("account-menu");
const accountDropdown = document.getElementById("account-dropdown");
const accountEmailEl = document.getElementById("account-email");
const openAccountMenuBtn = document.getElementById("open-account-menu");

function showAccountMenu() {
  if (!btnLogin || !accountMenu) return;
  btnLogin.style.display = "none";
  accountMenu.style.display = "block";

  const email = localStorage.getItem("email");
  if (email && accountEmailEl) {
    accountEmailEl.textContent = email;
  }
}

if (openAccountMenuBtn) {
  openAccountMenuBtn.onclick = () => {
    if (accountDropdown.style.display === "flex") {
      accountDropdown.style.display = "none";
    } else {
      accountDropdown.style.display = "flex";
    }
  };
}

// Fermer le menu compte si on clique ailleurs
document.addEventListener("click", (e) => {
  if (!accountMenu.contains(e.target) && e.target !== openAccountMenuBtn) {
    accountDropdown.style.display = "none";
  }
});

// Déconnexion
document.getElementById("logout-btn").onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.reload();
};

// Suppression du compte
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
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(r => r.json()).catch(err => {
    console.error(err);
    return { success: false };
  });

  if (res.success) {
    alert("Compte supprimé.");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.reload();
  } else {
    alert("Erreur lors de la suppression du compte.");
  }
};

// ── INIT : si déjà connecté, afficher menu compte ──
window.addEventListener("load", () => {
  const token = localStorage.getItem("token");
  if (token) {
    showAccountMenu();
  } else {
    if (btnLogin) btnLogin.style.display = "inline-block";
    if (accountMenu) accountMenu.style.display = "none";
  }
});
