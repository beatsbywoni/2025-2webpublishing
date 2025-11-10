/* =========================================================
   app.js (로컬 경로 수정 버전)
   ========================================================= */

(() => {
  const bg = document.getElementById('bg-cycler');
  const cards = Array.from(document.querySelectorAll('.card-hit'));

  const overlay = document.getElementById('alt-overlay');
  const overlayImg = document.getElementById('alt-image');
  const overlayCaption = document.getElementById('alt-caption');
  const overlayCloseBtn = overlay.querySelector('.alt-close');

  /* -----------------------------
     Background cycler
     ----------------------------- */
  const BG_1 = 'bg-1';
  const BG_2 = 'bg-2';
  let currentBg = BG_1;
  let idleTimer = null;
  let cycleInterval = null;
  const IDLE_DELAY = 5000;
  const CYCLE_DELAY = 5000;

  setBackground(BG_1);
  startIdleTimer();

  function setBackground(target) {
    if (!bg) return;
    if (target === currentBg) return;
    bg.classList.remove(BG_1, BG_2);
    bg.classList.add(target);
    currentBg = target;
  }

  function toggleBackground() {
    setBackground(currentBg === BG_1 ? BG_2 : BG_1);
  }

  function startIdleTimer() {
    stopCycleInterval();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      setBackground(BG_2);
      startCycleInterval();
    }, IDLE_DELAY);
  }

  function startCycleInterval() {
    stopCycleInterval();
    cycleInterval = setInterval(toggleBackground, CYCLE_DELAY);
  }

  function stopCycleInterval() {
    if (cycleInterval) {
      clearInterval(cycleInterval);
      cycleInterval = null;
    }
  }

  function markUserActive() {
    clearTimeout(idleTimer);
    stopCycleInterval();
    startIdleTimer();
  }

  ['click', 'keydown', 'touchstart'].forEach(evt =>
    window.addEventListener(evt, markUserActive, { passive: true })
  );

  let mmPending = false;
  window.addEventListener('mousemove', () => {
    if (mmPending) return;
    mmPending = true;
    requestAnimationFrame(() => {
      markUserActive();
      mmPending = false;
    });
  }, { passive: true });

  /* -----------------------------
     Card click → alt image overlay
     ----------------------------- */
  let autoCloseTimer = null;

  cards.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetBg = btn.dataset.bg === '2' ? BG_2 : BG_1;
      setBackground(targetBg);

      const altSrc = btn.dataset.alt;
      if (overlayImg && altSrc) {
        overlayImg.src = altSrc;
        overlayImg.alt = btn.getAttribute('aria-label') || '대체 이미지 미리보기';
        const title = btn.querySelector('.card-title');
        overlayCaption.textContent = (title && title.textContent) ? `${title.textContent} · Alternate` : '';
        openOverlay();

        clearTimeout(autoCloseTimer);
        autoCloseTimer = setTimeout(closeOverlay, 5000);
      }

      markUserActive();
    });
  });

  function openOverlay() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
    document.documentElement.style.overflow = '';
  }

  overlayCloseBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeOverlay();
    }
  });

  /* -----------------------------
     Preload images (로컬용 경로)
     ----------------------------- */
  preload([
    'assets/Background1.png',
    'assets/Background2.jpg',
    'assets/img1-1.jpg',
    'assets/img2-2.jpg',
    'assets/img3-3.jpg'
  ]);

  function preload(srcList) {
    srcList.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
})();
