const board = document.querySelector(".board");
const info = document.querySelector("#info");
const btnContainer = document.querySelector("#button-container");
const historyContainer = document.querySelector("#move-history-container");
const historyListContainer = document.querySelector("#move-history");
const coins = document.querySelector(".coin-container");
const selectorContainer = document.querySelector("#choose-player-container");

let boardState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let savedMoved = [];
let saveToRedo = [];
let positionHistory = [];
let currentPlayer;
let gameOver = false;

function chooseBtn() {
  const chooseBtnContainer = document.querySelector("#choose-btn-container");
  const player1 = document.createElement("button");
  const player2 = document.createElement("button");
  player1.classList.add("playerX");
  player2.classList.add("playerO");
  player1.textContent = 'Player 1 "X"';
  player2.textContent = 'Player 2 "O"';
  player1.addEventListener("click", () => choosePlayer("X"));
  player2.addEventListener("click", () => choosePlayer("O"));
  chooseBtnContainer.appendChild(player1);
  chooseBtnContainer.appendChild(player2);
}
chooseBtn();
function choosePlayer(player) {
  currentPlayer = player;
  displayBoard();
  info.textContent = `First Move : ${currentPlayer}`;
  selectorContainer.classList.add("disabled");
}

function displayBoard() {
  board.innerHTML = "";
  for (let row = 0; row < boardState.length; row++) {
    for (let col = 0; col < boardState[row].length; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.cursor = "pointer";
      cell.textContent = boardState[row][col];
      cell.addEventListener("click", () => clickHandler(row, col));
      board.appendChild(cell);
    }
  }

}
displayBoard();

function clickHandler(row, col) {
  if (boardState[row][col] === "" && !gameOver) {
    const playerSymbol = currentPlayer;
    boardState[row][col] = currentPlayer;
    info.textContent = `It's ${currentPlayer} turn`;
    savedMoved.push({ row, col, playerSymbol });
    displayBoard();
    updateHistory(playerSymbol, row, col);
    checkWinner();
    currentPlayer = currentPlayer === "O" ? "X" : "O";
  }
}

function checkWinner() {
  const allCells = document.querySelectorAll(".cell");

  let winningCombo = [
    [0, 1, 2], // row lines
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], //column lines
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], //diagonal lines
    [2, 4, 6],
  ];

  const isDraw = [...allCells].every((cells) => cells.textContent !== "");

  for (const combo of winningCombo) {
    const [a, b, c] = combo;

    if (
      allCells[a].textContent === currentPlayer &&
      allCells[b].textContent === currentPlayer &&
      allCells[c].textContent === currentPlayer
    ) {
      gameOver = true;
      info.textContent = `${currentPlayer} Player Wins`;
      setTimeout(()=>historyListContainer.classList.remove("disabled"), 700);
      coins.classList.remove("disabled");
      undoBtn();
      resetBtn();
      redoBtn();
      historyBtn();
      break;
    } else if (isDraw === true) {
      gameOver = true;
      info.textContent = "It's a draw";
      setTimeout(()=>historyListContainer.classList.remove("disabled"), 700);
      coins.classList.remove("disabled");
      undoBtn();
      resetBtn();
      redoBtn();
      historyBtn();
      break;
    }
  }
}

function updateHistory(playerSymbol, row, col) {
  const position = [
    ["Top-left", "Top-middle", "Top-right"],
    ["Mid-left", "Middle", "Mid-right"],
    ["Bottom-left", "Bottom-middle", "Bottom-right"],
  ];

  const targetPosition = position[row][col];
  positionHistory.push(targetPosition);
  const li = document.createElement("li");
  li.classList.add("moveList");
  li.textContent = `${playerSymbol}   ${targetPosition}`;
  historyListContainer.appendChild(li);
}

function historyBtn() {
  const historyBtn = document.createElement("button");
  historyBtn.classList.add("historyBtn");
  historyBtn.textContent = "history";
  historyBtn.addEventListener("click", () =>
    historyListContainer.classList.toggle("disabled")
  );
  historyContainer.appendChild(historyBtn);
}

function undoBtn() {
  const undoBtn = document.createElement("button");
  undoBtn.classList.add("undoBtn");
  undoBtn.textContent = "prev";
  undoBtn.addEventListener("click", undoBoard);
  btnContainer.appendChild(undoBtn);
}

function redoBtn() {
  const redoBtn = document.createElement("button");
  redoBtn.classList.add("redoBtn");
  redoBtn.textContent = "next";
  redoBtn.addEventListener("click", redoBoard);
  btnContainer.appendChild(redoBtn);
}

function undoBoard() {
  if (savedMoved.length === 0) {
    const undoBtn = document.querySelector(".undoBtn");
    undoBtn.removeEventListener("click", undoBoard);
  } else if (savedMoved.length > 1) {
    let lastMove = savedMoved.pop();
    let { row, col } = lastMove;
    saveToRedo.push(lastMove);
    boardState[row][col] = "";
    displayBoard();
  }
}

function redoBoard() {
  if (saveToRedo.length >= 1) {
    const lastUndo = saveToRedo.pop();
    const { row, col, playerSymbol } = lastUndo;
    boardState[row][col] = playerSymbol;
    displayBoard();
    savedMoved.push(lastUndo);
  }
}

function resetBtn() {
  const resetBtn = document.createElement("button");
  resetBtn.classList.add("resetBtn");
  resetBtn.textContent = "reset";
  resetBtn.addEventListener("click", updateBoard);
  btnContainer.appendChild(resetBtn);
}

function updateBoard() {
  boardState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  currentPlayer = "O";
  gameOver = false;
  savedMoved = [];
  saveToRedo = [];
  positionHistory = [];
  selectorContainer.classList.remove("disabled");
  historyListContainer.classList.add("disabled");
  historyListContainer.innerHTML = "";
  historyContainer.innerHTML = "";
  info.textContent = 'First Move  "X"';
  btnContainer.innerHTML = "";
  coins.classList.add("disabled");
  displayBoard();
}
