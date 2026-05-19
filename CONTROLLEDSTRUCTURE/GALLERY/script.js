/* CLOSE → 메인으로 (인트로 스킵) */
document.getElementById('close-btn').addEventListener('click', () => {
  sessionStorage.setItem('skipIntro', 'true');
  window.location.href = '../';
});

/* ==============================
   SUPABASE CONFIG
   ============================== */

const SUPABASE_URL = 'https://xywklnymeunwfmwrlcgx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d2tsbnltZXVud2Ztd3JsY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzc2ODMsImV4cCI6MjA5NDcxMzY4M30.a8q3vj7f9Azt_VSq55Fd2qC9lSbni8ccLWnhDciRxdU';

const COLS = 28;
const ROWS = 15;
const grid = document.getElementById('gallery-grid');

/* ==============================
   GALLERY LOAD
   ============================== */

async function loadGallery() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/gallery?select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const entries = await response.json();

    if (!entries || entries.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'empty-message';
      msg.textContent = 'NO SAVED ENTRIES YET';
      grid.appendChild(msg);
      return;
    }

    entries.forEach(entry => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      if (entry.image_data) {
        const img = document.createElement('img');
        img.src = entry.image_data;
        img.alt = entry.name;
        item.appendChild(img);
      } else if (entry.pattern) {
        const pattern = JSON.parse(entry.pattern);
        const canvas = document.createElement('canvas');
        canvas.width = COLS;
        canvas.height = ROWS;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, COLS, ROWS);
        ctx.fillStyle = '#ffffff';
        pattern.forEach(idx => {
          ctx.fillRect(idx % COLS, Math.floor(idx / COLS), 1, 1);
        });
        item.appendChild(canvas);
      }

      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      const name = document.createElement('span');
      name.className = 'overlay-name';
      name.textContent = entry.name;
      overlay.appendChild(name);
      item.appendChild(overlay);

      grid.appendChild(item);
    });

  } catch (e) {
    const msg = document.createElement('div');
    msg.className = 'empty-message';
    msg.textContent = 'FAILED TO LOAD';
    grid.appendChild(msg);
  }
}

loadGallery();
