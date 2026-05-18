/* ===================================
   INTRO SKIP
   POSTER / BOOK / ABOUT / GALLERY에서
   닫기 버튼 누르면 sessionStorage에
   'skipIntro' 플래그를 남기고 돌아옴.
   여기서 감지해서 인트로 건너뜀.
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

/* ===================================
   FILL LANES
   =================================== */

lanes.forEach((lane) => {
  const shuffled = [...svgFiles].sort(() => Math.random() - 0.5);

  /* 두 번 채워서 루프 가능하게 */
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
   AUTO MOTION (INTRO LANES)
   =================================== */

let autoMove = 0;
const intro = document.getElementById('intro');

function animateLanes() {
  autoMove += 0.9;

  const scroll = window.scrollY;

  /* 인트로 페이드 */
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
   AUTO SCROLL TO MAIN
   (인트로 후 1회만 실행, 이후 재발동 없음)
   =================================== */

let autoScrollDone = false;

setTimeout(() => {
  if (!autoScrollDone && window.scrollY < 10) {
    autoScrollDone = true;
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
}, 4200);

/* ===================================
   GRID SETTINGS
   =================================== */

const COLS = 28;
const WAVE_ROWS = 15;
const SEL_ROWS = 14;

const waveGrid = document.getElementById('wave-grid');
const selectionGrid = document.getElementById('selection-grid');

const waveCubes = [];
const selectionCubes = [];
const selected = new Set();

/* ===================================
   CREATE WAVE GRID (28 × 15 = 420)
   =================================== */

for (let i = 0; i < COLS * WAVE_ROWS; i++) {
  const cube = document.createElement('div');
  cube.classList.add('cube');
  cube.dataset.speed = (Math.random() * 2 + 0.5).toFixed(2);
  cube.dataset.phase = (Math.random() * Math.PI * 2).toFixed(2);
  waveGrid.appendChild(cube);
  waveCubes.push(cube);
}

/* ===================================
   CREATE SELECTION GRID (28 × 14 = 392)
   =================================== */

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
   WAVE MOTION (scroll-driven)
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
});

/* ===================================
   SAVE SYSTEM
   갤러리에 저장: localStorage 키 'galleryEntries'
   갤러리 페이지(gallery.js)에서 읽어서 표시
   =================================== */

const nameInput = document.getElementById('name-input');
const saveBtn = document.getElementById('save-btn');
const upBtn = document.getElementById('up-btn');

/* -----------------------------------
   SAVE
   ----------------------------------- */

saveBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  /* 현재 선택된 큐브 인덱스 저장 */
  const pattern = [...selected];

  /* 캔버스로 스냅샷 생성 (28×14 grid → 작은 이미지) */
  const canvas = document.createElement('canvas');
  canvas.width = COLS;
  canvas.height = SEL_ROWS;
  const ctx = canvas.getContext('2d');

  /* 검정 배경 */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, COLS, SEL_ROWS);

  /* 선택된 큐브 = 흰 픽셀 */
  ctx.fillStyle = '#ffffff';
  pattern.forEach(idx => {
    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    ctx.fillRect(col, row, 1, 1);
  });

  const imageData = canvas.toDataURL('image/png');

  /* 기존 항목 불러오기 */
  let existing = [];
  try {
    existing = JSON.parse(localStorage.getItem('galleryEntries')) || [];
  } catch (e) {
    existing = [];
  }

  /* 새 항목 추가 (최신 순) */
  existing.unshift({ name, pattern, imageData, timestamp: Date.now() });

  /* 최대 100개 유지 */
  if (existing.length > 100) existing = existing.slice(0, 100);

  localStorage.setItem('galleryEntries', JSON.stringify(existing));

  /* 피드백: 버튼 텍스트 잠깐 변경 */
  saveBtn.textContent = 'SAVED';
  setTimeout(() => { saveBtn.textContent = 'SAVE'; }, 1500);

  /* 입력 초기화, 선택 초기화 */
  nameInput.value = '';
  selected.clear();
  selectionCubes.forEach(c => c.classList.remove('selected'));
});

/* -----------------------------------
   UP → 메인 섹션으로 (인트로 스킵)
   ----------------------------------- */

upBtn.addEventListener('click', () => {
  const main = document.getElementById('main');
  const mainTop = main.offsetTop;

  /* 인트로(100vh) 건너뛰고 메인 위치로 */
  window.scrollTo({
    top: mainTop,
    behavior: 'smooth'
  });
});
