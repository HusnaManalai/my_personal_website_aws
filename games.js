document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements from the updated HTML
    const homeScreen = document.getElementById("home-screen");
    const gameScreen = document.getElementById("game-screen");
    const winScreen = document.getElementById("win-screen");
  
    const singlePlayerBtn = document.getElementById("single-player-btn");
    const multiplayerBtn = document.getElementById("multiplayer-btn");
    const backHomeBtn = document.getElementById("back-home-btn");
    const winHomeBtn = document.getElementById("home-btn"); // from win screen
    const nextLevelBtn = document.getElementById("next-level-btn");
  
    const gameBoard = document.getElementById("game-board");
    const levelDisplay = document.getElementById("level");
    const scoreDisplay = document.getElementById("score");
    const player1ScoreDisplay = document.getElementById("player1-score");
    const player2ScoreDisplay = document.getElementById("player2-score");
    const timerDisplay = document.getElementById("time-left");
    const winMessage = document.getElementById("win-message");
  
    // Game variables
    let level = 1;
    let matches = 0;
    let isMultiplayer = false;
    let currentPlayer = 1;
    let player1Score = 0;
    let player2Score = 0;
    let timer;
    let timeLeft = 60;
  
    // Utility: switch which screen is visible
    function showScreen(screen) {
      [homeScreen, gameScreen, winScreen].forEach(s => s.classList.add("hidden"));
      screen.classList.remove("hidden");
    }
  
    // Reset game state and timer
    function resetGame() {
      level = 1;
      matches = 0;
      currentPlayer = 1;
      player1Score = 0;
      player2Score = 0;
      scoreDisplay.textContent = "0";
      player1ScoreDisplay.textContent = "0";
      player2ScoreDisplay.textContent = "0";
      levelDisplay.textContent = "1";
      clearInterval(timer);
    }
  
    // Start the countdown timer
    function startTimer() {
      clearInterval(timer);
      timeLeft = 60;
      timerDisplay.textContent = timeLeft;
      timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timer);
          winMessage.innerText = "⏳ Time's Up! You Failed!";
          showScreen(winScreen);
        }
      }, 1000);
    }
  
    // Generate cards for the current level
    function generateCards(level) {
      matches = 0;
      let numCards = (level + 2) * 3;
      let cardValues = [];
  
      // Create three copies for each unique value
      for (let i = 0; i < numCards / 3; i++) {
        cardValues.push(i, i, i);
      }
  
      // Shuffle the cards
      cardValues.sort(() => Math.random() - 0.5);
      gameBoard.innerHTML = "";
      gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(numCards / 3)}, 1fr)`;
  
      cardValues.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;
        card.textContent = "?";
        card.addEventListener("click", function () {
          // Allow a card to be flipped only if it isn't already, and if less than 3 are flipped
          if (!this.classList.contains("flipped") && gameBoard.querySelectorAll(".flipped").length < 3) {
            this.classList.add("flipped");
            this.textContent = this.dataset.value;
            let flippedCards = gameBoard.querySelectorAll(".flipped");
            if (flippedCards.length === 3) {
              setTimeout(() => {
                checkMatch(Array.from(flippedCards));
                flippedCards.forEach(card => card.classList.remove("flipped"));
              }, 500);
            }
          }
        });
        gameBoard.appendChild(card);
      });
    }
  
    // Check if the three flipped cards match
    function checkMatch(cards) {
      const [card1, card2, card3] = cards;
      if (
        card1.dataset.value === card2.dataset.value &&
        card2.dataset.value === card3.dataset.value
      ) {
        matches++;
        cards.forEach(card => card.style.visibility = "hidden");
        updateScore();
        checkWinCondition();
      } else {
        cards.forEach(card => {
          card.classList.remove("flipped");
          card.textContent = "?";
        });
      }
    }
  
    // Update score based on the game mode
    function updateScore() {
      if (isMultiplayer) {
        if (currentPlayer === 1) {
          player1Score++;
          player1ScoreDisplay.textContent = player1Score;
        } else {
          player2Score++;
          player2ScoreDisplay.textContent = player2Score;
        }
        currentPlayer = currentPlayer === 1 ? 2 : 1;
      } else {
        let currentScore = parseInt(scoreDisplay.textContent);
        currentScore++;
        scoreDisplay.textContent = currentScore;
      }
    }
  
    // Check if the win condition for the current level is met
    function checkWinCondition() {
      if (matches >= (level + 2)) {
        clearInterval(timer);
        if (isMultiplayer) {
          winMessage.innerText =
            player1Score > player2Score
              ? "🏆 Player 1 Wins!"
              : "🏆 Player 2 Wins!";
        } else {
          winMessage.innerText = "🎉 Yay! You Win! 🎉";
        }
        showScreen(winScreen);
      }
    }
  
    // Start game: generate cards, start timer, and show the game screen
    function startGame() {
      levelDisplay.textContent = level;
      generateCards(level);
      startTimer();
      showScreen(gameScreen);
    }
  
    // Event listeners
  
    // Mode selection from home screen
    singlePlayerBtn.addEventListener("click", () => {
      isMultiplayer = false;
      resetGame();
      startGame();
    });
  
    multiplayerBtn.addEventListener("click", () => {
      isMultiplayer = true;
      resetGame();
      // Ensure multiplayer scores start at 0
      player1Score = 0;
      player2Score = 0;
      player1ScoreDisplay.textContent = "0";
      player2ScoreDisplay.textContent = "0";
      startGame();
    });
  
    // Back to home from game screen
    backHomeBtn.addEventListener("click", () => {
      resetGame();
      showScreen(homeScreen);
    });
  
    // Home button from win screen
    winHomeBtn.addEventListener("click", () => {
      resetGame();
      showScreen(homeScreen);
    });
  
    // Next level from win screen
    nextLevelBtn.addEventListener("click", () => {
        resetGame();
      level++;
      levelDisplay.textContent = level;
      generateCards(level);
      startTimer();
      showScreen(gameScreen);
    });
  });
  