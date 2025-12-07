import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { isValid } from '../utils/sudokuGenerator';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const cloneBoard = (b) => b.map((row) => [...row]);

export const GameProvider = ({ children }) => {
  const { user } = useAuth();
  const [board, setBoard] = useState(null);
  const [initialBoard, setInitialBoard] = useState(null);
  const [solutionBoard, setSolutionBoard] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameName, setGameName] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (board && !isGameOver) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [board, isGameOver]);

  const loadGame = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sudoku/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Unable to load game');
      const data = await res.json();
      if (!data.initialBoard || !data.solutionBoard) {
        throw new Error('Invalid game payload');
      }
      setGameId(id);
      setDifficulty(data.difficulty);
      setInitialBoard(cloneBoard(data.initialBoard));
      setSolutionBoard(data.solutionBoard);
      setBoard(data.hasCompleted ? cloneBoard(data.solutionBoard) : cloneBoard(data.initialBoard));
      setGameName(data.name);
      setIsWon(!!data.hasCompleted);
      setIsGameOver(!!data.hasCompleted);
      setTimer(0);
      setSelectedCell(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetGame = () => {
    if (!initialBoard) return;
    setBoard(cloneBoard(initialBoard));
    setIsGameOver(false);
    setIsWon(false);
    setTimer(0);
    setSelectedCell(null);
  };

  const submitWin = async (currentBoard) => {
    try {
      await fetch('/api/highscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ gameId, board: currentBoard, time: timer }),
      });
    } catch (err) {
      console.error('Failed to record win', err);
    }
  };

  const checkCompletion = (currentBoard) => {
    if (!solutionBoard) return;
    const flatCurrent = currentBoard.flat();
    const flatSolution = solutionBoard.flat();
    const filled = flatCurrent.every((n) => n !== 0);
    if (!filled) return;

    const matches = flatCurrent.every((n, idx) => Number(n) === Number(flatSolution[idx]));
    if (matches) {
      setIsGameOver(true);
      setIsWon(true);
      if (user) submitWin(currentBoard);
    }
  };

  const updateCell = (row, col, value) => {
    if (isGameOver || !board) return;
    if (!user) return; // logged out users can view only
    if (initialBoard[row][col] !== 0) return;

    const newBoard = cloneBoard(board);
    newBoard[row][col] = value;
    setBoard(newBoard);
    checkCompletion(newBoard);
  };

  const getHint = () => {
    if (isGameOver || !board) return;
    const size = difficulty === 'easy' ? 6 : 9;
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (board[r][c] === 0) {
          let validCount = 0;
          for (let n = 1; n <= size; n += 1) {
            if (isValid(board, r, c, n, size)) validCount += 1;
          }
          if (validCount === 1) {
            setSelectedCell({ row: r, col: c, isHint: true });
            return;
          }
        }
      }
    }
    // fallback to first empty cell
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (board[r][c] === 0) {
          setSelectedCell({ row: r, col: c, isHint: true });
          return;
        }
      }
    }
  };

  return (
    <GameContext.Provider
      value={{
        board,
        initialBoard,
        solutionBoard,
        difficulty,
        timer,
        isGameOver,
        isWon,
        resetGame,
        updateCell,
        selectedCell,
        setSelectedCell,
        getHint,
        loadGame,
        gameId,
        gameName,
        loading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
