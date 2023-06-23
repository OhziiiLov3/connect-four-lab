/*----- constants -----*/

const COLORS = {
  0: "white",
  1: "purple",
  "-1": "orange",
};

/*----- state variables -----*/

let board; // array of 7 column arrays
let turn; // 1 or -1
let winner; // null = no winner 1 or -1 = winner; 'T' === Tie

/*----- cached elements  -----*/
const msgEl = document.querySelector("h1");
const playAgainbtn = document.querySelector("button");
const markersEl = [...document.querySelectorAll("#markers > div")];

/*----- event listeners -----*/

document.getElementById("markers").addEventListener("click", handleDrop);
playAgainbtn.addEventListener('click',init);

/*----- functions -----*/
init();

// initialize all state, then call render()
function init() {
  // To visualize board mapping to Dom, rotate the board 90 degress counter-clockwise
  board = [
    [0, 0, 0, 0, 0, 0], // column 0
    [0, 0, 0, 0, 0, 0], // column 1
    [0, 0, 0, 0, 0, 0], // column 2
    [0, 0, 0, 0, 0, 0], // column 3
    [0, 0, 0, 0, 0, 0], // column 4
    [0, 0, 0, 0, 0, 0], // column 5
    [0, 0, 0, 0, 0, 0], // column 6
  ];
  turn = 1;
  winner = null;
  render();
}

// in response to user interaction update all impacted state(data) then call render()
function handleDrop(event) {
  const colIdx = markersEl.indexOf(event.target);
//   guards
if(colIdx === -1) return;
//   shortcut to col array 
const colArray = board[colIdx];
// find index of first zero in colArry 
const rowIdx = colArray.indexOf(0);
// update the board state(data) with the current player value (turn);
colArray[rowIdx] = turn;
turn *=  -1;
winner = getWinner(colIdx, rowIdx);


  render();
}
// check for winner in board state in the DOM
// return null if no winer , 1/-1 if a player has won, 'T' if tie
function getWinner(colIdx,rowIdx) {
    return checkVerticalWin(colIdx,rowIdx) || 
    checkHorizontalWin(colIdx,rowIdx) || 
    checkDiagonalWinNESW(colIdx,rowIdx) ||
    checkDiagonalWinNWSE(colIdx,rowIdx);
 
}

// vertical winner
function checkVerticalWin(colIdx,rowIdx) {
    return countAdjecent(colIdx,rowIdx,0,-1) === 3 ? board[colIdx][rowIdx] : null;
}
// horizontial winner 
function checkHorizontalWin(colIdx, rowIdx) {
    const adjacentCountLeft = countAdjecent(colIdx,rowIdx,-1, 0);
    const adjacentCountRight = countAdjecent(colIdx,rowIdx,1, 0);
  return (adjacentCountLeft + adjacentCountRight) >= 3
    ? board[colIdx][rowIdx]
    : null;
};
// diagonal winner - NESW
function checkDiagonalWinNESW(colIdx, rowIdx) {
    const adjacentCountNE = countAdjecent(colIdx,rowIdx,1, 1);
    const adjacentCountSW = countAdjecent(colIdx,rowIdx,-1, -1);
  return (adjacentCountNE + adjacentCountSW) >= 3
    ? board[colIdx][rowIdx]
    : null;
};


function checkDiagonalWinNWSE(colIdx, rowIdx) {
    const adjacentCountNW = countAdjecent(colIdx,rowIdx,-1, 1);
    const adjacentCountSE = countAdjecent(colIdx,rowIdx, 1, -1);
  return (adjacentCountNW + adjacentCountSE) >= 3
    ? board[colIdx][rowIdx]
    : null;
};









function countAdjecent(colIdx,rowIdx, colOffset, rowOffset) {
    // shortcut variable to player value
    const player = board[colIdx][rowIdx];
    // track count of adjacent cells with same player value 
    let count = 0;
    // initialize new cooridinates 
    colIdx += colOffset;
    rowIdx += rowOffset;
    while (
        // ensure colIdx is within bounds  of board array 
        board[colIdx] !== undefined && board[colIdx][rowIdx] !== undefined && board[colIdx][rowIdx] === player
    ) {
        count++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    }
    return count;
}

// Visaulize all state(data) in DOM
function render() {
  renderBoard();
  renderMessage();
  // hide/show UI elements -> controls on page(play button/markers)
  renderControls();
}

function renderBoard() {
  board.forEach((colArray, colIdx) => {
    // loops over cells in in current column(colArray)
    colArray.forEach((cellValue, rowIdx) => {
      const cellId = `col${colIdx}row${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.style.backgroundColor = COLORS[cellValue];

      // console.log(colIdx,rowIdx,cellValue);
    });
  });
}

function renderMessage() {
  if (winner === "T") {
    msgEl.innerText = "It's a Tie!!";
  } else if (winner) {
    msgEl.innerHTML = `<span style="color: ${COLORS[
      winner
    ].toUpperCase()} "> ${COLORS[winner].toUpperCase()} Wins! <span/>`;
  } else {
    // game is in play
    msgEl.innerHTML = `<span style="color: ${COLORS[
      turn
    ].toUpperCase()} "> ${COLORS[turn].toUpperCase()}'s Turn <span/>`;
  }
}

function renderControls() {
  // Ternary experssion is the go to when you want 1 of 2 values return
  // <cond expression> ? <truthy exp> : <falsy exp>
  playAgainbtn.style.visibility = winner ? "visible" : "hidden";
  // loop over marker elements to hide or show full(no zeros) col or not
  markersEl.forEach((markerEl, colIdx) => {
    const hideMarker = !board[colIdx].includes(0) || winner;
    markerEl.style.visibility = hideMarker ? "hidden" : "visible";
  });
}
