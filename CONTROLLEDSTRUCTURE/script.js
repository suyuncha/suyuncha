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
INTRO LANE SYSTEM
===================================
*/

const svgFiles = [

  'REPEATF.svg',
  'A2F.svg',
  'B5F.svg',
  'C1F.svg',
  'CONTROLF.svg',
  'E2F.svg',
  'E3F.svg',
  'E4F.svg',
  'E5F.svg',
  'I3F.svg',
  'I5F.svg',
  'L1F.svg',
  'N1F.svg',
  'N3F.svg',
  'N5F.svg',
  'O1F.svg',
  'O3F.svg',
  'O5F.svg',
  'OBSESSIONF.svg',
  'P2F.svg',
  'P4F.svg',
  'PRESSF.svg',
  'R1F.svg',
  'R2F.svg',
  'R4F.svg',
  'S3F.svg',
  'S4F.svg',
  'S5F.svg',
  'T1F.svg',
  'T2F.svg',
  'T3F.svg',
  'TENSIONF.svg'

];

const lanes =
  document.querySelectorAll('.lane');

/*
===================================
FILL LANES
===================================
*/

lanes.forEach((lane, index) => {

  /*
    random order
  */

  const shuffled =
    [...svgFiles].sort(() =>
      Math.random() - 0.5
    );

  /*
    fill lane
  */

  shuffled.forEach(file => {

    const img =
      document.createElement('img');

    img.src = file;

    lane.appendChild(img);

  });

  /*
    duplicate for long scroll
  */

  shuffled.forEach(file => {

    const img =
      document.createElement('img');

    img.src = file;

    lane.appendChild(img);

  });

  /*
    random starting point
  */

  const randomOffset =
    Math.random() * -1200;

  lane.dataset.offset =
    randomOffset;

});

/*
===================================
AUTO MOTION
===================================
*/

let autoMove = 0;

function animateLanes(){

  /*
    constant motion
  */

  autoMove += 0.9;

  /*
    scroll influence
  */

  const scroll =
    window.scrollY;

  lanes.forEach((lane, index) => {

/*
-----------------------------------
intro fade by scroll
-----------------------------------
*/

const intro =
  document.querySelector('.intro');

const fade =
  1 - (scroll / window.innerHeight);

intro.style.opacity =
  Math.max(fade, 0);


    /*
      different speed
    */

    const speed =
      0.12 + (index * 0.04);

    /*
      saved offset
    */

    const offset =
      parseFloat(
        lane.dataset.offset
      );

    /*
      total movement
    */

    const move =
      offset - autoMove - (scroll * speed);

    /*
      apply
    */

    lane.style.transform =
      `translateX(${move}px)`;

  });

  requestAnimationFrame(
    animateLanes
  );

}

animateLanes();

/*
===================================
AUTO SCROLL TO MAIN
===================================
*/

setTimeout(() => {



  /*
    scroll
  */

  setTimeout(() => {

    window.scrollTo({

      top:window.innerHeight,

      behavior:'smooth'

    });

  }, 1200);

}, 3000);
