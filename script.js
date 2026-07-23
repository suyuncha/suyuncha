const COLORS = [
  '#ff3366', '#ff6600', '#00cc66',
  '#3366ff', '#cc00ff', '#ffcc00',
  '#00ccff', '#ff0099'
];

/* 제목 호버 — 색 변경 (opacity 아님) */
document.querySelectorAll('.work-title').forEach(el => {
  el.addEventListener('mouseenter', function() {
    this.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  });
  el.addEventListener('mouseleave', function() {
    this.style.color = '#1a1a1a';
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
      /* 같은 태그 다시 클릭 → 필터 해제 */
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
