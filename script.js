const COLORS = [
  '#ff3366', '#ff6600', '#00cc66',
  '#3366ff', '#cc00ff', '#ffcc00',
  '#00ccff', '#ff0099'
];

/* ===================================
   CUSTOM CURSOR
   =================================== */

const cursor = document.createElement('div');
cursor.id = 'cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

/* 클릭 가능한 요소 호버 → solid + 랜덤 컬러 (work-title 제외) */
const hoverables = document.querySelectorAll('a, button, .work-tag');

hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    cursor.style.background = color;
    cursor.style.borderColor = color;
    cursor.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.background = 'transparent';
    cursor.style.borderColor = '#1a1a1a';
    cursor.classList.remove('active');
  });
});

/* ===================================
   제목 호버 — 커서랑 텍스트 같은 색
   =================================== */

document.querySelectorAll('.work-title').forEach(el => {
  el.addEventListener('mouseenter', function() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.style.color = color;
    cursor.style.background = color;
    cursor.style.borderColor = color;
    cursor.classList.add('active');
  });
  el.addEventListener('mouseleave', function() {
    this.style.color = '#1a1a1a';
    cursor.style.background = 'transparent';
    cursor.style.borderColor = '#1a1a1a';
    cursor.classList.remove('active');
  });
});

/* 네비 호버 */
document.querySelectorAll('.nav').forEach(el => {
  el.addEventListener('mouseenter', function() {
    this.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  });
  el.addEventListener('mouseleave', function() {
    this.style.color = '#1a1a1a';
  });
});

/* 태그 호버 */
document.querySelectorAll('.work-tag').forEach(el => {
  el.addEventListener('mouseenter', function() {
    this.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.style.opacity = '1';
  });
  el.addEventListener('mouseleave', function() {
    this.style.color = '#1a1a1a';
    this.style.opacity = '0.45';
  });
});

/* 드래그 선택 색 */
document.addEventListener('selectstart', () => {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const style = document.getElementById('selection-style') || document.createElement('style');
  style.id = 'selection-style';
  style.textContent = `::selection { background: ${color}; color: #f5f5f5; }`;
  document.head.appendChild(style);
});

/* ===================================
   LANGUAGE TOGGLE
   =================================== */

let currentLang = 'en';
const langBtn = document.getElementById('lang-btn');
const navAbout = document.getElementById('nav-about');
const navTitle = document.getElementById('nav-title');

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'kr' : 'en';

  if (currentLang === 'kr') {
    langBtn.textContent = 'en';
    navAbout.textContent = '정보';
    navAbout.href = './about/?lang=kr';
    navTitle.textContent = '차수윤';
  } else {
    langBtn.textContent = '한국어';
    navAbout.textContent = 'about';
    navAbout.href = './about/';
    navTitle.textContent = 'suyun cha';
  }

  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = currentLang === 'kr' ? el.dataset.kr : el.dataset.en;
  });
});

/* ===================================
   TAG FILTER
   =================================== */

let activeTag = null;

document.querySelectorAll('.work-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const tagValue = tag.dataset.tag;

    if (activeTag === tagValue) {
      activeTag = null;
      document.querySelectorAll('.work-item').forEach(item => {
        item.classList.remove('dimmed');
      });
      document.querySelectorAll('.work-tag').forEach(t => {
        t.classList.remove('active');
      });
    } else {
      activeTag = tagValue;
      document.querySelectorAll('.work-item').forEach(item => {
        if (item.dataset.tags === tagValue) {
          item.classList.remove('dimmed');
        } else {
          item.classList.add('dimmed');
        }
      });
      document.querySelectorAll('.work-tag').forEach(t => {
        t.classList.toggle('active', t.dataset.tag === tagValue);
      });
    }
  });
});
