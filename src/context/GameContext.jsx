import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateBoard, isValid } from '../utils/sudokuGenerator';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [board, setBoard] = useState(null);
  const [initialBoard, setInitialBoard] = useState(null);
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [gameMode, setGameMode] = useState(null); // 'easy' or 'normal'
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sudokuState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Simple validation
        if (parsed.board && parsed.initialBoard) {
          setBoard(parsed.board);
          setInitialBoard(parsed.initialBoard);
          setSolvedBoard(parsed.solvedBoard);
          setGameMode(parsed.gameMode);
          setTimer(parsed.timer);
          setIsGameOver(parsed.isGameOver);
          setIsWon(parsed.isWon);
        }
      } catch (e) {
        console.error("Failed to parse saved game state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return; // Don't save before load
    if (isGameOver) return; // Don't save if game over (handled by clearing)

    if (board) {
      const stateToSave = {
        board,
        initialBoard,
        solvedBoard,
        gameMode,
        timer,
        isGameOver,
        isWon
      };
      localStorage.setItem('sudokuState', JSON.stringify(stateToSave));
    }
  }, [board, initialBoard, solvedBoard, gameMode, timer, isGameOver, isWon, isLoaded]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (board && !isGameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [board, isGameOver]);

  const startNewGame = (mode) => {
    const size = mode === 'easy' ? 6 : 9;
    const { initial, solved } = generateBoard(size);
    
    // Deep copy for current playing board
    const playingBoard = JSON.parse(JSON.stringify(initial));

    setBoard(playingBoard);
    setInitialBoard(initial); // This one won't change
    setSolvedBoard(solved);
    setGameMode(mode);
    setTimer(0);
    setIsGameOver(false);
    setIsWon(false);
    setSelectedCell(null);
    // Clear old game state from storage is implied by new save, 
    // but explicit removal might be safer to avoid mixing.
    // But the useEffect will overwrite it immediately.
    localStorage.removeItem('sudokuState'); 
  };

  const resetGame = () => {
    if (initialBoard) {
      setBoard(JSON.parse(JSON.stringify(initialBoard)));
      setTimer(0);
      setIsGameOver(false);
      setIsWon(false);
      setSelectedCell(null);
    }
  };

  const updateCell = (row, col, value) => {
    if (isGameOver) return;
    if (initialBoard[row][col] !== 0) return; // Cannot edit initial cells

    const newBoard = [...board];
    newBoard[row] = [...newBoard[row]];
    newBoard[row][col] = value;
    setBoard(newBoard);

    checkCompletion(newBoard);
  };

  const checkCompletion = (currentBoard) => {
    // Check if full
    const size = gameMode === 'easy' ? 6 : 9;
    let isFull = true;
    for(let r=0; r<size; r++) {
      for(let c=0; c<size; c++) {
        if (currentBoard[r][c] === 0) {
          isFull = false;
          break;
        }
      }
    }

    if (isFull) {
      // Check validity
      let valid = true;
      for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
          if (currentBoard[r][c] !== solvedBoard[r][c]) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        setIsWon(true);
        setIsGameOver(true);
        localStorage.removeItem('sudokuState'); 
      }
    }
  };
  
  const getHint = () => {
    if (isGameOver || !board) return;
    const size = gameMode === 'easy' ? 6 : 9;
    
    // Strategy: Find a cell with only 1 valid number given current board state
    let foundHint = false;

    for(let r=0; r<size; r++) {
      for(let c=0; c<size; c++) {
        if (board[r][c] === 0) {
          let validCount = 0;
          for(let num=1; num<=size; num++) {
             if (isValid(board, r, c, num, size)) {
               validCount++;
             }
          }
          
          if (validCount === 1) {
             setSelectedCell({ row: r, col: c, isHint: true });
             foundHint = true;
             return;
          }
        }
      }
    }
    
    // Fallback
    if (!foundHint) {
      for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
          if (board[r][c] === 0) {
            setSelectedCell({ row: r, col: c, isHint: true });
            return;
          }
        }
      }
    }
  };

  return (
    <GameContext.Provider value={{
      board,
      initialBoard,
      gameMode,
      timer,
      isGameOver,
      isWon,
      startNewGame,
      resetGame,
      updateCell,
      selectedCell,
      setSelectedCell,
      getHint,
      isLoaded
    }}>
      {children}
    </GameContext.Provider>
  );
};
