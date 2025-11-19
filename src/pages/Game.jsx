import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SudokuBoard from '../components/SudokuBoard';
import Timer from '../components/Timer';
import { useGame } from '../context/GameContext';
import './Game.css';

const Game = () => {
  const { mode } = useParams(); // 'easy' or 'normal'
  const navigate = useNavigate();
  const { 
    startNewGame, 
    resetGame, 
    isGameOver, 
    isWon, 
    getHint, 
    gameMode, 
    board, 
    isLoaded 
  } = useGame();

  useEffect(() => {
    if (mode !== 'easy' && mode !== 'normal') {
      navigate('/games');
      return;
    }

    if (isLoaded) {
      // If no board or mode mismatch, start new game.
      // Also if game is over, we probably want to start new? 
      // Or if the user navigated here specifically?
      // If I have a saved game that is OVER, it should have been cleared.
      
      // If gameMode exists and matches mode, we resume (don't call startNewGame).
      // Otherwise, start new.
      if (!board || gameMode !== mode) {
        startNewGame(mode);
      }
    }
  }, [mode, isLoaded, navigate]); // board and gameMode are checked inside but adding them to dependency might cause loop if startNewGame updates them.
  // We rely on isLoaded turning true once. And mode changing.
  // If board changes, we don't want to re-run this effect unless mode changed?
  // Correct.

  if (!isLoaded || (!board && isLoaded)) return <div className="loading">Loading...</div>;
  // Note: if !board and isLoaded, effect will trigger startNewGame, so we show loading briefly.

  return (
      <div className="page game-page">
        <Navbar />
        <div className="game-container">
          <div className="header">
             <h2>{mode === 'easy' ? 'Easy' : 'Normal'} Mode</h2>
             <Timer />
          </div>
          
          {isGameOver && (
             <div className={`game-over ${isWon ? 'won' : ''}`}>
                {isWon ? 'Congratulations! You Solved It!' : 'Game Over'}
             </div>
          )}
          
          <SudokuBoard />
          
          <div className="controls">
            <button onClick={() => startNewGame(mode)}>New Game</button>
            <button onClick={resetGame}>Reset</button>
            <button onClick={getHint} disabled={isGameOver}>Hint</button>
          </div>
        </div>
      </div>
  );
};

export default Game;
