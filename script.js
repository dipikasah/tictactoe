const gameBoard = document.getElementById('game-board');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const startButton = document.getElementById('start-button');
const playerCountInput = document.getElementById('player-count');

let currentPlayerIndex = 0;
let players = [];
let board = [];
let gameActive = true;

// Get number of players and initialize
const initializeGame = () => {
    const playerCount = parseInt(playerCountInput.value);

    if (isNaN(playerCount) || playerCount < 2 || playerCount > 10) {
        alert("Please enter a valid number of players between 2 and 10.");
        return;
    }

    players = Array.from({ length: playerCount }, (_, i) => String.fromCharCode(88 + i)); // Generate symbols for players (X, O, P, Q...)
    const gridSize = Math.ceil(Math.sqrt(playerCount * playerCount)); // Dynamically calculate grid size

    board = Array(gridSize * gridSize).fill('');
    currentPlayerIndex = 0;
    gameActive = true;
    status.textContent = `Player ${players[currentPlayerIndex]}'s turn`;

    generateBoard(gridSize);

    resetButton.style.display = 'block';
};

// Generate dynamic game board
const generateBoard = (gridSize) => {
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    gameBoard.innerHTML = '';

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.cell = i;
        cell.addEventListener('click', handleClick);
        gameBoard.appendChild(cell);
    }
};

// Check for a winner
const checkWinner = () => {
    const gridSize = Math.sqrt(board.length);
    const winPatterns = [];

    // Rows, Columns, and Diagonals win conditions
    for (let i = 0; i < gridSize; i++) {
        winPatterns.push([...Array(gridSize)].map((_, j) => i * gridSize + j)); // Rows
        winPatterns.push([...Array(gridSize)].map((_, j) => i + j * gridSize)); // Columns
    }
    winPatterns.push([...Array(gridSize)].map((_, i) => i * (gridSize + 1))); // Diagonal \
    winPatterns.push([...Array(gridSize)].map((_, i) => (i + 1) * (gridSize - 1))); // Diagonal /

    for (const pattern of winPatterns) {
        const [a, ...rest] = pattern;
        if (board[a] && rest.every(index => board[index] === board[a])) {
            gameActive = false;
            status.textContent = `Player ${players[currentPlayerIndex]} wins!`;
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        status.textContent = 'It\'s a draw!';
    }
};

// Handle cell click
const handleClick = (e) => {
    const cellIndex = e.target.dataset.cell;

    if (board[cellIndex] !== '' || !gameActive) return;

    board[cellIndex] = players[currentPlayerIndex];
    e.target.textContent = players[currentPlayerIndex];

    checkWinner();

    if (gameActive) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        status.textContent = `Player ${players[currentPlayerIndex]}'s turn`;
    }
};

// Reset game
const resetGame = () => {
    board.fill('');
    currentPlayerIndex = 0;
    gameActive = true;
    status.textContent = `Player ${players[currentPlayerIndex]}'s turn`;

    gameBoard.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });
};

// Start button to initialize game with specific number of players
startButton.addEventListener('click', initializeGame);
resetButton.addEventListener('click', resetGame);
