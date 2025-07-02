const gameArea = document.getElementById("gameArea");
const player = document.getElementById("playerCar");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const exitBtn = document.getElementById("exitBtn");

let playerX = 180;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = "High Score: " + highScore;

let gameSpeed = 5;
let gameInterval;
let carNumber = 1;

// Player movement (keyboard)
document.addEventListener("keydown", (e) => {
  const maxX = gameArea.offsetWidth - player.offsetWidth;
  if (e.key === "ArrowLeft" && playerX > 0) playerX -= 10;
  if (e.key === "ArrowRight" && playerX < maxX) playerX += 10;
  player.style.left = playerX + "px";
});

// Mobile controls
window.moveLeft = function () {
  const maxX = gameArea.offsetWidth - player.offsetWidth;
  if (playerX > 0) {
    playerX -= 10;
    player.style.left = playerX + "px";
  }
};

window.moveRight = function () {
  const maxX = gameArea.offsetWidth - player.offsetWidth;
  if (playerX < maxX) {
    playerX += 10;
    player.style.left = playerX + "px";
  }
};

// Create obstacle car
function createObstacle() {
  const obs = document.createElement("div");
  obs.classList.add("obstacle");

  obs.style.left = Math.floor(Math.random() * 10) * 40 + "px";
  obs.style.top = "-100px";

  const colors = ["yellow", "green", "blue", "orange", "purple", "pink", "lime", "cyan"];
  obs.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  obs.innerText = carNumber++;
  obs.style.color = "black";
  obs.style.fontWeight = "bold";
  obs.style.fontSize = "16px";
  obs.style.display = "flex";
  obs.style.alignItems = "center";
  obs.style.justifyContent = "center";

  gameArea.appendChild(obs);
}

// Move obstacles and detect collision
function moveObstacles() {
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obs) => {
    let top = parseInt(obs.style.top);
    if (isNaN(top)) top = -100;
    obs.style.top = top + gameSpeed + "px";

    const playerRect = player.getBoundingClientRect();
    const obsRect = obs.getBoundingClientRect();

    const isColliding = !(
      playerRect.top > obsRect.bottom ||
      playerRect.bottom < obsRect.top ||
      playerRect.right < obsRect.left ||
      playerRect.left > obsRect.right
    );

    if (isColliding) {
      clearInterval(gameInterval);
      if (score > highScore) {
        localStorage.setItem("highScore", score);
        alert("🎉 New High Score: " + score);
      } else {
        alert("💥 Crash! Your score: " + score);
      }

      document.getElementById("gamePage").style.display = "none";
      document.getElementById("homePage").style.display = "flex";
    }

    if (top > 600) {
      obs.remove();
      score++;
      scoreDisplay.innerText = "Score: " + score;
    }
  });
}

// Game loop
function gameLoop() {
  moveObstacles();
  if (Math.random() < 0.05) createObstacle();
}

// Exit button
exitBtn.onclick = () => {
  clearInterval(gameInterval);
  location.reload();
};

// Start Game
window.startGame = function () {
  score = 0;
  playerX = 180;
  carNumber = 1;
  player.style.left = playerX + "px";
  scoreDisplay.innerText = "Score: 0";

  // Remove previous obstacles
  document.querySelectorAll(".obstacle").forEach((obs) => obs.remove());

  // Set random color
  const carColors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33F6",
    "#FFFF33", "#00FFFF", "#FF8C00", "#8A2BE2"
  ];
  const randomColor = carColors[Math.floor(Math.random() * carColors.length)];
  player.style.backgroundColor = randomColor;

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 30);
};
