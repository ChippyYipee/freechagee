const trickButton = document.getElementById("trickButton");
const buttonZone = document.getElementById("buttonZone");
const messageText = document.getElementById("messageText");
const statusText = document.getElementById("statusText");
const attemptBadge = document.getElementById("attemptBadge");
const meterFill = document.getElementById("meterFill");
const meterCaption = document.getElementById("meterCaption");
const meter = document.querySelector(".meter");
const catPopup = document.getElementById("catPopup");
const catPopupScrim = document.getElementById("catPopupScrim");
const catPopupClose = document.getElementById("catPopupClose");
const catPopupTitle = document.getElementById("catPopupTitle");
const catPopupText = document.getElementById("catPopupText");

const messages = [
  "เบบ ใจเย็นก่อน ชาแก้วนี้กำลังตรวจสอบระดับความน่ารักของเธออยู่",
  "โอ๊ะ เบบเกือบได้แล้ว แต่ปุ่มเพิ่งนึกขึ้นได้ว่ามันเขิน",
  "ระบบแจ้งว่าเบบสวยเกินไป ชาฟรีเลยประหม่าแล้ววิ่งหนี",
  "ชากำลังกระซิบว่า 'อยากไปหาเบบนะ แต่ยังเล่นตัวได้อีกนิด'",
  "เบบลองใหม่อีกทีสิ ปุ่มบอกว่ามันอยากเห็นความพยายามแบบเจ้าหญิง",
  "เกือบแล้วจริง ๆ นะเบบ... ถ้าไม่นับว่าปุ่มตั้งใจหนีตลอด",
  "ฝ่ายพิธีการชาระบุว่าเบบต้องยิ้มก่อนหนึ่งครั้ง ปุ่มถึงจะหนีต่อได้",
  "ปุ่มเพิ่งอัปเกรดเป็นโหมดหวงชา เห็นเบบแล้วมันวิ่งไวเป็นพิเศษ",
  "ระบบตรวจพบว่าเบบเริ่มจับทางได้ จึงขอแกล้งต่อแบบไม่มีวันจบ",
  "เฉลยก็ได้ นี่คือเว็บแกล้งเบบอย่างเอ็นดู ชาแก้วยังไม่ยอมมอบตัว",
  "ปุ่มส่งเรื่องไปถึงสภาชาแล้ว ผลสรุปคือยังไม่ยอมให้เบบ",
  "ตอนนี้โหลดบาร์ทำงานหนักกว่าเว็บจริง แต่ชาก็ยังไม่มา",
  "เว็บตัดสินใจเพิ่มความหวังของเบบเป็น 143% แบบไร้เหตุผล",
  "เบบพยายามดีมาก น่าเสียดายที่ระบบนี้ตั้งใจโกงอย่างสุภาพ"
];

const statuses = [
  "กำลังตรวจสอบความคู่ควรของเบบ...",
  "ระบบสแกนรอยยิ้มของเบบอยู่",
  "ชาเริ่มใจอ่อน แต่ปุ่มยังดื้อ",
  "กำลังเช็กว่าเบบจะยอมแพ้ไหม",
  "ผลการประเมิน: เบบน่ารัก แต่ยังไม่ได้ชา",
  "กำลังแสร้งทำเป็นใกล้เสร็จแล้ว",
  "โหลดเกิน 100% แล้ว แต่ก็ยังไม่ให้"
];

const meterStates = [
  { width: 22 },
  { width: 47 },
  { width: 73 },
  { width: 96 },
  { width: 108 },
  { width: 124 },
  { width: 138 },
  { width: 151 },
  { width: 167 },
  { width: 189 },
  { width: 214 },
  { width: 248 },
  { width: 300 },
  { width: 400 }
];

const catMessages = [
  "แมวยังแค่มองเงียบ ๆ ว่าจะมีคนโดนแกล้งอีกกี่รอบ",
  "แมวเริ่มจ้องแรงขึ้น เหมือนรู้ตั้งแต่แรกว่าเว็บนี้โกง",
  "ฝ่ายแมวลงความเห็นว่าเรื่องนี้ไม่น่าจะจบแบบมีชาฟรี",
  "แมวกำลังวัดระดับความพยายามด้วยสายตาแบบ 4K",
  "ตอนนี้แมวกับปุ่มน่าจะสมรู้ร่วมคิดกันแล้ว",
  "แมวเห็นโหลดบาร์เกิน 100% แล้ว แต่ก็ยังไม่ช่วยอะไร",
  "สรุปจากสายตาแมว: เว็บนี้ตั้งใจแกล้งจริง ไม่มีพิรุธ"
];

