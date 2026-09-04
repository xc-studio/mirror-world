let canvas;
let ctx;
let cleardom;

const mapMaxLength = 14;

let level = 1;

let gameMode = "unenforced";

const 縦幅 = 650;
const 横幅 = 1000;

const x = 0;
const y = 0;
const w = 横幅;
const h = 縦幅;
const r = 20;

let variY = 0;

let map = [];
let image = {};

let ゲームの状態;

let camera;

let playerX;
let playerY;

let playerX変化量;
let playerY変化量;

let scrollSpeed;

let upPress = false;
let rightPress = false;
let leftPress = false;
let direction = 0;
let downPress = false;

let gravity;

let 現在マップ;

const 当たり判定 = {
  a: true,
  s: true,
  d: true,
  f: true,
  g: true,
  h: true,
  j: true,
  k: true,
  l: true,
  z: true,
  x: "goal",
  c: "damage",
  v: true,
  b: true,
  n: true,
  m: "goal",
  q: true,
  w: false,
  e: false,
};

let 向き;

let RAF;
let RAF2;

let PPA = [];

const player1 = new Image();
player1.src = "./assets/player1.png";

const player2 = new Image();
player2.src = "./assets/player2.png";

const background = new Image();
background.src = "./assets/background.png";

const gear = new Image();
gear.src = "./assets/gear.png";

const boss = new Image();
boss.src = "./assets/darkmoon.png";

const player3 = new Image();
player3.src = "./assets/player3.png";

let gearSpin = [0, 0, 0, 0];

const ImageObj = {
  a: "https://gh64ps.csb.app/assets/ground1.png",
  s: "https://gh64ps.csb.app/assets/ground2.png",
  d: "https://gh64ps.csb.app/assets/ground3.png",
  f: "https://gh64ps.csb.app/assets/block1.png",
  g: "https://gh64ps.csb.app/assets/block2.png",
  h: "https://gh64ps.csb.app/assets/block3.png",
  j: "https://gh64ps.csb.app/assets/ground7.png",
  k: "https://gh64ps.csb.app/assets/ground8.png",
  l: "https://gh64ps.csb.app/assets/ground9.png",
  z: "https://gh64ps.csb.app/assets/ground0.png",
  x: "https://gh64ps.csb.app/assets/door.png",
  c: "https://gh64ps.csb.app/assets/needle.png",
  v: "https://gh64ps.csb.app/assets/ground4.png",
  b: "https://gh64ps.csb.app/assets/ground5.png",
  n: "https://gh64ps.csb.app/assets/ground6.png",
  m: "https://gh64ps.csb.app/assets/door2.png",
  q: "https://gh64ps.csb.app/assets/clearblock.png",
  w: "https://gh64ps.csb.app/assets/downgate.png",
  e: "https://gh64ps.csb.app/assets/upgate.png",
};

const imageName = [
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "q",
  "w",
  "e",
  ".",
];

