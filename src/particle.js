/*
 * このファイルは背景の紙吹雪用の関数をエクスポートするだけのファイルです。
 */

function particle(parent) {
  const back = document.createElement("canvas");
  back.width = parent.clientWidth;
  back.height = parent.clientHeight;
  back.id = "particle-background"
  back.style.position = "absolute";
  back.style.top = "0px";
  back.style.left = "0px";
  parent.appendChild(back);
  const bctx = back.getContext("2d");
  const particles = [];
  let pIndex = 0;
  let x = back.width;
  let y = back.height;
  let frameId;
  function Dot(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    particles[pIndex] = this;
    this.id = pIndex;
    pIndex++;
    this.life = 0;
    this.maxlife = 1000;
    this.degree = getRandom(0, 360);
    this.size = Math.floor(getRandom(8, 10));
  }

  Dot.prototype.draw = function (x, y) {
    this.degree += 1;
    this.vx *= 0.99;
    this.vy *= 0.999;
    this.x += this.vx + Math.cos((this.degree * Math.PI) / 600);
    this.y += this.vy;
    this.width = this.size;
    this.height = Math.cos((this.degree * Math.PI) / 40) * this.size;
    bctx.fillStyle = this.color;
    bctx.beginPath();
    bctx.moveTo(this.x + this.x / 2, this.y + this.y / 2);
    bctx.lineTo(
      this.x + this.x / 2 + this.width / 2,
      this.y + this.y / 2 + this.height
    );
    bctx.lineTo(
      this.x + this.x / 2 + this.width + this.width / 2,
      this.y + this.y / 2 + this.height
    );
    bctx.lineTo(this.x + this.x / 2 + this.width, this.y + this.y / 2);
    bctx.closePath();
    bctx.fill();
    this.life++;
    if (this.life >= this.maxlife) {
      delete particles[this.id];
    }
  };

  function loop() {
    bctx.clearRect(0, 0, back.width, back.height);
    if (frameId % 2 == 0) {
      new Dot(
        back.width * Math.random() - back.width + back.width * Math.random(),
        -back.height / 2,
        getRandom(1, 3),
        getRandom(2, 4),
        "#ED1A3D"
      );
      new Dot(
        back.width * Math.random() - back.width + back.width * Math.random(),
        -back.height / 2,
        getRandom(1, 3),
        getRandom(2, 4),
        "#FFEB3D"
      );
      new Dot(
        back.width * Math.random() - back.width + back.width * Math.random(),
        -back.height / 2,
        getRandom(1, 3),
        getRandom(2, 4),
        "#009688"
      );
      new Dot(
        back.width * Math.random() - back.width + back.width * Math.random(),
        -back.height / 2,
        getRandom(1, 3),
        getRandom(2, 4),
        "#0693e3"
      );
      new Dot(
        back.width * Math.random() - back.width + back.width * Math.random(),
        -back.height / 2,
        getRandom(1, 3),
        getRandom(2, 4),
        "#8338EC"
      );
    }
    for (var i in particles) {
      particles[i].draw();
    }
    if(document.getElementById("particle-background") !== null)
    frameId = requestAnimationFrame(loop);
  }

  loop();
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}
