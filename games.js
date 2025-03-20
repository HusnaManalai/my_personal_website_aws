document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
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
    const timerDisplay = document.getElementById("time-left");
    const winMessage = document.getElementById("win-message");
  
    // Score displays
    const singlePlayerScore = document.getElementById("score"); // inside "score-display"
    const multiplayerScore = document.getElementById("multiplayer-score");
    const player1Name = document.getElementById("player1-name");
    const player2Name = document.getElementById("player2-name");
    const player1ScoreDisplay = document.getElementById("player1-score");
    const player2ScoreDisplay = document.getElementById("player2-score");
  
    const musicToggleBtn = document.getElementById("music-toggle-btn");
    const bgMusic = new Audio("images/3.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    let isMusicPlaying = false; // our own flag
    
    musicToggleBtn.addEventListener("click", () => {
      if (!isMusicPlaying) {
        bgMusic.play();
        musicToggleBtn.innerText = "Music Off";
        isMusicPlaying = true;
      } else {
        bgMusic.pause();
        musicToggleBtn.innerText = "Music On";
        isMusicPlaying = false;
      }
    });
    
  
    // Game variables
    let level = 1;
    let matches = 0;
    let isMultiplayer = false;
    let currentPlayer = 1;
    let player1Score = 0;
    let player2Score = 0;
    let timer;
    let timeLeft = 60;
  
    // Utility: switch visible screen
    function showScreen(screen) {
      [homeScreen, gameScreen, winScreen].forEach(s => s.classList.add("hidden"));
      screen.classList.remove("hidden");
    }
  
    // Reset game state and clear timer
    function resetGame() {
      level = 1;
      matches = 0;
      currentPlayer = 1;
      player1Score = 0;
      player2Score = 0;
      if (isMultiplayer) {
        player1ScoreDisplay.textContent = "0";
        player2ScoreDisplay.textContent = "0";
      } else {
        singlePlayerScore.textContent = "0";
      }
      levelDisplay.textContent = "1";
      clearInterval(timer);
    }
  
    // Start countdown timer
    function startTimer() {
      clearInterval(timer);
      timeLeft = 20;
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
  
    // Generate game cards for the current level
    function generateCards(level) {
      matches = 0;
      const numCards = (level + 2) * 3;
      const cardValues = [];
      
      // Create three copies for each unique value
      for (let i = 0; i < numCards / 3; i++) {
        cardValues.push(i, i, i);
      }
      // Shuffle cards
      cardValues.sort(() => Math.random() - 0.5);
      
      gameBoard.innerHTML = "";
      // Dynamically adjust the number of columns based on card count:
      gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(numCards / 3)}, 1fr)`;
  
      cardValues.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");
        // Store the card face image path in dataset
        card.dataset.value = value;
        // Initially, show the card back
        card.innerHTML = `<img src="images/bg.png" alt="Card Back">`;
        
        card.addEventListener("click", function() {
          // Flip card if not already flipped and less than 3 cards are flipped
          if (
            !this.classList.contains("flipped") &&
            gameBoard.querySelectorAll(".flipped").length < 3
          ) {
            this.classList.add("flipped");
            // Show the card face image when flipped
            this.innerHTML = `<img src="images/${this.dataset.value}.png" alt="Card Face">`;
            
            const flippedCards = gameBoard.querySelectorAll(".flipped");
            if (flippedCards.length === 3) {
              setTimeout(() => {
                checkMatch(Array.from(flippedCards));
                flippedCards.forEach(card => {
                  card.classList.remove("flipped");
                  // Reset card back if not matched
                  if (card.style.visibility !== "hidden") {
                    card.innerHTML = `<img src="images/bg.png" alt="Card Back">`;
                  }
                });
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
        cards.forEach(card => (card.style.visibility = "hidden"));
        updateScore();
        checkWinCondition();
      } else {
        cards.forEach(card => {
          card.classList.remove("flipped");
          card.innerHTML = `<img src="images/card-back.png" alt="Card Back">`;
        });
      }
    }
  
    // Update turn indicator for multiplayer mode
    function updateTurnIndicator() {
      if (!isMultiplayer) return;
      if (currentPlayer === 1) {
        player1Name.style.fontWeight = "bold";
        player2Name.style.fontWeight = "normal";
      } else {
        player1Name.style.fontWeight = "normal";
        player2Name.style.fontWeight = "bold";
      }
    }
  
    // Update score based on game mode
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
        updateTurnIndicator();
      } else {
        let currentScore = parseInt(singlePlayerScore.textContent);
        singlePlayerScore.textContent = currentScore + 1;
      }
    }
  
    // Check win condition for current level
    function checkWinCondition() {
      if (matches >= (level + 2)) {
        clearInterval(timer);
        winMessage.innerText = isMultiplayer
          ? player1Score > player2Score
            ? "🏆 Player 1 Wins!"
            : "🏆 Player 2 Wins!"
          : "🎉 Yay! You Win! 🎉";
        showScreen(winScreen);
      }
    }
  
    // Start game: generate cards, start timer, and show game screen
    function startGame() {
      levelDisplay.textContent = level;
      generateCards(level);
      startTimer();
      showScreen(gameScreen);
      if (isMultiplayer) {
        currentPlayer = 1;
        updateTurnIndicator();
      }
    }
  
    // Event listeners
  
    // Single player mode: hide multiplayer scores and show single-player score
    singlePlayerBtn.addEventListener("click", () => {
      isMultiplayer = false;
      resetGame();
      if (multiplayerScore) multiplayerScore.style.display = "none";
      document.getElementById("score-display").style.display = "block";
      startGame();
    });
  
    // Multiplayer mode: hide single-player score and show multiplayer scores with turn highlighting
    multiplayerBtn.addEventListener("click", () => {
      isMultiplayer = true;
      resetGame();
      document.getElementById("score-display").style.display = "none";
      if (multiplayerScore) multiplayerScore.style.display = "block";
      currentPlayer = 1;
      updateTurnIndicator();
      startGame();
    });
  
    // Navigation buttons
    backHomeBtn.addEventListener("click", () => {
      resetGame();
      showScreen(homeScreen);
    });
  
    winHomeBtn.addEventListener("click", () => {
      resetGame();
      showScreen(homeScreen);
    });
  
    nextLevelBtn.addEventListener("click", () => {
      if (level < 5) {
        level++;
        levelDisplay.textContent = level;
        generateCards(level);
        startTimer();
        showScreen(gameScreen);
      } else {
        clearInterval(timer);
        winMessage.innerText = isMultiplayer
          ? (player1Score > player2Score ? "🏆 Player 1 Wins the Game!" : "🏆 Player 2 Wins the Game!")
          : "🎉 Congratulations! You Completed All 5 Levels!";
        showScreen(winScreen);
      }
    });
  });
  