window.onload = async function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  cleardom = document.getElementById("game-clear-box");
  let skip = document.getElementById("skip");
  document.addEventListener(
    "keydown",
    (e) => {
      e.preventDefault();
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPress = true;
      }
      if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPress = true;
      }
      if (e.key === "Up" || e.key === "ArrowUp") {
        upPress = true;
        direction = 1;
      }
      if (e.key === " " || e.key === "Space") {
        upPress = true;
      }
      if (e.key === "ArrowDown" || e.key === "Down") {
        direction = -1;
        downPress = true;
      }
    },
    { passive: false }
  );
  document.addEventListener(
    "keyup",
    (e) => {
      e.preventDefault();
      if (e.key === "ArrowRight" || e.key === "Right") {
        rightPress = false;
      }
      if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPress = false;
      }
      if (e.key === "ArrowDown" || e.key === "Down") {
        downPress = false;
      }
      if (e.key === "ArrowUp" || e.key === " ") {
        upPress = false;
        if (!downPress) {
          direction = 0;
        }
      }
      if (e.key === "ArrowDown" || e.key === "Down") {
        if (!upPress) {
          direction = 0;
        }
      }
    },
    { passive: false }
  );
  skip.addEventListener("click", () => {
    if (ゲームの状態 == "game" && level !== mapMaxLength) {
      ゲームクリア処理();
    }
  });
  let loadstage = 0;
  let loadimage = 0;
  let imagelength = imageName.length - 1;
  canvas.width = 横幅;
  canvas.height = 縦幅;
  ctx.scale(1, 1);
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.arc(x + r, y + h - r, r, Math.PI, Math.PI * 0.5, true);
  ctx.arc(x + w - r, y + h - r, r, Math.PI * 0.5, 0, 1);
  ctx.arc(x + w - r, y + r, r, 0, Math.PI * 1.5, 1);
  ctx.arc(x + r, y + r, r, Math.PI * 1.5, Math.PI, 1);
  ctx.closePath();
  ctx.clip();
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "130px Gabarito";
  ctx.fillText("ロード中", canvas.width / 2, canvas.height / 2 - 75);
  ctx.font = "80px Gabarito";
  ctx.fillText(
    `${loadimage}個読み込み / ${
      mapMaxLength + Object.keys(ImageObj).length
    }個中`,
    canvas.width / 2,
    canvas.height / 2 + 40
  );
  for (let t = 0; t < imagelength; t++) {
    loadimage++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "130px Gabarito";
    ctx.fillText("ロード中", canvas.width / 2, canvas.height / 2 - 75);
    ctx.font = "80px Gabarito";
    ctx.fillText(
      `${loadimage}個読み込み / ${
        mapMaxLength + Object.keys(ImageObj).length
      }個中`,
      canvas.width / 2,
      canvas.height / 2 + 40
    );
    image[imageName[t]] = await load_image(ImageObj[imageName[t]]);
  }
  //image["."] = await load_image(ImageObj.a)
  for (let t = 1; t < mapMaxLength + 1; t++) {
    loadstage++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "130px Gabarito";
    ctx.fillText("ロード中", canvas.width / 2, canvas.height / 2 - 75);
    ctx.font = "80px Gabarito";
    ctx.fillText(
      `${loadstage + Object.keys(ImageObj).length}個読み込み / ${
        mapMaxLength + Object.keys(ImageObj).length
      }個中`,
      canvas.width / 2,
      canvas.height / 2 + 40
    );
    map.push(
      await (await fetch(`https://gh64ps.csb.app/map/map${t}.json`)).json()
    );
    for (let I = 0; I < 4; I++) {
      map[t - 1].map.push(".");
    }
    for (let I = 0; I < 4; I++) {
      map[t - 1].map.unshift(".");
    }
  }
  gameMode = "unenforced";
  オープニング();
  await 待つ(2500);
  let ok = false;
  await explain();
  メイン();
};

async function explain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#05ebb1";
  ctx.fill();
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = "100px Gabarito";
  ctx.fillText("説明", canvas.width / 2, 70);
  if (map[level - 1].messege[0] !== "") {
    for (let i = 0; i < map[level - 1].messege.length; i++) {
      ctx.beginPath();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.font = "40px Gabarito";
      ctx.fillText(map[level - 1].messege[i], canvas.width / 2, i * 50 + 200);
    }
    await EventWaiter();
  }
  upPress = false;
}

async function ファイル読み込み() {
  for (let t = 1; t < mapMaxLength + 1; t++) {
    map.push(await (await fetch(`/map/map${t}.json`)).json());
    for (let I = 0; I < 4; I++) {
      map[t - 1].map.push(".");
    }
    for (let I = 0; I < 4; I++) {
      map[t - 1].map.unshift(".");
    }
  }
}

