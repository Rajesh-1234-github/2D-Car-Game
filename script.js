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
let carNumber = 1; // For obstacle numbering

// Player movement
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && playerX > 0) playerX -= 10;
  if (e.key === "ArrowRight" && playerX < 360) playerX += 10;
  player.style.left = playerX + "px";
});

// Create obstacle car with number and color
function createObstacle() {
  const obs = document.createElement("div");
  obs.classList.add("obstacle");
  obs.style.left = Math.floor(Math.random() * 10) * 40 + "px";

  const colors = ["yellow", "green", "blue", "orange", "purple", "pink", "lime", "cyan"];
  obs.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  // Assign number and center it
  obs.innerText = carNumber++;
  obs.style.color = "black";
  obs.style.fontWeight = "bold";
  obs.style.fontSize = "16px";
  obs.style.display = "flex";
  obs.style.alignItems = "center";
  obs.style.justifyContent = "center";

  gameArea.appendChild(obs);
}

// Move obstacles and handle collisions
function moveObstacles() {
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obs) => {
    const top = parseInt(obs.style.top || "-100");
    obs.style.top = top + gameSpeed + "px";

    const obsLeft = parseInt(obs.style.left);
    const obsTop = parseInt(obs.style.top);
    const carTop = 530;

    if (
      obsTop > carTop - 70 &&
      obsTop < carTop + 70 &&
      obsLeft >= playerX - 30 &&
      obsLeft <= playerX + 30
    ) {
      clearInterval(gameInterval);
      if (score > highScore) {
        localStorage.setItem("highScore", score);
        alert("🎉 New High Score: " + score);
      } else {
        alert("💥 Crash! Your score: " + score);
      }
      //location.reload();
      document.getElementById("gamePage").style.display = "none";
     document.getElementById("homePage").style.display = "flex";

    }

    if (obsTop > 600) {
      obs.remove();
      score++;
      scoreDisplay.innerText = "Score: " + score;
    }
  });
}

function gameLoop() {
  moveObstacles();
  if (Math.random() < 0.05) createObstacle();
}

exitBtn.onclick = () => {
  clearInterval(gameInterval);
  location.reload();
};

// Make startGame globally available
window.startGame = function () {
  score = 0;
  playerX = 180;
  player.style.left = playerX + "px";
  scoreDisplay.innerText = "Score: 0";

  const carColors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33F6",
    "#FFFF33", "#00FFFF", "#FF8C00", "#8A2BE2"
  ];
  const randomColor = carColors[Math.floor(Math.random() * carColors.length)];
  player.style.backgroundColor = randomColor;

  gameInterval = setInterval(gameLoop, 30);
};
