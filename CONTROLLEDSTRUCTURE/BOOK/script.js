/*
===================================
BOOK SYSTEM
===================================
*/

const bookPage =
  document.getElementById(
    'book-page'
  );

/*
-----------------------------------
TOTAL PAGES
-----------------------------------
*/

const totalPages = 22;

/*
-----------------------------------
CURRENT PAGE
-----------------------------------
*/

let currentPage = 1;

/*
-----------------------------------
CHANGE PAGE
-----------------------------------
*/

function updatePage(){

  /*
    fade out
  */

  bookPage.style.opacity = 0;

  setTimeout(() => {

    /*
      update image
    */

    const pageNumber =
      String(currentPage)
      .padStart(2, '0');

    bookPage.src =
      `page${pageNumber}.jpg`;

    /*
      fade in
    */

    bookPage.style.opacity = 1;

  }, 180);

}

/*
-----------------------------------
NEXT PAGE
-----------------------------------
*/

function nextPage(){

  currentPage++;

  if(currentPage > totalPages){

    currentPage = 1;

  }

  updatePage();

}

/*
-----------------------------------
PREVIOUS PAGE
-----------------------------------
*/

function previousPage(){

  currentPage--;

  if(currentPage < 1){

    currentPage = totalPages;

  }

  updatePage();

}

/*
===================================
AUTO PLAY
===================================
*/

let autoFlip =
  setInterval(nextPage, 4000);

/*
===================================
CLICK
===================================
*/

bookPage.addEventListener(
  'click',
  nextPage
);

/*
===================================
SCROLL
===================================
*/

window.addEventListener(
  'wheel',
  event => {

    clearInterval(autoFlip);

    if(event.deltaY > 0){

      nextPage();

    } else {

      previousPage();

    }

    /*
      restart autoplay
    */

    autoFlip =
      setInterval(
        nextPage,
        4000
      );

  }
);
