document.addEventListener("DOMContentLoaded", () => {
    // Select game screens and elements
    const homeScreen = document.getElementById("home-screen");
    const gameScreen = document.getElementById("game-screen");
    const winScreen = document.getElementById("win-screen");
    const gameBoard = document.getElementById("game-board");
    const singlePlayerBtn = document.getElementById("single-player-btn");
    const multiplayerBtn = document.getElementById("multiplayer-btn");
    const homeBtn = document.getElementById("home-btn");
    const backHomeBtn = document.getElementById("back-home-btn");
    const nextLevelBtn = document.getElementById("next-level-btn");
    const levelDisplay = document.getElementById("level");
    const scoreDisplay = document.getElementById("score-display");
    const multiplayerScore = document.getElementById("multiplayer-score");
    const player1ScoreDisplay = document.getElementById("player1-score");
    const player2ScoreDisplay = document.getElementById("player2-score");
    const timerDisplay = document.getElementById("time-left");
    const winMessage = document.getElementById("win-message");

    // Game state variables
    let level = 1;
    let currentCards = [];
    let matches = 0;
    let isMultiplayer = false;
    let currentPlayer = 1;
    let player1Score = 0;
    let player2Score = 0;
    let timer;
    let timeLeft = 60;

    // Define grid layout for each level
    const levelGrids = [
        { columns: 3, rows: 3 }, // Level 1 → 3x3 grid (9 cards)
        { columns: 4, rows: 3 }, // Level 2 → 3x4 grid (12 cards)
        { columns: 5, rows: 3 }, // Level 3 → 3x5 grid (15 cards)
        { columns: 6, rows: 3 }, // Level 4 → 3x6 grid (18 cards)
        { columns: 7, rows: 3 }  // Level 5 → 3x7 grid (21 cards)
    ];

    // Function to switch between screens
    function showScreen(screen) {
        homeScreen.classList.add("hidden");
        gameScreen.classList.add("hidden");
        winScreen.classList.add("hidden");
        screen.classList.remove("hidden");
    }

    // Function to start the countdown timer
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

    // Function to check if three flipped cards are a match
    function checkMatch() {
        const [card1, card2, card3] = currentCards;
        if (card1.dataset.value === card2.dataset.value && card2.dataset.value === card3.dataset.value) {
            matches++;
            currentCards.forEach(card => card.style.visibility = "hidden"); // Hide matched cards
            checkWinCondition(); // Check if the game is won
        } else {
            currentCards.forEach(card => {
                card.classList.remove("flipped");
                card.textContent = "?";
            });
        }
        currentCards = [];
    }

    // Function to generate game cards dynamically based on level
    function generateCards(level) {
        if (level > levelGrids.length) {
            winMessage.innerText = "🏆 Congratulations! You've completed all levels!";
            showScreen(winScreen);
            return;
        }

        const { columns, rows } = levelGrids[level - 1]; // Get grid layout for current level
        const numCards = columns * rows; // Total number of cards
        const cardValues = [];

        // Create sets of 3 matching cards
        for (let i = 0; i < numCards / 3; i++) {
            cardValues.push(i, i, i);
        }

        cardValues.sort(() => Math.random() - 0.5); // Shuffle cards randomly

        gameBoard.innerHTML = ""; // Clear previous board

        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        cardValues.forEach((value) => {
            const card = document.createElement("div"); // Create card element
            card.classList.add("card");
            card.dataset.value = value; // Store value for matching
            card.textContent = "?"; // Placeholder text
            card.addEventListener("click", flipCard); // Attach click event
            gameBoard.appendChild(card); // Add card to the board
        });

        adjustCardSize(columns, rows); // Resize cards based on grid
    }

    // Function to handle card flipping
    function flipCard() {
        if (this.classList.contains("flipped") || currentCards.length === 3) return;
        
        this.classList.add("flipped");
        this.textContent = this.dataset.value; // Show actual card value
        currentCards.push(this); // Store flipped card

        if (currentCards.length === 3) {
            setTimeout(checkMatch, 500); // Check match after delay
        }
    }

    // Function to adjust card sizes dynamically
    function adjustCardSize(columns, rows) {
        const gameBoardWidth = gameBoard.clientWidth;
        const gameBoardHeight = gameBoard.clientHeight;

        // Ensure card width and height scale properly within the game section
        const cardWidth = Math.min(gameBoardWidth / columns - 10, 100); // Adjust width
        const cardHeight = Math.min(gameBoardHeight / rows - 10, 150); // Adjust height

        document.querySelectorAll(".card").forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
        });
    }

    // Adjust card size when window resizes
    window.addEventListener("resize", () => {
        const { columns, rows } = levelGrids[level - 1];
        adjustCardSize(columns, rows);
    });

    // Function to check if player has won the level
    function checkWinCondition() {
        const { columns, rows } = levelGrids[level - 1];
        if (matches === (columns * rows) / 3) { // Level completion condition
            clearInterval(timer); // Stop timer
            if (isMultiplayer) {
                // Determine winner in multiplayer
                winMessage.innerText = player1Score > player2Score ? "🏆 Player 1 Wins!" : "🏆 Player 2 Wins!";
            } else {
                winMessage.innerText = "🎉 Yay! You Win! 🎉"; // Single player win message
            }
            showScreen(winScreen); // Switch to the win screen
        }
    }

    // Event listener for starting single-player mode
    singlePlayerBtn.addEventListener("click", () => {
        isMultiplayer = false;
        multiplayerScore.classList.add("hidden"); // Hide multiplayer score section
        showScreen(gameScreen);
        startTimer();
        generateCards(level); // Generate cards for level
    });

    // Event listener for starting multiplayer mode
    multiplayerBtn.addEventListener("click", () => {
        isMultiplayer = true;
        multiplayerScore.classList.remove("hidden"); // Show multiplayer score section
        showScreen(gameScreen);
        startTimer();
        generateCards(level);
    });

    // Event listener to return to home screen
    homeBtn.addEventListener("click", () => showScreen(homeScreen));
    backHomeBtn.addEventListener("click", () => showScreen(homeScreen));

    // Event listener to go to next level
    nextLevelBtn.addEventListener("click", () => {
        level++; // Increase level
        levelDisplay.textContent = level; // Update level display
        showScreen(gameScreen); // Switch to game screen
        generateCards(level); // Generate new level cards
        startTimer(); // Restart timer
    });

});
