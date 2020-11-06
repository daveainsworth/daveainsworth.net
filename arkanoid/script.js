const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const audioBrick = document.getElementById("audio_brick");
const audioPaddle = document.getElementById("audio_paddle");
const highScore = document.getElementById("high-score");
const oneScore = document.getElementById("1up-score");
const splashBtn = document.getElementById("splash-screen-btn");
const splashScreen = document.getElementById("splash-screen");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Load Image used for background
var img = new Image();
img.src = "./images/level-1a-background.png";

var imgFrame = new Image();
imgFrame.src = "./images/arkanoid-frame.png";

//  initialise the players score:
let score = 1;

// set the number of lives.
let lives = 3;

// set the sound
var sound = true;

// state for pause / unpause
var pause = true;

const brickRowCount = 13;
const brickColumnCount = 6;

// setup colours for bricks
const brickColours = {
  1: "#9E9B9C", // grey
  2: "#FF1A00", // red
  3: "#fff100", // yellow
  4: "#006DFF", // blue
  5: "#FF27FF", // magenta
  6: "#00D800", // green
};

// Create ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 8,
  dx: 4,
  dy: -4,
};

// create paddle properties
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  w: 90,
  h: 15,
  speed: 10,
  dx: 0,
};

// create brick properties
const brickInfo = {
  w: 52,
  h: 20,
  padding: 5,
  offsetX: 42,
  offsetY: 100,
  visible: true,
  colour: brickColours, // array of colours
};

// create the bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;

    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// output the bricks arrays to the console:
// console.log(bricks);

// ** Functions

// draw paddle on the canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#909487";

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  ctx.shadowBlur = 10;

  ctx.fill();
  ctx.closePath();
}

// draw ball on the canvas
function drawBall() {
  ctx.beginPath();
  // make a circle
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  // ctx.arc(ball.x /2, ball.y/2, ball.size /2, 0, Math.PI * 2);
  ctx.fillStyle = "#5aacb6";
  ctx.fill();
  ctx.closePath();
}

function getHighScore() {

  // obtain highscore from Localstorage:
  const highScore = localStorage.getItem('highScore');
  return highScore === null ? '0' : highScore;
}


// draw the score on the canvas
function drawScore() {
  oneScore.innerHTML = `${score}`;
}

// draw the High Score
function drawHighScore() {
  highScore.innerHTML = getHighScore();
  highScore.style.color = "#fff";
}

// draw the bricks on the canvas
function drawBricks() {
  bricks.forEach((column) => {
    let $i = 1;
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? brick.colour[$i] : "transparent";
      ctx.fill();
      ctx.closePath();
      $i++;
    });
  });
}

// move paddle upon the canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // wall detection to the right wall
  if (paddle.x + paddle.w > canvas.width -40 ) {
    paddle.x = (canvas.width -40) - paddle.w;
  }
  // wall detection to the left wall
  if (paddle.x < 40) {
    paddle.x = 40;
  }
}
// move the ball on the Canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // detect if ball is hitting a wall right or left
  if (ball.x + ball.size > canvas.width - 40 || ball.x - ball.size < 37) {
    ball.dx *= -1;
  }
  // detect if ball is hitting a wall top or bottom
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 37) {
    ball.dy *= -1;
  }

  // detect if ball is hitting the paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    // change direction of the ball
    ball.dy = -ball.speed;

    // for fun, increase speed of ball
    ball.speed = ball.speed * 1.01;

    // play audio of brick hit
    audioPaddle.src = "./sounds/paddle_bounce.wav";
    const audioPromise = audioPaddle.play();
    if (sound) {
      if (audioPromise !== null) {
        audioPromise.catch(() => {
          audioPaddle.play();
        });
      }
    }
  }

  // brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick check
          ball.y - ball.size < brick.y + brick.h // bottom brick check
        ) {
          // remove the brick from the screen:
          brick.visible = false;

          // change the ball direction:
          ball.dy *= -1;

          // increment the score
          increaseScore();

          // play audio of brick hit
          audioBrick.src = "./sounds/brick_hit_1.wav";
          const audioPromise = audioBrick.play();
          if (sound) {
            if (audioPromise !== null) {
              audioPromise.catch(() => {
                audioBrick.play();
              });
            }
          }
        }
      }
    });
  });

  // hit the bottom, lose
  if (ball.y + ball.size > canvas.height) {

    // check to see if new high score, if it is store it in local storage.
    if (getHighScore() < score){
      localStorage.setItem('highScore', score);
    }
    

    

    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}

// make all bricks appear:
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

function drawBackground() {
  // draw frame around outside
  ctx.drawImage(imgFrame, 0, 0, 820, 800);

  // remove any shadows
  ctx.shadowColor = "rgba(0,0,0,0.0)";

  // draw repeating pattern
  var ptrn = ctx.createPattern(img, "repeat");
  ctx.fillStyle = ptrn;
  ctx.fillRect(40, 30, 740, 800);
}



//draw everything on the canvas / screen
function draw() {
  // clear the canvas before re-drawing:
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBall();
  drawPaddle();
  drawScore();
  drawHighScore();
  drawBricks();
}

// update canvas drawing and animation:
function update() {
  if (!pause) {
    movePaddle();
    moveBall();
    // call the draw function to update the screen
    draw();
  }
  requestAnimationFrame(update);
}

update();

// ** Event Listenters

// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }

  // pause functionality
  if (e.key === "p" || e.key === "P") {
    if (pause) {
      pause = false;
    } else {
      pause = true;
    }

  }
}



// Key up event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Add event to rules and close button to show the rules on screen.
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
rulesBtn.addEventListener("click", () => pause = true);
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
closeBtn.addEventListener("click", () => pause = false);

splashBtn.addEventListener("click", () => splashScreen.classList.add("hide"));
splashBtn.addEventListener("click", () => pause = false);
splashBtn.addEventListener("click", audioIntro);

// keyboard events
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function audioIntro() {
  const splash = document.getElementById("splash-intro");

console.log(splash);

  const audioPromise = splash.play();
          if (sound) {
            if (audioPromise !== null) {
              audioPromise.catch(() => {
                splash.play();
              });
            }
          }

}

