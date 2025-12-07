const cloneBoard = (board) => board.map((row) => [...row]);

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getBoxSize = (size) => {
  if (size === 6) {
    return { height: 2, width: 3 };
  }
  return { height: 3, width: 3 };
};

// Determine if placing `num` at [row][col] is valid.
const isValid = (board, row, col, num, size) => {
  const { height, width } = getBoxSize(size);

  for (let i = 0; i < size; i += 1) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const startRow = Math.floor(row / height) * height;
  const startCol = Math.floor(col / width) * width;
  for (let r = 0; r < height; r += 1) {
    for (let c = 0; c < width; c += 1) {
      if (board[startRow + r][startCol + c] === num) {
        return false;
      }
    }
  }

  return true;
};

// Backtracking solver, mutates board to solved state.
const solveSudoku = (board, size) => {
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= size; num += 1) {
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

// Count number of solutions (used to enforce uniqueness).
const countSolutions = (board, size, limit = 2) => {
  let count = 0;

  const dfs = () => {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= size; num += 1) {
            if (isValid(board, row, col, num, size)) {
              board[row][col] = num;
              dfs();
              board[row][col] = 0;
              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }
    count += 1;
  };

  dfs();
  return count;
};

const generateBoard = (size) => {
  const board = Array.from({ length: size }, () => Array(size).fill(0));

  const fillBoard = (working) => {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (working[row][col] === 0) {
          const options = shuffle(Array.from({ length: size }, (_, i) => i + 1));
          for (const num of options) {
            if (isValid(working, row, col, num, size)) {
              working[row][col] = num;
              if (fillBoard(working)) return true;
              working[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillBoard(board);
  const solvedBoard = cloneBoard(board);

  const coords = shuffle(
    board.flatMap((row, rIdx) => row.map((_, cIdx) => [rIdx, cIdx])),
  );

  const targetFilled = size === 9 ? 30 : 18;

  for (const [r, c] of coords) {
    const filledCount = board.flat().filter((cell) => cell !== 0).length;
    if (filledCount <= targetFilled) break;

    const prev = board[r][c];
    board[r][c] = 0;

    const copy = cloneBoard(board);
    if (countSolutions(copy, size) !== 1) {
      board[r][c] = prev;
    }
  }

  return { initial: board, solved: solvedBoard };
};

const boardsMatch = (board, solution) => {
  if (!board || !solution || board.length !== solution.length) return false;
  for (let r = 0; r < board.length; r += 1) {
    if (board[r].length !== solution[r].length) return false;
    for (let c = 0; c < board[r].length; c += 1) {
      if (Number(board[r][c]) !== Number(solution[r][c])) return false;
    }
  }
  return true;
};

module.exports = {
  generateBoard,
  boardsMatch,
  solveSudoku,
};
