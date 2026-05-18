/* CLOSE → 메인으로 (인트로 스킵) */
document.getElementById('close-btn').addEventListener('click', () => {
  sessionStorage.setItem('skipIntro', 'true');
  window.location.href = '../';
});

/* POSTER HOVER PREVIEW */
const posters = document.querySelectorAll('.poster-item img');
const preview = document.getElementById('poster-preview');
const previewImg = document.getElementById('preview-img');

posters.forEach(poster => {
  poster.addEventListener('mouseenter', () => {
    previewImg.src = poster.src;
    preview.classList.add('active');
    preview.style.pointerEvents = 'auto';
  });
  poster.addEventListener('mouseleave', () => {
    preview.classList.remove('active');
    preview.style.pointerEvents = 'none';
  });
});
