const board = document.getElementById('chessBoard');
    const selectedInfo = document.getElementById('selectedInfo');
    const filesTop = document.getElementById('files-top');
    const filesBottom = document.getElementById('files-bottom');
    const ranksLeft = document.getElementById('ranks-left');
    const ranksRight = document.getElementById('ranks-right');
    const historyList = document.getElementById('historyList');

    const initialBoard = [
      ['♜','♞','♝','♛','♚','♝','♞','♜'],
      ['♟','♟','♟','♟','♟','♟','♟','♟'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['♙','♙','♙','♙','♙','♙','♙','♙'],
      ['♖','♘','♗','♕','♔','♗','♘','♖']
    ];

    let selected = null;
    let turn = 'white';

    function toChessNotation(row, col) {
      const file = String.fromCharCode(65 + col);
      const rank = 8 - row;
      return `${file}${rank}`;
    }

    function createBoard() {
      board.innerHTML = '';
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const square = document.createElement('div');
          square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
          square.dataset.row = row;
          square.dataset.col = col;
          square.textContent = initialBoard[row][col];

          square.addEventListener('click', () => handleClick(row, col));

          board.appendChild(square);
        }
      }
    }

    function populateNotations() {
      const files = ['A','B','C','D','E','F','G','H'];
      const ranks = ['8','7','6','5','4','3','2','1'];

      filesTop.innerHTML = '';
      filesBottom.innerHTML = '';
      ranksLeft.innerHTML = '';
      ranksRight.innerHTML = '';

      for (let i = 0; i < 8; i++) {
        const fileTop = document.createElement('div');
        const fileBottom = document.createElement('div');
        const rankLeft = document.createElement('div');
        const rankRight = document.createElement('div');

        fileTop.textContent = files[i];
        fileBottom.textContent = files[i];
        rankLeft.textContent = ranks[i];
        rankRight.textContent = ranks[i];

        filesTop.appendChild(fileTop);
        filesBottom.appendChild(fileBottom);
        ranksLeft.appendChild(rankLeft);
        ranksRight.appendChild(rankRight);
      }
    }

    function handleClick(row, col) {
      const piece = initialBoard[row][col];
      const squareIndex = row * 8 + col;
      const allSquares = board.querySelectorAll('.square');

      if (selected) {
        const [prevRow, prevCol] = selected;
        if (prevRow !== row || prevCol !== col) {
          const moveFrom = toChessNotation(prevRow, prevCol);
          const moveTo = toChessNotation(row, col);
          const movedPiece = initialBoard[prevRow][prevCol];

          initialBoard[row][col] = movedPiece;
          initialBoard[prevRow][prevCol] = '';
          turn = turn === 'white' ? 'black' : 'white';

          const historyItem = document.createElement('li');
          historyItem.textContent = `${movedPiece} ${moveFrom} → ${moveTo}`;
          historyList.appendChild(historyItem);
        }
        selected = null;
        selectedInfo.textContent = 'No square selected';
        allSquares.forEach(sq => sq.classList.remove('selected'));
      } else if (piece && isCorrectTurn(piece)) {
        selected = [row, col];
        selectedInfo.textContent = `Selected square: (${row}, ${col}) → ${toChessNotation(row, col)}`;
        allSquares[squareIndex].classList.add('selected');
      }

      createBoard();
    }

    function isCorrectTurn(piece) {
      return (turn === 'white' && piece === piece.toUpperCase()) ||
             (turn === 'black' && piece === piece.toLowerCase());
    }

    populateNotations();
    createBoard();