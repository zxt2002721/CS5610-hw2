// Check if a number can be placed at board[row][col]
export const isValid = (board, row, col, num, size) => {
  const boxHeight = size === 6 ? 2 : 3;
  const boxWidth = size === 6 ? 3 : 3;

  // Row check
  for (let x = 0; x < size; x++) {
    if (board[row][x] === num) return false;
  }

  // Col check
  for (let x = 0; x < size; x++) {
    if (board[x][col] === num) return false;
  }

  // Box check
  const startRow = Math.floor(row / boxHeight) * boxHeight;
  const startCol = Math.floor(col / boxWidth) * boxWidth;

  for (let i = 0; i < boxHeight; i++) {
    for (let j = 0; j < boxWidth; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

// Solves the board using backtracking
export const solveSudoku = (board, size) => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= size; num++) {
          if (isValid(board, row, col, num, size)) {
            board[row][col] = num;
            if (solveSudoku(board, size)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Count solutions (for uniqueness check)
const countSolutions = (board, size, limit = 2) => {
  let count = 0;
  
  const solve = () => {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= size; num++) {
            if (isValid(board, row, col, num, size)) {
              board[row][col] = num;
              solve();
              board[row][col] = 0;
              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }
    count++;
  };

  solve();
  return count;
};

export const generateBoard = (size) => {
  // Initialize empty board
  const board = Array.from({ length: size }, () => Array(size).fill(0));

  const fillBoard = (b) => {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (b[row][col] === 0) {
          const nums = Array.from({ length: size }, (_, i) => i + 1);
          // Shuffle numbers
          for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
          }
          
          for (const num of nums) {
            if (isValid(b, row, col, num, size)) {
              b[row][col] = num;
              if (fillBoard(b)) return true;
              b[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillBoard(board);
  const solvedBoard = JSON.parse(JSON.stringify(board)); // Copy full board

  // Remove cells
  // Easy: Keep 18. Normal: Keep 28-30.
  let targetFilled = size === 9 ? 30 : 18; // Approximate target
  
  // Create a list of all coordinates
  let coords = [];
  for(let r=0; r<size; r++) {
    for(let c=0; c<size; c++) {
      coords.push([r,c]);
    }
  }
  // Shuffle coords
  for (let i = coords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coords[i], coords[j]] = [coords[j], coords[i]];
  }

  for (const [r, c] of coords) {
    let filledCount = 0;
    for(let i=0; i<size; i++) 
      for(let j=0; j<size; j++) 
        if(board[i][j] !== 0) filledCount++;
        
    if (filledCount <= targetFilled) break;

    const backup = board[r][c];
    board[r][c] = 0;

    // Check uniqueness (Bonus)
    const boardCopy = JSON.parse(JSON.stringify(board));
    if (countSolutions(boardCopy, size) !== 1) {
      board[r][c] = backup; // Put it back if not unique
    }
  }
  
  return { initial: board, solved: solvedBoard };
};

export const checkConflict = (board, row, col, num, size) => {
  if (num === 0) return false;
  const boxHeight = size === 6 ? 2 : 3;
  const boxWidth = size === 6 ? 3 : 3;

  // Row check
  for (let x = 0; x < size; x++) {
    if (x !== col && board[row][x] === num) return true;
  }

  // Col check
  for (let x = 0; x < size; x++) {
    if (x !== row && board[x][col] === num) return true;
  }

  // Box check
  const startRow = Math.floor(row / boxHeight) * boxHeight;
  const startCol = Math.floor(col / boxWidth) * boxWidth;

  for (let i = 0; i < boxHeight; i++) {
    for (let j = 0; j < boxWidth; j++) {
      const r = startRow + i;
      const c = startCol + j;
      if ((r !== row || c !== col) && board[r][c] === num) return true;
    }
  }

  return false;
};
