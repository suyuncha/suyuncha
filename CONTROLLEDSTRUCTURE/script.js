/* ===================================
   INTRO SKIP
   =================================== */

window.addEventListener('load', () => {
  if (sessionStorage.getItem('skipIntro') === 'true') {
    sessionStorage.removeItem('skipIntro');
    const main = document.getElementById('main');
    if (main) {
      window.scrollTo({ top: main.offsetTop, behavior: 'instant' });
    }
  }
});

/* ===================================
   INTRO LANE SYSTEM
   =================================== */

const svgFiles = [
  'REPEATF.svg', 'A2F.svg', 'B5F.svg', 'C1F.svg',
  'CONTROLF.svg', 'E2F.svg', 'E3F.svg', 'E4F.svg',
  'E5F.svg', 'I3F.svg', 'I5F.svg', 'L1F.svg',
  'N1F.svg', 'N3F.svg', 'N5F.svg', 'O1F.svg',
  'O3F.svg', 'O5F.svg', 'OBSESSIONF.svg', 'P2F.svg',
  'P4F.svg', 'PRESSF.svg', 'R1F.svg', 'R2F.svg',
  'R4F.svg', 'S3F.svg', 'S4F.svg', 'S5F.svg',
  'T1F.svg', 'T2F.svg', 'T3F.svg', 'TENSIONF.svg'
];

const lanes = document.querySelectorAll('.lane');

lanes.forEach((lane) => {
  const shuffled = [...svgFiles].sort(() => Math.random() - 0.5);
  shuffled.forEach(file => {
    const img = document.createElement('img');
    img.src = file;
    lane.appendChild(img);
  });
  shuffled.forEach(file => {
    const img = document.createElement('img');
    img.src = file;
    lane.appendChild(img);
  });
  lane.dataset.offset = Math.random() * -1200;
});

/* ===================================
   INTRO LANE ANIMATION
   =================================== */

let autoMove = 0;
const intro = document.getElementById('intro');

function animateLanes() {
  autoMove += 0.9;
  const scroll = window.scrollY;
  const fade = 1 - (scroll / window.innerHeight);
  intro.style.opacity = Math.max(fade, 0);

  lanes.forEach((lane, index) => {
    const speed = 0.12 + (index * 0.04);
    const offset = parseFloat(lane.dataset.offset);
    const move = offset - autoMove - (scroll * speed);
    lane.style.transform = `translateX(${move}px)`;
  });

  requestAnimationFrame(animateLanes);
}

animateLanes();

/* ===================================
   AUTO SCROLL TO MAIN (1회만)
   =================================== */

let autoScrollDone = false;
setTimeout(() => {
  if (!autoScrollDone && window.scrollY < 10) {
    autoScrollDone = true;
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }
}, 4200);

/* ===================================
   GRID SETUP
   =================================== */

const COLS = 28;
const ROWS = 15;

const waveGrid = document.getElementById('wave-grid');
const selectionGrid = document.getElementById('selection-grid');
const saveUI = document.getElementById('save-ui');

const waveCubes = [];
const selectionCubes = [];
const selected = new Set();

/* WAVE GRID: 28 × 15 */
for (let i = 0; i < COLS * ROWS; i++) {
  const cube = document.createElement('div');
  cube.classList.add('cube');
  cube.dataset.speed = (Math.random() * 2 + 0.5).toFixed(2);
  cube.dataset.phase = (Math.random() * Math.PI * 2).toFixed(2);
  waveGrid.appendChild(cube);
  waveCubes.push(cube);
}

/* SELECTION GRID: 28 × 15 */
for (let i = 0; i < COLS * ROWS; i++) {
  const cube = document.createElement('div');
  cube.classList.add('cube');
  selectionGrid.appendChild(cube);
  selectionCubes.push(cube);
}

/* ===================================
   SELECTION CLICK
   =================================== */

selectionCubes.forEach((cube, index) => {
  cube.addEventListener('click', () => {
    if (selected.has(index)) {
      selected.delete(index);
      cube.classList.remove('selected');
    } else {
      selected.add(index);
      cube.classList.add('selected');
    }
  });
});