let attempts = 0;
let touchTriggeredAt = 0;
let extraHopTimer;
let catPopupTimer;
let lastCatPopupAttempt = -100;
let hasShownSeventyPopup = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getMeterState(attemptCount) {
  const normalizedAttempt = Math.max(attemptCount - 1, 0);
  const cycleLength = meterStates.length;
  const cycle = Math.floor(normalizedAttempt / cycleLength);
  const baseState = meterStates[normalizedAttempt % cycleLength];
  const overflowBoost = cycle * 420;
  const width = baseState.width + overflowBoost;

  return {
    width,
    caption: `กำลังโหลดสิทธิ์ชาฟรี ${width}%`
  };
}

function getCatMessage(attemptCount) {
  const normalizedAttempt = Math.max(attemptCount - 1, 0);

  return catMessages[normalizedAttempt % catMessages.length];
}

function hideCatPopup() {
  window.clearTimeout(catPopupTimer);
  catPopup.classList.remove("is-visible");
  catPopup.setAttribute("aria-hidden", "true");
}

function showCatPopup(title, message, duration = 3200) {
  window.clearTimeout(catPopupTimer);
  catPopupTitle.textContent = title;
  catPopupText.textContent = message;
  catPopup.classList.add("is-visible");
  catPopup.setAttribute("aria-hidden", "false");
  lastCatPopupAttempt = attempts;

  catPopupTimer = window.setTimeout(() => {
    hideCatPopup();
  }, duration);
}

function maybeShowCatPopup(eventSource) {
  const catMessage = getCatMessage(attempts);

  if (attempts === 70 && !hasShownSeventyPopup) {
    hasShownSeventyPopup = true;
    showCatPopup(
      "ครบ 70 ครั้งแล้ว แต่ยังไม่ได้ชา",
      `แมวมารับตำแหน่งพยานด้วยตัวเอง: ${catMessage} ครบ 70 ครั้งพอดีแล้วนะเบบ แต่ระบบก็ยังเลือกจะแกล้งต่อ`,
      4600
    );
    return;
  }

  if (attempts < 12) {
    return;
  }

  const attemptsSinceLastPopup = attempts - lastCatPopupAttempt;
  const hitMilestone = attempts % 17 === 0;
  const hitRandom = attemptsSinceLastPopup >= 6 && Math.random() < 0.12;

  if (!hitMilestone && !hitRandom) {
    return;
  }

  if (attemptsSinceLastPopup < 6) {
    return;
  }

  const suffix = eventSource === "touch"
    ? "แมวยืนยันว่าต่อให้นิ้วไวก็ยังไม่รอด"
    : eventSource === "keyboard"
      ? "แมวยืนยันว่าคีย์ลัดไม่มีอยู่จริง"
      : "แมวยืนยันว่าปุ่มตั้งใจหนีแบบมีแผน";

  showCatPopup(
    attempts > 45 ? "แมวเริ่มออกตรวจถี่ขึ้น" : "แมวโผล่มาเช็กความพยายาม",
    `${catMessage} ${suffix}`
  );
}

function moveButton() {
  const zoneRect = buttonZone.getBoundingClientRect();
  const padding = 18;
  const minY = 68;
  const buttonWidth = trickButton.offsetWidth;
  const buttonHeight = trickButton.offsetHeight;

  const maxX = Math.max(padding, zoneRect.width - buttonWidth - padding);
  const maxY = Math.max(minY, zoneRect.height - buttonHeight - padding);

  const nextX = maxX === padding ? padding : Math.random() * (maxX - padding) + padding;
  const nextY = maxY === minY ? minY : Math.random() * (maxY - minY) + minY;

  trickButton.style.left = `${clamp(nextX, padding, maxX)}px`;
  trickButton.style.top = `${clamp(nextY, minY, maxY)}px`;
  trickButton.style.transform = "none";

  trickButton.classList.remove("is-teasing");
  void trickButton.offsetWidth;
  trickButton.classList.add("is-teasing");
}

