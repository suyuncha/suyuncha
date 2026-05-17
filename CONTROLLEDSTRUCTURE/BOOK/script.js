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

let scrollLock = false;

window.addEventListener(
  'wheel',
  event => {

    /*
      ignore tiny scroll
    */

    if(
      Math.abs(event.deltaY) < 40
    ){
      return;
    }

    /*
      prevent spam
    */

    if(scrollLock) return;

    scrollLock = true;

    clearInterval(autoFlip);

    /*
      direction
    */

    if(event.deltaY > 0){

      nextPage();

    } else {

      previousPage();

    }

    /*
      unlock
    */

    setTimeout(() => {

      scrollLock = false;

    }, 700);

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
