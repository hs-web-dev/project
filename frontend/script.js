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

document.getElementById("open-login").onclick = () => popupLogin.classList.add("active");

document.getElementById("open-register").onclick = () => {
  popupLogin.classList.remove("active");
  popupRegister.classList.add("active");
};

document.getElementById("open-login-from-register").onclick = () => {
  popupRegister.classList.remove("active");
  popupLogin.classList.add("active");
};

document.querySelectorAll("[data-close]").forEach