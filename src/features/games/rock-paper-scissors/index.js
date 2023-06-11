let time = 60;
let score = 0;
let [rockButton, paperButton, scissorsButton] = [
  document.querySelector(".rock-cta"),
  document.querySelector(".paper-cta"),
  document.querySelector(".scissors-cta"),
];

let [
  timer,
  scoreDisplay,
  computerChoiceDisplay,
  resultState,
] = [
  document.querySelector("#timer"),
  document.querySelector("#score"),
  document.querySelector("#computer-choice"),
  document.querySelector("#result-state"),
];

scoreDisplay.innerHTML = score;
timer.innerHTML = time;
let choices = ["rock", "paper", "scissors"];
let randomComputerChoice =
  choices[Math.floor(Math.random() * choices.length)];

function userClicksRock() {
  computerChoiceDisplay.innerText = randomComputerChoice;
  switch (randomComputerChoice) {
    case "scissors":
      resultState.innerText = "win";
      score += 10;
      scoreDisplay.innerText = score;
      break;
    case "paper":
      resultState.innerText = "lose";
      break;
    case "rock":
      resultState.innerText = "draw";
      score += 5;
      scoreDisplay.innerText = score;
      break;
  }
}

function userClicksPaper() {
  computerChoiceDisplay.innerText = randomComputerChoice;
  switch (randomComputerChoice) {
    case "rock":
      resultState.innerText = "win";
      score += 10;
      scoreDisplay.innerText = score;
      break;
    case "scissors":
      resultState.innerText = "lose";
      break;
    case "paper":
      resultState.innerText = "draw";
      score += 5;
      scoreDisplay.innerText = score;
      break;
  }
}
function userClicksScissors() {
  computerChoiceDisplay.innerText = randomComputerChoice;
  switch (randomComputerChoice) {
    case "paper":
      resultState.innerText = "win";
      score += 10;
      scoreDisplay.innerText = score;
      break;
    case "rock":
      resultState.innerText = "lose";
      scoreDisplay.innerText = score;
      break;
    case "scissors":
      resultState.innerText = "draw";
      score += 5;
      scoreDisplay.innerText = score;
      break;
  }
}

function timerCountdown() {
  if (time > 0) {
    time--;
    timer.innerText = time;
  }
}

rockButton.addEventListener("click", userClicksRock);
paperButton.addEventListener("click", userClicksPaper);
scissorsButton.addEventListener(
  "click",
  userClicksScissors
);
