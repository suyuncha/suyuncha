/*
===================================
GRID SYSTEM
===================================

CURRENT STATUS
 
- scroll motion active
- hover active
- selection active
- archive not started
- merge system not started
- save system not started

===================================
*/

const grid = document.getElementById('grid');

const cols = 28;
const rows = 15;

const total = cols * rows;

const cubes = [];

const selected = new Set();

/*
-----------------------------------
CREATE GRID
-----------------------------------
*/

for(let i = 0; i < total; i++){

  const cube = document.createElement('div');

  cube.classList.add('cube');

  /*
    random motion values
  */



cube.dataset.speed =
  (Math.random() * 2 + 0.5).toFixed(2);

cube.dataset.phase =
  (Math.random() * Math.PI * 2).toFixed(2);

  grid.appendChild(cube);

  cubes.push(cube);

}

/*
-----------------------------------
INTERACTION
-----------------------------------
*/

cubes.forEach((cube, index) => {

  /*
    hover
  */

  cube.addEventListener('mouseenter', () => {

    cube.classList.add('hovered');

  });

  cube.addEventListener('mouseleave', () => {

    cube.classList.remove('hovered');

  });

  /*
    selection
  */

  cube.addEventListener('click', () => {

    if(selected.has(index)){

      selected.delete(index);

      cube.classList.remove('selected');

    }else{

      selected.add(index);

      cube.classList.add('selected');

    }

  });

});
/*
-----------------------------------
SCROLL MOTION
-----------------------------------
*/

window.addEventListener('scroll', () => {

  const gridSection =
    document.querySelector('.grid-section');

  const rect =
    gridSection.getBoundingClientRect();

  const sectionHeight =
    gridSection.offsetHeight - window.innerHeight;

  /*
    0 → 1
  */

  let progress =
    (-rect.top) / sectionHeight;

  progress =
    Math.max(0, Math.min(progress, 1));

  cubes.forEach((cube, index) => {

    /*
      selected cubes stay fixed
    */

    if(selected.has(index)) return;

    const speed =
      parseFloat(cube.dataset.speed);

    const phase =
      parseFloat(cube.dataset.phase);

    /*
      wave amount
      strongest in middle
    */

    const waveStrength =
      Math.sin(progress * Math.PI);

    /*
      random wave
    */

    const wave =
      Math.sin(
        (progress * 25 * speed) + phase
      );

    /*
      final scale
    */

    const scale =
      1 +
      (wave * 0.18 * waveStrength);

    cube.style.transform =
      `scale(${scale})`;

  });

});
/*
===================================
INTRO SVG SYSTEM
===================================
*/

const introSvgs =
  document.querySelectorAll('.intro-svg');

/*
  fixed rows
*/




/*
  place svg
*/

introSvgs.forEach((svg, index) => {

  /*
    row
  */

  const row =
    rows[index % 4];

  /*
    random x
  */

  const randomX =
    Math.random() * 80;

  /*
    apply position
  */

  svg.style.top =
    `${row}%`;

  svg.style.left =
    `${randomX}%`;

});

/*
===================================
INTRO SVG SYSTEM
===================================
*/

const introSvgs =
  document.querySelectorAll('.intro-svg');

/*
  fixed rows
*/

const rows = [
  12,
  32,
  52,
  72
];

/*
  track positions
*/

const rowPositions = {
  8: [],
  30: [],
  52: [],
  74: []
};

/*
  placement
*/

introSvgs.forEach((svg, index) => {

  /*
    assign row
  */

  const row =
    rows[index % 4];

  /*
    prevent overlap
  */

  let left;
  let safe = false;

  while(!safe){

    left =
      Math.random() * 75;

    safe = true;

    rowPositions[row].forEach(pos => {

      /*
        overlap distance
      */

      if(Math.abs(pos - left) < 18){

        safe = false;

      }

    });

  }

  /*
    save position
  */

  rowPositions[row].push(left);

  /*
    apply
  */

  svg.style.top =
    `${row}%`;

  svg.style.left =
    `${left}%`;

  svg.style.transform =
  'translateY(-50%)';

});

/*
===================================
INTRO MOTION
===================================
*/

window.addEventListener('scroll', () => {

  const scroll =
    window.scrollY;

  introSvgs.forEach((svg, index) => {

    /*
      slight drift
    */

    const drift =
      Math.sin(
        scroll * 0.01 + index
      ) * 20;

    svg.style.transform =
  `translate(${drift}px, -50%)`;
  });

});
