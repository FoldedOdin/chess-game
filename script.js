const board = document.getElementById('chessBoard');
const selectedInfo = document.getElementById('selectedInfo');
const historyList = document.getElementById('historyList');

let selectedSquare = null;
let turn = 'white';

const pieceSymbols = {
  'P': '♙', 'p': '♟',
  'R': '♖', 'r': '♜',
  'N': '♘', 'n': '♞',
  'B': '♗', 'b': '♝',
  'Q': '♕', 'q': '♛',
  'K': '♔', 'k': '♚'
};

// Simple 2D array for board state (FEN-based layout)
let gameState = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R']
];

function renderBoard() {
  board.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.className = `square ${((row + col) % 2 === 0) ? 'white' : 'black'}`;
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = gameState[row][col];
      if (piece) square.textContent = pieceSymbols[piece];

      square.addEventListener('click', onSquareClick);
      board.appendChild(square);
    }
  }
}

function onSquareClick(e) {
  const row = parseInt(e.currentTarget.dataset.row);
  const col = parseInt(e.currentTarget.dataset.col);
  const clickedPiece = gameState[row][col];

  if (selectedSquare) {
    const [selRow, selCol] = selectedSquare;
    const selectedPiece = gameState[selRow][selCol];

    if ((turn === 'white' && selectedPiece === selectedPiece.toUpperCase()) ||
        (turn === 'black' && selectedPiece === selectedPiece.toLowerCase())) {
      
      if (selRow !== row || selCol !== col) {
        movePiece(selRow, selCol, row, col);
        selectedSquare = null;
        selectedInfo.textContent = 'No square selected';
        renderBoard();
        return;
      }
    }
    selectedSquare = null;
    selectedInfo.textContent = 'No square selected';
    renderBoard();
    return;
  }

  if (clickedPiece) {
    const isWhite = clickedPiece === clickedPiece.toUpperCase();
    if ((turn === 'white' && isWhite) || (turn === 'black' && !isWhite)) {
      selectedSquare = [row, col];
      selectedInfo.textContent = `Selected: ${pieceSymbols[clickedPiece]} at ${String.fromCharCode(97 + col)}${8 - row}`;
      highlightSquare(row, col);
    }
  }
}

function movePiece(fromRow, fromCol, toRow, toCol) {
  const piece = gameState[fromRow][fromCol];
  const target = gameState[toRow][toCol];

  gameState[toRow][toCol] = piece;
  gameState[fromRow][fromCol] = '';

  const moveNotation = `${pieceSymbols[piece]} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + toCol)}${8 - toRow}`;
  const moveEntry = document.createElement('li');
  moveEntry.textContent = moveNotation;
  historyList.appendChild(moveEntry);

  turn = (turn === 'white') ? 'black' : 'white';
}

function highlightSquare(row, col) {
  renderBoard(); // Clear previous highlights
  const index = row * 8 + col;
  const square = board.children[index];
  if (square) square.classList.add('selected');
}

// Renders labels (optional enhancement)
function renderLabels() {
  const filesTop = document.getElementById('files-top');
  const filesBottom = document.getElementById('files-bottom');
  const ranksLeft = document.getElementById('ranks-left');
  const ranksRight = document.getElementById('ranks-right');

  const files = ['a','b','c','d','e','f','g','h'];
  const ranks = [8,7,6,5,4,3,2,1];

  for (let i = 0; i < 8; i++) {
    filesTop.innerHTML += `<div>${files[i]}</div>`;
    filesBottom.innerHTML += `<div>${files[i]}</div>`;
    ranksLeft.innerHTML += `<div>${ranks[i]}</div>`;
    ranksRight.innerHTML += `<div>${ranks[i]}</div>`;
  }
}

// Initial setup
renderLabels();
renderBoard();