function updateCopy() {
  const messageIndex = (attempts - 1) % messages.length;
  const statusIndex = attempts % statuses.length;
  const meterState = getMeterState(attempts);

  messageText.textContent = messages[messageIndex];
  statusText.textContent = statuses[statusIndex];
  attemptBadge.textContent = attempts < 6
    ? `เบบพยายามแล้ว ${attempts} ครั้ง`
    : `เบบโดนหลอกแล้ว ${attempts} ครั้ง`;
  meterFill.style.width = `${meterState.width}%`;
  meterCaption.textContent = meterState.caption;
  meter.classList.toggle("is-overflowing", meterState.width > 100);
  meter.classList.remove("is-melting");
  void meter.offsetWidth;
  meter.classList.add("is-melting");

  if (attempts >= 7) {
    trickButton.textContent = "ยังจะตามปุ่มอีกเหรอ เบบ";
  } else if (attempts >= 4) {
    trickButton.textContent = "เกือบได้ชาแล้วนะ... หลอกเล่น";
  } else {
    trickButton.textContent = "เบบ คลิกเพื่อรับชา CHAGEE ฟรี";
  }
}

function scheduleExtraHop() {
  clearTimeout(extraHopTimer);

  if (attempts < 3) {
    return;
  }

  const delay = attempts >= 8 ? 110 : 180;

  extraHopTimer = window.setTimeout(() => {
    moveButton();
  }, delay);
}

function tease(eventSource) {
  attempts += 1;
  updateCopy();
  moveButton();
  scheduleExtraHop();

  if (eventSource === "keyboard") {
    messageText.textContent = "เบบจะใช้คีย์บอร์ดลัดก็ไม่ได้นะ ปุ่มนี้ฝึกวิ่งมาแล้ว";
  } else if (eventSource === "touch" && attempts > 5) {
    messageText.textContent = "เบบใช้นิ้วเร็วมาก แต่ปุ่มนี้สกิลหนีระดับชิงแชมป์";
  } else if (eventSource === "click" && attempts > 8) {
    messageText.textContent = "เว็บปรบมือให้เบบหนึ่งที แล้วเอาปุ่มหนีอีกรอบ";
  }

  maybeShowCatPopup(eventSource);
}

function onPointerEnter(event) {
  if (event.pointerType === "mouse") {
    tease("hover");
  }
}

function onPointerDown(event) {
  if (event.pointerType !== "mouse") {
    touchTriggeredAt = performance.now();
    event.preventDefault();
    tease("touch");
  }
}

function onClick(event) {
  event.preventDefault();

  if (performance.now() - touchTriggeredAt < 400) {
    return;
  }

  tease("click");
}

function onFocus() {
  tease("keyboard");
}

function resetButtonPosition() {
  const zoneRect = buttonZone.getBoundingClientRect();
  const padding = 18;
  const minY = 68;
  const buttonWidth = trickButton.offsetWidth;
  const buttonHeight = trickButton.offsetHeight;
  const maxX = Math.max(padding, zoneRect.width - buttonWidth - padding);
  const maxY = Math.max(minY, zoneRect.height - buttonHeight - padding);
  const centeredX = clamp((zoneRect.width - buttonWidth) / 2, padding, maxX);
  const preferredY = window.innerWidth <= 640 ? zoneRect.height * 0.34 : zoneRect.height * 0.48;
  const centeredY = clamp(preferredY, minY, maxY);

  trickButton.style.left = `${centeredX}px`;
  trickButton.style.top = `${centeredY}px`;
  trickButton.style.transform = "none";
}

trickButton.addEventListener("pointerenter", onPointerEnter);
trickButton.addEventListener("pointerdown", onPointerDown);
trickButton.addEventListener("click", onClick);
trickButton.addEventListener("focus", onFocus);
catPopupClose.addEventListener("click", hideCatPopup);
catPopupScrim.addEventListener("click", hideCatPopup);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideCatPopup();
  }
});

window.addEventListener("resize", resetButtonPosition);
window.addEventListener("load", resetButtonPosition);
