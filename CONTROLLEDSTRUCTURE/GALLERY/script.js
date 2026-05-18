/* CLOSE → 메인으로 (인트로 스킵) */
document.getElementById('close-btn').addEventListener('click', () => {
  sessionStorage.setItem('skipIntro', 'true');
  window.location.href = '../';
});

/* ==============================
   GALLERY LOAD
   ============================== */

const TOTAL_SLOTS = 20;
const COLS = 28;
const ROWS = 14;
const grid = document.getElementById('gallery-grid');

let entries = [];
try {
  entries = JSON.parse(localStorage.getItem('galleryEntries')) || [];
} catch (e) {
  entries = [];
}

if (entries.length === 0) {
  /* 빈 슬롯 20개 표시 */
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item empty';
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    item.appendChild(overlay);
    grid.appendChild(item);
  }
} else {
  const displayCount = Math.max(TOTAL_SLOTS, entries.length);

  for (let i = 0; i < displayCount; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    if (i < entries.length) {
      const entry = entries[i];

      if (entry.imageData) {
        const img = document.createElement('img');
        img.src = entry.imageData;
        img.alt = entry.name;
        item.appendChild(img);
      } else if (entry.pattern && entry.pattern.length > 0) {
        /* 구버전 호환 */
        const canvas = document.createElement('canvas');
        canvas.width = COLS;
        canvas.height = ROWS;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, COLS, ROWS);
        ctx.fillStyle = '#ffffff';
        entry.pattern.forEach(idx => {
          ctx.fillRect(idx % COLS, Math.floor(idx / COLS), 1, 1);
        });
        item.appendChild(canvas);
      } else {
        item.classList.add('empty');
      }

      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      const name = document.createElement('span');
      name.className = 'overlay-name';
      name.textContent = entry.name;
      overlay.appendChild(name);
      item.appendChild(overlay);

    } else {
      item.classList.add('empty');
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      item.appendChild(overlay);
    }

    grid.appendChild(item);
  }
}
