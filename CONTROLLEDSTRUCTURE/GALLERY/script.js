/*
===================================
LOAD ENTRIES
===================================
*/

const entries =
  JSON.parse(
    localStorage.getItem(
      'galleryEntries'
    )
  ) || [];

/*
===================================
GRID
===================================
*/

const galleryGrid =
  document.getElementById(
    'gallery-grid'
  );

/*
===================================
RENDER
===================================
*/

entries.forEach(
  entry => {

    /*
      item
    */

    const item =
      document.createElement(
        'div'
      );

    item.classList.add(
      'gallery-item'
    );

    /*
      mini grid
    */

    const miniGrid =
      document.createElement(
        'div'
      );

    miniGrid.classList.add(
      'mini-grid'
    );

    /*
      cubes
    */

    for(let i = 0; i < 28 * 14; i++){

      const cube =
        document.createElement(
          'div'
        );

      cube.classList.add(
        'mini-cube'
      );

      /*
        selected cubes
      */

      if(
        entry.pattern.includes(i)
      ){

        cube.classList.add(
          'active'
        );

      }

      miniGrid.appendChild(
        cube
      );

    }

    /*
      overlay
    */

    const overlay =
      document.createElement(
        'div'
      );

    overlay.classList.add(
      'gallery-overlay'
    );

    overlay.innerHTML = `

      <div class="gallery-name">

        ${entry.name}

      </div>

    `;

    /*
      append
    */

    item.appendChild(
      miniGrid
    );

    item.appendChild(
      overlay
    );

    galleryGrid.appendChild(
      item
    );

  }
);
