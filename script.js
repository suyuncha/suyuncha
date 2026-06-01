const COLORS = [
  '#ff3366', '#ff6600', '#00cc66',
  '#3366ff', '#cc00ff', '#ffcc00',
  '#00ccff', '#ff0099'
];

const clickables = document.querySelectorAll('.nav, .work-link');

clickables.forEach(el => {
  el.addEventListener('mouseenter', function() {
    this.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  });
  el.addEventListener('mouseleave', function() {
    this.style.color = '#1a1a1a';
  });
});

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
    navAbout.href = './ABOUT/?lang=kr';
    navTitle.textContent = '차수윤';
  } else {
    langBtn.textContent = '한국어';
    navAbout.textContent = 'about';
    navAbout.href = './ABOUT/';
    navTitle.textContent = 'suyun cha';
  }

  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = currentLang === 'kr' ? el.dataset.kr : el.dataset.en;
  });
});
