import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SudokuBoard from '../components/SudokuBoard';
import Timer from '../components/Timer';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import './Game.css';

const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    resetGame,
    isGameOver,
    isWon,
    getHint,
    difficulty,
    loadGame,
    board,
    gameName,
    loading,
  } = useGame();

  useEffect(() => {
    if (!id) {
      navigate('/games');
      return;
    }
    loadGame(id).catch(() => navigate('/games'));
  }, [id, navigate, loadGame]);

  if (loading || !board) return <div className="loading">Loading...</div>;

  return (
    <div className="page game-page">
      <Navbar />
      <div className="game-container">
        <div className="header">
          <div>
            <h2>{gameName || 'Sudoku Game'}</h2>
            <p className="subheading">{difficulty === 'easy' ? 'Easy' : 'Normal'} mode</p>
          </div>
          <Timer />
        </div>

        {!user && (
          <div className="notice">
            Logged out users can view the board but must login to make moves.
          </div>
        )}

        {isGameOver && (
          <div className={`game-over ${isWon ? 'won' : ''}`}>
            {isWon ? 'Congratulations! You solved it!' : 'Game Over'}
          </div>
        )}

        <SudokuBoard />

        <div className="controls">
          <button onClick={resetGame} disabled={!user}>
            Reset
          </button>
          <button onClick={getHint} disabled={isGameOver || !user}>
            Hint
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