async function オープニング() {
  ctx.beginPath();
  ctx.font = "150px Gabarito";
  ctx.fillText("test", 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = "#333333";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "150px Gabarito";
  ctx.fillText("MIRROR", canvas.width / 2, canvas.height / 2 - 75);
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText("WORLD", canvas.width / 2, canvas.height / 2 + 75);
  await 待つ(1500);
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.fillStyle = "#00000010";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    await 待つ(16);
  }
}

function 待つ(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function メイン() {
  ゲームの状態 = "game";
  camera = (map[level - 1].camera + 4) * 60;
  playerX = (map[level - 1].playerPosition.x + 4) * 60;
  playerY = map[level - 1].playerPosition.y * 60;
  現在マップ = map[level - 1].map;
  gravity = map[level - 1].gravity;
  playerX変化量 = 0;
  playerY変化量 = 0;
  向き = 1;
  gameMode = map[level - 1].gameMode;
  (gearSpin = [0, 0, 0, 0]), (PPA = []);
  scrollSpeed = map[level - 1].scrollSpeed;
  表示();
}

function EventWaiter() {
  return new Promise((resolve) =>
    document.addEventListener("keydown", resolve)
  );
}

function 表示() {
  if (ゲームの状態 == "game") {
    if (gameMode == "BOSS") {
      RAF = requestAnimationFrame(BOSScollisionDetection);
    } else {
      RAF = requestAnimationFrame(collisionDetection);
    }
    画面を描く();
    RAF2 = requestAnimationFrame(表示);
  }
}

function 画面を描く() {
  let cameraPosition = Math.floor(camera / 60) - 8;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.drawImage(background, 0 - ((camera / 2) % 1000), 0, 1000, 650);
  ctx.drawImage(background, 1000 - ((camera / 2) % 1000), 0, 1000, 650);
  ctx.drawImage(background, -1000 - ((camera / 2) % 1000), 0, 1000, 650);
  if (gameMode == "BOSS") {
    ctx.beginPath();
    ctx.fillStyle = "#000000cc";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
  }
  for (let i = 0; i < 18; i++) {
    if (cameraPosition + i >= 0 && cameraPosition + i < 現在マップ.length) {
      const row = 現在マップ[cameraPosition + i].split("");
      for (let d = 0; d < 10; d++) {
        if (
          row[d] != "." &&
          row[d] != "" &&
          row[d] != null &&
          row[d] != undefined
        ) {
          ctx.beginPath();
          if (row[d] == "q") {
            ctx.globalAlpha = Math.max(
              Math.abs(i * 60 - (camera % 60) - 480) / 640 - 0.3,
              0
            );
          } else {
            ctx.globalAlpha = 1;
          }
          ctx.drawImage(
            image[row[d]],
            i * 60 - (camera % 60),
            650 - (d * 60 + 85),
            60,
            60
          );
        }
      }
    }
  }
  ctx.beginPath();
  ctx.globalAlpha = 1;
  if (向き >= 0) {
    ctx.drawImage(
      player1,
      playerX - camera + 60 * 8,
      650 - playerY - 85,
      60,
      60
    );
  } else {
    ctx.drawImage(
      player2,
      playerX - camera + 60 * 8,
      650 - playerY - 85,
      60,
      60
    );
  }
  ctx.fillStyle = "#000000";
  ctx.rect(0, 625, canvas.width, 25);
  ctx.fill();
  ctx.rect(0, 0, canvas.width, 25);
  ctx.fill();
  if (gameMode == "enforced") {
    gearSpin[0] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[0]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[1] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[1]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[2] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[2]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[3] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[3]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    camera += scrollSpeed;
    if (playerX - camera < -480) {
      playerX = camera - 480;
    } else if (playerX - camera > 460) {
      playerX = camera + 460;
    }
  } else if (gameMode == "UFO" || gameMode == "BOSS") {
    gearSpin[0] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[0]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[1] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[1]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[2] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[2]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[3] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[3]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    camera += scrollSpeed;
    playerX += scrollSpeed;
  }
}

async function collisionDetection() {
  if (gameMode == "3D") {
    if (direction == 0) {
      playerX変化量 = scrollSpeed;
      camera += scrollSpeed;
      playerX += scrollSpeed;
    } else {
      playerY += scrollSpeed * direction;
    }
    if (playerY < 0 || playerY > 600) {
      死亡();
    }
    if (
      当たり判定[
        現在マップ[Math.floor((playerX + 10) / 60)].split("")[
          Math.ceil((playerY - 10) / 60)
        ]
      ] == "damage" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 50) / 60)].split("")[
          Math.ceil((playerY - 10) / 60)
        ]
      ] == "damage" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 10) / 60)].split("")[
          Math.ceil((playerY - 50) / 60)
        ]
      ] == "damage" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 50) / 60)].split("")[
          Math.ceil((playerY - 50) / 60)
        ]
      ] == "damage"
    ) {
      死亡();
    }
    if (
      当たり判定[
        現在マップ[Math.floor((playerX + 1) / 60)].split("")[
          Math.ceil((playerY - 1) / 60)
        ]
      ] == "goal" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 59) / 60)].split("")[
          Math.ceil((playerY - 1) / 60)
        ]
      ] == "goal" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 1) / 60)].split("")[
          Math.ceil((playerY - 59) / 60)
        ]
      ] == "goal" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 59) / 60)].split("")[
          Math.ceil((playerY - 59) / 60)
        ]
      ] == "goal"
    ) {
      ゲームクリア処理();
    }
  } else {
    if (
      !(
        当たり判定[
          現在マップ[Math.floor(playerX / 60) + 1].split("")[
            Math.ceil((playerY - 0.1) / 60)
          ]
        ] == true ||
        当たり判定[
          現在マップ[Math.floor(playerX / 60) + 1].split("")[
            Math.ceil((playerY + 0.1 - 60) / 60)
          ]
        ] == true
      )
    ) {
      if (rightPress == true) {
        if (gameMode != "UFO") {
          playerX変化量 = 5;
          向き = 1;
          if (gameMode == "unenforced") {
            camera += 5;
          }
          playerX += 5;
        }
      }
    }
    if (
      !(
        当たり判定[
          現在マップ[Math.floor((playerX - 1.2) / 60)].split("")[
            Math.ceil((playerY - 0.1) / 60)
          ]
        ] == true ||
        当たり判定[
          現在マップ[Math.floor((playerX - 1.2) / 60)].split("")[
            Math.ceil((playerY + 0.1 - 60) / 60)
          ]
        ] == true
      )
    ) {
      if (leftPress == true && rightPress == false) {
        if (gameMode != "UFO") {
          playerX変化量 = -5;
          向き = -1;
          if (gameMode == "unenforced") {
            camera += -5;
          }
          playerX += -5;
        }
      }
    }
    if (rightPress == false && leftPress == false) {
      playerX変化量 = 0;
    }
    if (gameMode == "UFO") {
      if (playerY変化量 * gravity < 0) {
        playerY変化量 += gravity * 0.5;
        playerY -= playerY変化量;
      }
      if (gravity == 1) {
        if (
          !(
            当たり判定[
              現在マップ[Math.floor((playerX + 0.5) / 60)].split("")[
                Math.floor((playerY - 0.1) / 60)
              ]
            ] == true ||
            当たり判定[
              現在マップ[Math.floor((playerX + 60 - 0.5) / 60)].split("")[
                Math.floor((playerY - 0.1) / 60)
              ]
            ] == true
          )
        ) {
          playerY変化量 += gravity * 0.5;
          playerY -= playerY変化量;
        } else {
          playerY変化量 = 0;
          playerY = Math.ceil(playerY / 60) * 60;
        }
      } else if (gravity == -1) {
        if (
          !(
            当たり判定[
              現在マップ[Math.floor((playerX + 0.5) / 60)].split("")[
                Math.floor((playerY + 60.1) / 60)
              ]
            ] == true ||
            当たり判定[
              現在マップ[Math.floor((playerX + 60 - 0.5) / 60)].split("")[
                Math.floor((playerY + 60.1) / 60)
              ]
            ] == true
          )
        ) {
          playerY変化量 += gravity * 0.5;
          playerY -= playerY変化量;
        } else {
          playerY変化量 = 0;
          playerY = Math.floor(playerY / 60) * 60;
        }
      }
    } else {
      if (Math.floor((playerX + 0.5) / 60) < 0) {
        playerY変化量 += gravity * 0.5;
        playerY -= playerY変化量;
      } else {
        if (gravity == 1) {
          if (
            !(
              当たり判定[
                現在マップ[Math.floor((playerX + 0.5) / 60)].split("")[
                  Math.floor((playerY - 0.1) / 60)
                ]
              ] == true ||
              当たり判定[
                現在マップ[Math.floor((playerX + 60 - 0.5) / 60)].split("")[
                  Math.floor((playerY - 0.1) / 60)
                ]
              ] == true
            )
          ) {
            playerY変化量 += gravity * 0.5;
            playerY -= playerY変化量;
          } else {
            playerY変化量 = 0;
            playerY = Math.ceil(playerY / 60) * 60;
          }
        } else if (gravity == -1) {
          if (
            !(
              当たり判定[
                現在マップ[Math.floor((playerX + 0.5) / 60)].split("")[
                  Math.floor((playerY + 60.1) / 60)
                ]
              ] == true ||
              当たり判定[
                現在マップ[Math.floor((playerX + 60 - 0.5) / 60)].split("")[
                  Math.floor((playerY + 60.1) / 60)
                ]
              ] == true
            )
          ) {
            playerY変化量 += gravity * 0.5;
            playerY -= playerY変化量;
          } else {
            playerY変化量 = 0;
            playerY = Math.floor(playerY / 60) * 60;
          }
        }
      }
    }
    if (upPress == true) {
      if (gameMode == "UFO") {
        playerY変化量 = -8 * gravity;
        upPress = false;
      } else {
        if (gravity == 1) {
          if (
            当たり判定[
              現在マップ[Math.floor((playerX + 0.5) / 60)].split("")[
                Math.floor((playerY - 0.1) / 60)
              ]
            ] == true ||
            当たり判定[
              現在マップ[Math.floor((playerX + 60 - 0.5) / 60)].split("")[
                Math.floor((playerY - 0.1) / 60)
              ]
            ] == true
          ) {
            gravity = gravity * -1;
            upPress = false;
            playerY変化量 = 0;
          }
        } else if (gravity == -1) {
          if (
            当たり判定[
              現在マップ[Math.floor((playerX + 0.5) / 60)].split("")[
                Math.floor((playerY + 60.1) / 60)
              ]
            ] == true ||
            当たり判定[
              現在マップ[Math.floor((playerX + 60 - 0.5) / 60)].split("")[
                Math.floor((playerY + 60.1) / 60)
              ]
            ] == true
          ) {
            gravity = gravity * -1;
            upPress = false;
            playerY変化量 = 0;
          }
        }
      }
    }
    if (playerY < -30 || playerY > 630) {
      死亡();
    }
    if (
      当たり判定[
        現在マップ[Math.floor((playerX + 10) / 60)].split("")[
          Math.ceil((playerY - 10) / 60)
        ]
      ] == "damage" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 50) / 60)].split("")[
          Math.ceil((playerY - 10) / 60)
        ]
      ] == "damage" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 10) / 60)].split("")[
          Math.ceil((playerY - 50) / 60)
        ]
      ] == "damage" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 50) / 60)].split("")[
          Math.ceil((playerY - 50) / 60)
        ]
      ] == "damage"
    ) {
      死亡();
    }
    if (
      当たり判定[
        現在マップ[Math.floor((playerX + 1) / 60)].split("")[
          Math.ceil((playerY - 1) / 60)
        ]
      ] == "goal" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 59) / 60)].split("")[
          Math.ceil((playerY - 1) / 60)
        ]
      ] == "goal" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 1) / 60)].split("")[
          Math.ceil((playerY - 59) / 60)
        ]
      ] == "goal" ||
      当たり判定[
        現在マップ[Math.floor((playerX + 59) / 60)].split("")[
          Math.ceil((playerY - 59) / 60)
        ]
      ] == "goal"
    ) {
      ゲームクリア処理();
    }
    if (
      現在マップ[Math.floor((playerX + 1) / 60)].split("")[
        Math.ceil((playerY - 1) / 60)
      ] == "w" ||
      現在マップ[Math.floor((playerX + 59) / 60)].split("")[
        Math.ceil((playerY - 1) / 60)
      ] == "w" ||
      現在マップ[Math.floor((playerX + 1) / 60)].split("")[
        Math.ceil((playerY - 59) / 60)
      ] == "w" ||
      現在マップ[Math.floor((playerX + 59) / 60)].split("")[
        Math.ceil((playerY - 59) / 60)
      ] == "w"
    ) {
      gravity = 1;
      if (Math.abs(playerY変化量) > 10) {
        playerY変化量 = playerY変化量 * 0.5;
      }
    }
    if (
      現在マップ[Math.floor((playerX + 1) / 60)].split("")[
        Math.ceil((playerY - 1) / 60)
      ] == "e" ||
      現在マップ[Math.floor((playerX + 59) / 60)].split("")[
        Math.ceil((playerY - 1) / 60)
      ] == "e" ||
      現在マップ[Math.floor((playerX + 1) / 60)].split("")[
        Math.ceil((playerY - 59) / 60)
      ] == "e" ||
      現在マップ[Math.floor((playerX + 59) / 60)].split("")[
        Math.ceil((playerY - 59) / 60)
      ] == "e"
    ) {
      gravity = -1;
      if (Math.abs(playerY変化量) > 10) {
        playerY変化量 = playerY変化量 * 0.5;
      }
    }
    if (
      playerX - camera <= -480 &&
      (当たり判定[
        現在マップ[Math.floor(playerX / 60) + 1].split("")[
          Math.ceil((playerY - 0.1) / 60)
        ]
      ] == true ||
        当たり判定[
          現在マップ[Math.floor(playerX / 60) + 1].split("")[
            Math.ceil((playerY + 0.1 - 60) / 60)
          ]
        ] == true)
    ) {
      死亡();
    }
  }
}

