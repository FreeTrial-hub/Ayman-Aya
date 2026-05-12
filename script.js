// ===== Preloader (video) =====
(function () {
  const pre = document.getElementById('preloader');
  const vid = document.getElementById('preloader-vid');
  const cta = document.getElementById('preloader-cta');
  const poster = document.getElementById('preloader-poster');
  if (!pre || !vid) return;

  let started = false;

  // Pre-buffer the video as soon as possible
  vid.load();

  function dismissPreloader() {
    pre.classList.add('hidden');
  }

  function startVideo() {
    if (started) return;
    started = true;
    if (cta) {
      cta.classList.add('preloader-cta--gone');
    }
    if (poster) {
      poster.classList.add('preloader-poster--hidden');
    }
    vid.muted = false;
    vid.volume = 1;
    vid.play().catch(() => { vid.muted = true; vid.play(); });
  }

  vid.addEventListener('ended', dismissPreloader);
  vid.addEventListener('error', dismissPreloader);

  // First click/tap hides poster and starts playback (guarded so click+touchend both work once)
  pre.addEventListener('click', startVideo);
  pre.addEventListener('touchend', () => { startVideo(); }, { passive: true });
})();


// ===== Particles =====
function spawnParticles(container) {
  const count = parseInt(container.dataset.particles || '20', 10);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 1 + Math.random() * 3;
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
    p.style.animationDuration = (5 + Math.random() * 7).toFixed(2) + 's';
    p.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
    container.appendChild(p);
  }
}
document.querySelectorAll('[data-particles]').forEach(spawnParticles);

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ===== Parallax backgrounds =====
const parallaxEls = document.querySelectorAll('[data-parallax="bg"]');
function updateParallax() {
  parallaxEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - vh / 2) / vh));
    const scale = 1 + (1 - Math.abs(progress)) * 0.12;
    const y = progress * 60;
    el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
  });
}
window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('resize', updateParallax);
updateParallax();

// ===== Countdown =====
const TARGET = new Date('2026-09-19T17:00:00').getTime();
function pad(n) { return String(n).padStart(2, '0'); }
function tick() {
  const now = Date.now();
  let diff = Math.max(0, TARGET - now);
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);    diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  const set = (k, v) => { const el = document.querySelector(`[data-cd="${k}"]`); if (el) el.textContent = pad(v); };
  set('d', d); set('h', h); set('m', m); set('s', s);
}
tick();
setInterval(tick, 1000);
