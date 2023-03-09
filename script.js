const container = document.querySelector(".game");
const cells = document.querySelectorAll(".cell");
const winningMessageElement = document.getElementById("winningMessage");
const winningMsg = document.querySelector("[data-winning-message-text]");
const restartButton = document.getElementById("restart-btn");
const startButton = document.getElementById("start-btn");
const player1Name = document.getElementById("player1");
const player2Name = document.getElementById("player2");

const playerFactory = (name, marker) => {
  return { name, marker };
};

const getPlayerNames = () => {
  gameController.player1 = playerFactory(player1Name.value, "X");
  gameController.player2 = playerFactory(player2Name.value, "O");
};

const gameController = (() => {
  const player1 = playerFactory("Player 1", "X");
  const player2 = playerFactory("Player 2", "O");

  let currentPlayer = player1;
  let gameEnded = false;

  const gameBoard = (() => {
    let board = Array(9).fill(null);

    const initBoard = () => {
      board = Array(9).fill(null);
    };

    const getBoard = () => {
      return board;
    };

    const updateBoard = (index, marker) => {
      board[index] = marker;
    };

    return {
      initBoard,
      getBoard,
      updateBoard,
    };
  })();

  const addClickListeners = () => {
    cells.forEach((cell) => {
      cell.addEventListener("click", handleCellClick);
    });
  };

  const removeClickListeners = () => {
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleCellClick);
    });
  };

  const renderBoard = () => {
    const board = gameBoard.getBoard();

    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = board[i];
    }
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkForWinner = () => {
    const board = gameBoard.getBoard();

    // Check rows
    for (let i = 0; i < 9; i += 3) {
      if (
        board[i] !== null &&
        board[i] === board[i + 1] &&
        board[i] === board[i + 2]
      ) {
        return gameController["player" + (board[i] === "X" ? 1 : 2)];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[i] !== null &&
        board[i] === board[i + 3] &&
        board[i] === board[i + 6]
      ) {
        return gameController["player" + (board[i] === "X" ? 1 : 2)];
      }
    }

    // Check diagonals
    if (board[0] !== null && board[0] === board[4] && board[0] === board[8]) {
      return gameController["player" + (board[0] === "X" ? 1 : 2)];
    }
    if (board[2] !== null && board[2] === board[4] && board[2] === board[6]) {
      return gameController["player" + (board[2] === "X" ? 1 : 2)];
    }

    // No winner
    return null;
  };

  const announceWinner = (winner) => {
    // Show a message announcing the winner
    winningMsg.innerText = `${winner.name} (${winner.marker}) won the game!`;
    winningMessageElement.classList.add("show");

    // Remove click listeners and update game status
    removeClickListeners();
  };

  const announceDraw = () => {
    // Show a message announcing a draw
    winningMsg.innerText = "Draw!";
    winningMessageElement.classList.add("show");

    // Remove click listeners and update game status
    removeClickListeners();
  };

  const handleCellClick = (e) => {
    const cellIndex = e.target.dataset.index;
    if (gameBoard.getBoard()[cellIndex] === null && !gameEnded) {
      gameBoard.updateBoard(cellIndex, currentPlayer.marker);
      renderBoard();

      const winner = checkForWinner();
      if (winner !== null) {
        gameEnded = true;
        announceWinner(winner);
      } else if (gameBoard.getBoard().every((cell) => cell !== null)) {
        gameEnded = true;
        announceDraw();
      } else {
        switchPlayer();
      }
    }
  };

  const resetGame = () => {
    board = [null, null, null, null, null, null, null, null, null];
    container.style.display = "none";
    gameEnded = false;
    currentPlayer = player1;
    gameBoard.initBoard();
    renderBoard();
    addClickListeners();
    player1Name.value = "";
    player2Name.value = "";
  };

  const startGame = () => {
    container.style.display = "grid";
    gameBoard.initBoard();
    renderBoard();
    addClickListeners();
  };

  startButton.addEventListener("click", () => {
    getPlayerNames();
    gameController.startGame();
    winningMessageElement.classList.remove("show");
    container.classList.add("show1");
  });

  restartButton.addEventListener("click", () => {
    gameController.resetGame();
    winningMessageElement.classList.remove("show");
  });

  return {
    player1,
    player2,
    currentPlayer,
    gameEnded,
    startGame,
    resetGame,
  };
})();
