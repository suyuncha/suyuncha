/*
===================================
POSTER PREVIEW
===================================
*/

const posters =
  document.querySelectorAll(
    '.poster-item img'
  );

const preview =
  document.querySelector(
    '.poster-preview'
  );

const previewImg =
  preview.querySelector('img');

posters.forEach(poster => {

  poster.addEventListener(
    'mouseenter',
    () => {

      preview.classList.add(
        'active'
      );

      previewImg.src =
        poster.src;

    }
  );

  poster.addEventListener(
    'mouseleave',
    () => {

      preview.classList.remove(
        'active'
      );

    }
  );

});
