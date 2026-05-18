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
  const msg = document.createElement('div');
  msg.className = 'empty-message';
  msg.textContent = 'NO SAVED ENTRIES YET';
  grid.appendChild(msg);
} else {
  const displayCount = Math.max(TOTAL_SLOTS, entries.length);

  for (let i = 0; i < displayCount; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    if (i < entries.length) {
      const entry = entries[i];

      /* 저장된 이미지 표시 */
      if (entry.imageData) {
        const img = document.createElement('img');
        img.src = entry.imageData;
        img.alt = entry.name;
        item.appendChild(img);
      } else if (entry.pattern && entry.pattern.length > 0) {
        /* 구버전 호환: 캔버스로 다시 그리기 */
        const canvas = document.createElement('canvas');
        canvas.width = COLS;
        canvas.height = ROWS;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, COLS, ROWS);
        ctx.fillStyle = '#ffffff';
        entry.pattern.forEach(idx => {
          const col = idx % COLS;
          const row = Math.floor(idx / COLS);
          ctx.fillRect(col, row, 1, 1);
        });
        item.appendChild(canvas);
      } else {
        item.classList.add('empty');
      }

      /* 호버 오버레이 + 이름 */
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      const name = document.createElement('span');
      name.className = 'overlay-name';
      name.textContent = entry.name;
      overlay.appendChild(name);
      item.appendChild(overlay);

    } else {
      /* 빈 슬롯 */
      item.classList.add('empty');
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      item.appendChild(overlay);
    }

    grid.appendChild(item);
  }
}
