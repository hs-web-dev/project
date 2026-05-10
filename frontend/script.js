/* ==============================
   H.Tech — script.js
   ============================== */

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
  // Trigger slow-zoom animation once image is loaded
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
      // Restart after pause
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


// ── STAGGERED CARD ENTRANCE ──
const projectCards = document.querySelectorAll('.project-card');

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 120);
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

projectCards.forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, background 0.4s';
  cardObserver.observe(card);
});


// ── STAT NUMBER COUNT-UP ──
const statNums = document.querySelectorAll('.stat-num');

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const raw = el.textContent.trim();

        // Only animate pure numbers (skip "∞" or symbols)
        const num = parseInt(raw, 10);
        if (isNaN(num)) return;

        const suffix = raw.replace(String(num), '');
        let current  = 0;
        const step   = Math.ceil(num / 30);

        const tick = setInterval(() => {
          current += step;
          if (current >= num) {
            current = num;
            clearInterval(tick);
          }
          el.textContent = current + suffix;
        }, 40);

        countObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach((el) => countObserver.observe(el));

// ── POPUP LOGIN ──
const loginPopup = document.getElementById("login-popup");
const openLogin = document.getElementById("open-login");
const closeLogin = document.getElementById("close-login");

openLogin.addEventListener("click", () => {
  loginPopup.classList.add("active");
});

closeLogin.addEventListener("click", () => {
  loginPopup.classList.remove("active");
});

loginPopup.addEventListener("click", (e) => {
  if (e.target === loginPopup) loginPopup.classList.remove("active");
});
