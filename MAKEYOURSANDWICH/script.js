/* =========================
   SETTINGS
========================= */
const INGREDIENTS = [
  "baguette","ciabatta","focaccia","brioche","sourdough",
  "butter","olive oil","mayo","mustard","pesto","honey",
  "cheddar","brie","mozzarella","cream cheese",
  "tomato","cucumber","romaine","lettuce","apple","mushroom","pepper","onion","grilled onion",
  "bacon","salami","pastrami","prosciutto","mortadella","jambon",
  "strawberry jam","raspberry jam","blueberry jam","marmalade","fig","peanut butter","chilli flake","balsamic","chicken","egg","rocket",
];

const SCORES = {
  brioche: 90,
  brie: 80,
  "cream cheese": 75,
  mozzarella: 70,
  butter: 90,
  mayo: 65,
  pesto: 40,
  mustard: 35,
  "olive oil": 35,
  honey: 65,
  sourdough: 30,
  baguette: 25,
  ciabatta: 40,
  focaccia: 45,
  prosciutto: 40,
  mortadella: 60,
  salami: 20,
  pastrami: 35,
  bacon: 15,
  tomato: 60,
  cucumber: 40,
  lettuce: 70,
  romaine: 60,
  apple: 55,
  mushroom: 50,
  pepper: 20,
  onion: 30,
  "grilled onion": 75,
  "strawberry jam": 65,
  "raspberry jam": 65,
  "blueberry jam": 65,
  marmalade: 65,
  fig: 60,
  "peanut butter": 59,
  "chilli flake": 10,
  balsamic: 35,
  chicken: 45,
  egg: 60,
  rocket: 50,
};

/* =========================
   PERFECT COMBINATIONS
========================= */

const PERFECT_RECIPES = [
  ["brioche", "butter", "egg"],
  ["baguette", "mozzarella", "mayo", "rocket", "tomato", "prosciutto", "pesto", "mustard"]
];

function isExactMatch(selected, recipe) {
  if (selected.length !== recipe.length) return false;

  const a = [...selected].sort();
  const b = [...recipe].sort();

  return a.every((v, i) => v === b[i]);
}

/* =========================
   DOM
========================= */
const rows = [...document.querySelectorAll(".beltRow")];
const dropZone = document.getElementById("dropZone");
const makeBtn = document.getElementById("makeBtn");
const resultText = document.getElementById("resultText");

const canvasEl = document.querySelector(".canvas");
console.log("canvasEl:", canvasEl);

if (!rows.length) console.log("❌ .beltRow 못 찾음");
if (!dropZone) console.log("❌ #dropZone 못 찾음");
if (!makeBtn) console.log("❌ #makeBtn 못 찾음");
if (!resultText) console.log("❌ #resultText 못 찾음");

let selected = [];

/* =========================
   BUILD BELT (NEW)
   - row마다 재료 순서를 "섞어서" 보여줌 (안 기다려도 다양하게 보임)
   - 무한루프(2번 반복) 유지
========================= */

function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRow(rowEl, rowIndex){
  rowEl.innerHTML = "";

  const track = document.createElement("div");
  track.className = "track";

  // ✅ row마다 다른 순서로 섞기
  const seq = shuffle(INGREDIENTS);

  // ✅ row마다 시작 위치도 다르게 (섞인 seq 안에서)
  const shift = (rowIndex * 7) % seq.length; // 7은 적당히 "섞임" 잘 나오는 숫자
  const shifted = seq.slice(shift).concat(seq.slice(0, shift));

  // ✅ seamless loop 용 2번 반복
  const doubled = shifted.concat(shifted);

  doubled.forEach((name) => {
    const w = document.createElement("span");
    w.className = "word";
    w.textContent = name;
    w.setAttribute("draggable", "true");
    w.dataset.name = name;

    // click select
    w.addEventListener("click", () => toggleSelect(name, w));

    // dragstart
    w.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", name);
      e.dataTransfer.effectAllowed = "copy";

      if (!selected.includes(name)) selected.push(name);
      w.classList.add("isSelected");

      console.log("dragstart:", name);
    });

    track.appendChild(w);
  });

  rowEl.appendChild(track);
}

// ✅ 4줄 만들기
rows.forEach((rowEl, i) => buildRow(rowEl, i));

/* =========================
   SELECT + DROP (canvas에 drop 받기)
========================= */

// 캔버스 위에 “찍히는 글자” 담을 레이어
const placedLayer = document.createElement("div");
placedLayer.className = "placedLayer";
canvasEl.appendChild(placedLayer);

// 드롭될 때마다 새 단어 하나 추가 (여러 개 유지)
function placeWordOnCanvas(name, clientX, clientY) {
  const rect = canvasEl.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const s = document.createElement("span");
  s.className = "placedWord";
  s.textContent = name;

  s.style.left = `${x}px`;
  s.style.top = `${y}px`;

  placedLayer.appendChild(s);
}

// drop 가능하게 필수
canvasEl.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// 실제 drop 처리
canvasEl.addEventListener("drop", (e) => {
  e.preventDefault();

  const name = e.dataTransfer.getData("text/plain");
  console.log("DROP:", name);
  if (!name) return;

  // 선택 배열에도 추가
  if (!selected.includes(name)) selected.push(name);

  // 벨트에 보이는 같은 단어들 outline 유지
  document
    .querySelectorAll(`.word[data-name="${CSS.escape(name)}"]`)
    .forEach(w => w.classList.add("isSelected"));

  // 캔버스에 “보이게” 찍기
  placeWordOnCanvas(name, e.clientX, e.clientY);
});

/* =========================
   MAKE
========================= */
const resultScreen = document.getElementById("resultScreen");
const resultTitle  = document.getElementById("resultTitle");
const retryBtn     = document.getElementById("retryBtn");

makeBtn.addEventListener("click", () => {
  if (selected.length === 0) {
    resultText.textContent = "choose ingredients";
    return;
  }

  // 1) 특정 조합이면 무조건 PERFECT
  let label = null;

  for (const recipe of PERFECT_RECIPES) {
    if (isExactMatch(selected, recipe)) {
      label = "PERFECT";
      break;
    }
  }

  // 2) 아니면 기존 점수 로직
  if (!label) {
    let total = 0;
    selected.forEach(n => {
      total += (SCORES[n] ?? 40);
    });

    const avg = Math.round(total / selected.length);

    label = "OKAY";
    if (avg >= 85) label = "EXELLENT";
    else if (avg >= 70) label = "NICE";
    else if (avg >= 60) label = "OKAY";
    else if (avg >= 45) label = "QUESTIONABLE";
    else label = "HORRIBLE";
  }

  resultTitle.textContent = label;
  resultScreen.scrollIntoView({ behavior: "smooth" });
});
// RETRY = 새로고침(너가 말한  그대로)
retryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  resetAll();
});

function resetAll() {
  // 1) 선택값 초기화
  selected = [];

  // 2) 캔버스에 놓인 단어들 제거
  if (placedLayer) placedLayer.innerHTML = "";

  // 3) belt의 선택 표시 제거
  document.querySelectorAll(".word.isSelected").forEach(w => w.classList.remove("isSelected"));

  // 4) 결과 텍스트/타이틀 비우기
  if (resultText) resultText.textContent = "";
  const resultTitle = document.getElementById("resultTitle");
  if (resultTitle) resultTitle.textContent = "";

  // 5) 결과 화면 숨김 상태로 되돌리기
  document.body.classList.remove("showResult");

  // 6) 맨 위로 스크롤
  window.scrollTo({ top: 0, behavior: "smooth" });
}
