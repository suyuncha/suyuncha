/* CLOSE → 메인으로 (인트로 스킵) */
document.getElementById('close-btn').addEventListener('click', () => {
  sessionStorage.setItem('skipIntro', 'true');
  window.location.href = '../';
});

/* ==============================
   BOOK SYSTEM
   ============================== */

const bookPage = document.getElementById('book-page');
const pageCounter = document.getElementById('page-counter');
const TOTAL_PAGES = 22;
let currentPage = 1;
let isAnimating = false;

function updatePage(dir) {
  if (isAnimating) return;
  isAnimating = true;

  bookPage.style.opacity = '0';

  setTimeout(() => {
    if (dir === 'next') {
      currentPage = currentPage >= TOTAL_PAGES ? 1 : currentPage + 1;
    } else {
      currentPage = currentPage <= 1 ? TOTAL_PAGES : currentPage - 1;
    }

    const num = String(currentPage).padStart(2, '0');
    bookPage.src = `page${num}.jpg`;
    pageCounter.textContent = `${num} / ${TOTAL_PAGES}`;

    bookPage.style.opacity = '1';
    setTimeout(() => { isAnimating = false; }, 100);
  }, 220);
}

/* CLICK → 다음 페이지 */
bookPage.addEventListener('click', () => updatePage('next'));

/* SCROLL → 다음/이전 페이지 */
let scrollCooldown = false;
window.addEventListener('wheel', (e) => {
  if (scrollCooldown) return;
  scrollCooldown = true;
  updatePage(e.deltaY > 0 ? 'next' : 'prev');
  setTimeout(() => { scrollCooldown = false; }, 600);
}, { passive: true });

/* AUTO FLIP */
let autoTimer = setInterval(() => updatePage('next'), 4500);

/* 클릭/스크롤 시 자동 타이머 리셋 */
function resetAutoTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => updatePage('next'), 4500);
}

bookPage.addEventListener('click', resetAutoTimer);
window.addEventListener('wheel', resetAutoTimer, { passive: true });
