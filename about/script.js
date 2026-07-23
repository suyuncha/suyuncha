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

/* 클릭 가능한 요소 호버 */
document.querySelectorAll('a').forEach(el => {
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

/* 호버 컬러 */
const clickables = document.querySelectorAll('.name, .links a');
clickables.forEach(el => {
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

const urlParams = new URLSearchParams(window.location.search);
const label = document.getElementById('label');
const desc = document.getElementById('desc');

const EN = {
  label: 'about',
  desc: `I'm a Korean and London-based graphic designer<br>currently studying BA Graphic Communication Design at Central Saint Martins.<br>Interested in typography, visual systems, and interactive design.`
};

const KR = {
  label: '정보',
  desc: `저는 한국과 런던을 기반으로 활동하는 그래픽 디자이너로,<br>현재 센트럴 세인트 마틴스에서 BA 그래픽 커뮤니케이션 디자인을 공부하고 있습니다.<br>타이포그래피, 비주얼 시스템, 인터랙티브 디자인에 관심이 있습니다.`
};

if (urlParams.get('lang') === 'kr') {
  label.textContent = KR.label;
  desc.innerHTML = KR.desc;
}
