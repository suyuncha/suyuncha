/* ===================================
   INTRO SKIP
   다른 페이지 X버튼 → sessionStorage
   여기서 감지 → 인트로 건너뛰고 메인으로
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
const WAVE_ROWS = 15;
const SEL_ROWS = 14;

const waveGrid = document.getElementById('wave-grid');
const selectionGrid = document.getElementById('selection-grid');

const waveCubes = [];
const selectionCubes = [];
const selected = new Set();

/* WAVE GRID: 28 × 15 */
for (let i = 0; i < COLS * WAVE_ROWS; i++) {
  const cube = document.createElement('div');
  cube.classList.add('cube');
  cube.dataset.speed = (Math.random() * 2 + 0.5).toFixed(2);
  cube.dataset.phase = (Math.random() * Math.PI * 2).toFixed(2);
  waveGrid.appendChild(cube);
  waveCubes.push(cube);
}

/* SELECTION GRID: 28 × 14 */
for (let i = 0; i < COLS * SEL_ROWS; i++) {
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
   WAVE MOTION
   =================================== */

window.addEventListener('scroll', () => {
  const waveSection = document.getElementById('wave-section');
  const rect = waveSection.getBoundingClientRect();
  const sectionHeight = waveSection.offsetHeight - window.innerHeight;

  let progress = (-rect.top) / sectionHeight;
  progress = Math.max(0, Math.min(progress, 1));

  waveCubes.forEach(cube => {
    const speed = parseFloat(cube.dataset.speed);
    const phase = parseFloat(cube.dataset.phase);
    const waveStrength = Math.sin(progress * Math.PI);
    const wave = Math.sin((progress * 25 * speed) + phase);
    const scale = 1 + (wave * 0.18 * waveStrength);
    cube.style.transform = `scale(${scale})`;
  });

  /* ===================================
     SAVE UI 표시/숨김
     selection section이 뷰포트에 들어올 때만
     =================================== */
  const selSection = document.getElementById('selection-section');
  const selRect = selSection.getBoundingClientRect();
  const saveUI = document.getElementById('save-ui');

  if (selRect.top < window.innerHeight && selRect.bottom > 0) {
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

  /* 28×14 픽셀 캔버스로 이미지 생성 */
  const canvas = document.createElement('canvas');
  canvas.width = COLS;
  canvas.height = SEL_ROWS;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, COLS, SEL_ROWS);
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

  /* 저장 피드백 */
  saveBtn.textContent = 'SAVED';
  setTimeout(() => { saveBtn.textContent = 'SAVE'; }, 1500);

  nameInput.value = '';
  selected.clear();
  selectionCubes.forEach(c => c.classList.remove('selected'));
});

/* ===================================
   UP BUTTON → 메인으로 (인트로 스킵)
   =================================== */

upBtn.addEventListener('click', () => {
  const main = document.getElementById('main');
  window.scrollTo({ top: main.offsetTop, behavior: 'smooth' });
});
