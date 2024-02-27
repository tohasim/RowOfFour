window.addEventListener("load", start);

// ******** CONTROLLER ********
const GRID_ROWS = 6;
const GRID_COLS = 7;
const COMPUTER_THINKING_TIME = 1000;
let intervalId;
let currentPlayer = 1;

function start() {
	createBoard();
	createModel();
}

function addCoin(col) {
	let row = 0;
	while (readFromCell(row, col) === 0) {
		row++;
	}
	if (writeToCell(row - 1, col, currentPlayer)) {
		updateView();
		if (!checkForWinner(row - 1, col)) {
			nextTurn();
			console.table(model);
		}
	}
}

function checkForWinner(row, col) {
	let bestSequence = 1;
	bestSequence = Math.max(checkVertical(row, col), bestSequence);
	bestSequence = Math.max(checkHorizontal(row, col), bestSequence);
	bestSequence = Math.max(checkDiagonal(row, col), bestSequence);
	if (bestSequence === 4) {
		alert("WINNER!");
		return true;
	}
	return false;
}

function checkVertical(row, col) {
	let bestSequence = 1;
	while (bestSequence != 4 && row + bestSequence - 1 != GRID_ROWS) {
		if (readFromCell(row + bestSequence, col) === currentPlayer) {
			bestSequence++;
		} else {
			break;
		}
	}
	return bestSequence;
}

function checkDiagonal(row, col) {
	let rowCount = 0;
	let colCount = 0;

	let upRightLimit = 0;
	let downRightLimit = 0;
	let upLeftLimit = 0;
	let downLeftLimit = 0;

	while (readFromCell(row + rowCount, col + colCount) === currentPlayer) {
		rowCount--;
		colCount++;
		upRightLimit++;
	}
	rowCount = 0;
	colCount = 0;
	while (readFromCell(row + rowCount, col + colCount) === currentPlayer) {
		rowCount++;
		colCount++;
		downRightLimit++;
	}
	rowCount = 0;
	colCount = 0;
	while (readFromCell(row + rowCount, col + colCount) === currentPlayer) {
		rowCount--;
		colCount--;
		upLeftLimit++;
	}
	rowCount = 0;
	colCount = 0;
	while (readFromCell(row + rowCount, col + colCount) === currentPlayer) {
		rowCount++;
		colCount--;
		downLeftLimit++;
	}
	return Math.max(
		Math.abs(upRightLimit + downLeftLimit) - 1,
		Math.abs(upLeftLimit + downRightLimit) - 1
	);
}
function checkHorizontal(row, col) {
	let rightLimit = col;
	let leftLimit = col;
	while (readFromCell(row, rightLimit) === currentPlayer) {
		rightLimit++;
	}
	while (readFromCell(row, leftLimit) === currentPlayer) {
		leftLimit--;
	}
	return rightLimit - leftLimit - 1;
}

function nextTurn() {
	if (currentPlayer === 1) {
		currentPlayer = 2;
		setTimeout(computerTurn, COMPUTER_THINKING_TIME);
	} else {
		currentPlayer = 1;
	}
}

function computerTurn() {
	addCoin(Math.floor(Math.random() * GRID_COLS));
}

// ******** VIEW ********
function createBoard() {
	const board = document.getElementById("board");
	board.style.setProperty("--GRID_COLS", GRID_COLS);
	for (let col = 0; col < GRID_COLS; col++) {
		const button = document.createElement("button");
		button.textContent = "↓";
		button.classList.add("place-btn");
		board.appendChild(button);
		button.addEventListener("click", () => {
			if (currentPlayer === 1) addCoin(col);
		});
	}
	for (let row = 0; row < GRID_ROWS; row++) {
		for (let col = 0; col < GRID_COLS; col++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			board.appendChild(cell);
		}
	}
}

function updateView() {
	let cells = document.querySelectorAll(".cell");
	for (let row = 0; row < GRID_ROWS; row++) {
		for (let col = 0; col < GRID_COLS; col++) {
			if (model[row][col] === 1) {
				cells[row * GRID_COLS + col].classList.add("player1");
			} else if (model[row][col] === 2) {
				cells[row * GRID_COLS + col].classList.add("player2");
			}
		}
	}
}
// ******** MODEL ********

let model = [];
function createModel() {
	for (let row = 0; row < GRID_ROWS; row++) {
		const newRow = [];
		for (let col = 0; col < GRID_COLS; col++) {
			newRow[col] = 0;
		}
		model[row] = newRow;
	}
}

function readFromCell(row, col) {
	if (row < 0 || col < 0 || row >= GRID_ROWS || col >= GRID_COLS) return -1;
	return model[row][col];
}

function writeToCell(row, col, value) {
	if (row >= 0) {
		model[row][col] = value;
		return true;
	}
	return false;
}
