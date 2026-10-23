const buttonColours = ["red", "blue", "green", "yellow"];

const REPLAY_FULL_PATTERN = true;
const STEP_DELAY = 600;

let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 0;
let highScore = loadHighScore();

const sounds = {};
[...buttonColours, "wrong"].forEach(function (name) {
  sounds[name] = new Audio("sounds/" + name + ".mp3");
});

updateHighScoreDisplay();

$(document).keypress(function () {
  if (!started) {
    started = true;
    nextSequence();
  }
});

$(".btn").click(function () {
  if (!started) return;

  const userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    gameOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  updateTitle("Level " + level);

  const randomNumber = Math.floor(Math.random() * 4);
  gamePattern.push(buttonColours[randomNumber]);

  const toPlay = REPLAY_FULL_PATTERN
    ? gamePattern
    : [gamePattern[gamePattern.length - 1]];

  toPlay.forEach(function (colour, i) {
    setTimeout(
      function () {
        $("#" + colour)
          .fadeIn(100)
          .fadeOut(100)
          .fadeIn(100);
        playSound(colour);
      },
      500 + i * STEP_DELAY,
    );
  });
}

function gameOver() {
  playSound("wrong");

  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 300);

  const score = level - 1;
  if (score > highScore) {
    highScore = score;
    saveHighScore(highScore);
    updateHighScoreDisplay();
  }

  updateTitle("Game Over, Press Any Key to Restart");
  startOver();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  const audio = sounds[name];
  audio.currentTime = 0;
  audio.play().catch(function () {});
}

function updateTitle(text) {
  const title = $("#level-title");
  title.text(text).removeClass("pop");
  void title[0].offsetWidth;
  title.addClass("pop");
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

function loadHighScore() {
  try {
    return Number(localStorage.getItem("simonHighScore")) || 0;
  } catch (e) {
    return 0;
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem("simonHighScore", value);
  } catch (e) {}
}

function updateHighScoreDisplay() {
  $("#high-score").text("Best: " + highScore);
}