async function 死亡() {
  ゲームの状態 = "死亡";
  window.cancelAnimationFrame(RAF);
  window.cancelAnimationFrame(RAF2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.drawImage(background, 0 - ((camera / 2) % 1000), 0, 1000, 650);
  ctx.drawImage(background, 1000 - ((camera / 2) % 1000), 0, 1000, 650);
  ctx.drawImage(background, -1000 - ((camera / 2) % 1000), 0, 1000, 650);
  if (gameMode == "BOSS") {
    ctx.beginPath();
    ctx.fillStyle = "#000000cc";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.beginPath();
  }
  let cameraPosition = Math.floor(camera / 60) - 8;
  for (let i = 0; i < 18; i++) {
    if (cameraPosition + i >= 0 && cameraPosition + i < 現在マップ.length) {
      const row = 現在マップ[cameraPosition + i].split("");
      for (let d = 0; d < 10; d++) {
        if (
          row[d] != "." &&
          row[d] != "" &&
          row[d] != null &&
          row[d] != undefined
        ) {
          ctx.beginPath();
          ctx.drawImage(
            image[row[d]],
            i * 60 - (camera % 60),
            650 - (d * 60 + 85),
            60,
            60
          );
        }
      }
    }
  }
  ctx.fillStyle = "#000000";
  ctx.rect(0, 625, canvas.width, 25);
  ctx.fill();
  ctx.rect(0, 0, canvas.width, 25);
  ctx.fill();
  if (gameMode == "enforced" || gameMode == "UFO" || gameMode == "BOSS") {
    gearSpin[0] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[0]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[1] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[1]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[2] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[2]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[3] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[3]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
  }
  await 待つ(750);
  メイン();
}

async function ゲームクリア処理() {
  ゲームの状態 = "clear";
  window.cancelAnimationFrame(RAF);
  window.cancelAnimationFrame(RAF2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.drawImage(background, 0 - ((camera / 2) % 1000), 0, 1000, 650);
  ctx.drawImage(background, 1000 - ((camera / 2) % 1000), 0, 1000, 650);
  ctx.drawImage(background, -1000 - ((camera / 2) % 1000), 0, 1000, 650);
  if (gameMode == "BOSS") {
    ctx.beginPath();
    ctx.fillStyle = "#000000cc";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.beginPath();
  }
  let cameraPosition = Math.floor(camera / 60) - 8;
  for (let i = 0; i < 18; i++) {
    if (cameraPosition + i >= 0 && cameraPosition + i < 現在マップ.length) {
      const row = 現在マップ[cameraPosition + i].split("");
      for (let d = 0; d < 10; d++) {
        if (
          row[d] != "." &&
          row[d] != "" &&
          row[d] != null &&
          row[d] != undefined
        ) {
          ctx.beginPath();
          ctx.drawImage(
            image[row[d]],
            i * 60 - (camera % 60),
            650 - (d * 60 + 85),
            60,
            60
          );
        }
      }
    }
  }
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000000";
  ctx.rect(0, 625, canvas.width, 25);
  ctx.fill();
  ctx.rect(0, 0, canvas.width, 25);
  ctx.fill();
  ctx.beginPath();
  if (向き >= 0) {
    ctx.drawImage(
      player1,
      playerX - camera + 60 * 8,
      650 - playerY - 85,
      60,
      60
    );
  } else {
    ctx.drawImage(
      player2,
      playerX - camera + 60 * 8,
      650 - playerY - 85,
      60,
      60
    );
  }
  if (gameMode == "enforced" || gameMode == "UFO") {
    gearSpin[0] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[0]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[1] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[1]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[2] += scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, canvas.height);
    ctx.rotate((Math.PI / 180) * gearSpin[2]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
    gearSpin[3] -= scrollSpeed;
    ctx.beginPath();
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.rotate((Math.PI / 180) * gearSpin[3]);
    ctx.drawImage(gear, -100, -100, 200, 200);
    ctx.restore();
  }
  await 待つ(750);
  if (level == mapMaxLength) {
    // ゲームクリア処理
    particle(cleardom);
    cleardom.style.backgroundColor = "#3c3c3a";
    const text = document.createElement("div");
    const str = "Congratulations!";
    cleardom.appendChild(text);
    text.classList.add = "clear-message";
    for (let i = 0; i < str.length; i++) {
      text.insertAdjacentHTML(
        "beforeend",
        `<span style="--delay: ${
          0 /*i / 5*/
        }s" class="rainbow-text pop-text">` +
          str.split("")[i] +
          "</span>"
      );
      await 待つ(100);
    }
    document.addEventListener("keydown", async (e) => {
      if (e.key == "e") {
        cleardom.innerHTML = "";
        cleardom.style.backgroundColor = "transparent";
        background_color_set("#000000");
        await 待つ(1000);
        BOSS();
      }
    });
  } else {
    level++;
    await explain();
    メイン();
  }
}

function BOSScollisionDetection() {
  if (playerY < -30 || playerY > 630) {
    死亡();
  }
  if (upPress == true) {
    playerY変化量 = -8 * gravity;
    upPress = false;
  }
  playerY変化量 += gravity * 0.5;
  playerY -= playerY変化量;
}

async function load_image(path) {
  const t_img = new Image();
  return new Promise((resolve) => {
    t_img.onload = () => {
      resolve(t_img);
    };
    t_img.src = path;
  });
}

function BOSS() {}

function background_color_set(color) {
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
}
