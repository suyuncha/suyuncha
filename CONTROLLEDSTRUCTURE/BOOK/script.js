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
AUTO FLIP
===================================
*/

setInterval(() => {

  nextPage();

}, 4500);