/* ===================================
   SCROLL HANDLER
   - 웨이브 모션
   - wave → selection 전환
   - save UI 표시
   =================================== */

window.addEventListener('scroll', () => {
  const gridSection = document.getElementById('grid-section');
  const rect = gridSection.getBoundingClientRect();

  /* grid-section 전체 스크롤 가능 높이 */
  const totalScroll = gridSection.offsetHeight - window.innerHeight;

  /* 0 ~ 1 전체 진행도 */
  let totalProgress = (-rect.top) / totalScroll;
  totalProgress = Math.max(0, Math.min(totalProgress, 1));

  /* 웨이브 구간: 0 ~ 0.79 (380/480)
     셀렉션 구간: 0.79 ~ 1.0  (100/480) */
  const waveEnd = 380 / 480;

  /* ===================================
     WAVE MOTION
     =================================== */

  /* 웨이브 구간 내 진행도 0~1 */
  let waveProgress = totalProgress / waveEnd;
  waveProgress = Math.max(0, Math.min(waveProgress, 1));

  waveCubes.forEach(cube => {
    const speed = parseFloat(cube.dataset.speed);
    const phase = parseFloat(cube.dataset.phase);
    const waveStrength = Math.sin(waveProgress * Math.PI);
    const wave = Math.sin((waveProgress * 25 * speed) + phase);
    const scale = 1 + (wave * 0.18 * waveStrength);
    cube.style.transform = `scale(${scale})`;
  });

  /* ===================================
     WAVE → SELECTION 전환
     웨이브 끝 구간에서 크로스페이드
     =================================== */

  /* 전환 구간: waveEnd 기준 앞뒤 5% */
  const fadeStart = waveEnd - 0.05;
  const fadeEnd = waveEnd + 0.05;

  let selectionOpacity = 0;
  if (totalProgress >= fadeEnd) {
    selectionOpacity = 1;
  } else if (totalProgress >= fadeStart) {
    selectionOpacity = (totalProgress - fadeStart) / (fadeEnd - fadeStart);
  }

  waveGrid.style.opacity = 1 - selectionOpacity;
  selectionGrid.style.opacity = selectionOpacity;

  if (selectionOpacity > 0.5) {
    selectionGrid.classList.add('active');
  } else {
    selectionGrid.classList.remove('active');
  }

  /* ===================================
     SAVE UI — 맨 아래 근접 시만 표시
     =================================== */

  const scrollBottom = window.scrollY + window.innerHeight;
  const pageHeight = document.body.scrollHeight;
  const nearBottom = scrollBottom >= pageHeight - 80;

  if (nearBottom) {
    saveUI.classList.add('visible');
  } else {
    saveUI.classList.remove('visible');
  }
});

/* ===================================
   SAVE BUTTON
   =================================== */

const nameInput = document.getElementById('name-input');
const saveBtn = document.getElementById('save-btn');
const upBtn = document.getElementById('up-btn');

saveBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  const pattern = [...selected];

  const canvas = document.createElement('canvas');
  canvas.width = COLS;
  canvas.height = ROWS;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, COLS, ROWS);
  ctx.fillStyle = '#ffffff';
  pattern.forEach(idx => {
    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    ctx.fillRect(col, row, 1, 1);
  });

  const imageData = canvas.toDataURL('image/png');

  let existing = [];
  try {
    existing = JSON.parse(localStorage.getItem('galleryEntries')) || [];
  } catch (e) {
    existing = [];
  }

  existing.unshift({ name, pattern, imageData, timestamp: Date.now() });
  if (existing.length > 100) existing = existing.slice(0, 100);
  localStorage.setItem('galleryEntries', JSON.stringify(existing));

  saveBtn.textContent = 'SAVED';
  setTimeout(() => { saveBtn.textContent = 'SAVE'; }, 1500);

  nameInput.value = '';
  selected.clear();
  selectionCubes.forEach(c => c.classList.remove('selected'));
});

/* ===================================
   UP BUTTON → 인트로로
   =================================== */

upBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
