import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const GameSelection = () => {
  const games = [
    { id: 1, name: 'Easy Sudoku', author: 'System', path: '/games/easy' },
    { id: 2, name: 'Normal Sudoku', author: 'System', path: '/games/normal' }
  ];

  return (
    <div className="page selection-page">
      <Navbar />
      <div className="content">
        <h2>Select a Game</h2>
        <div className="game-list">
          {games.map(game => (
            <Link key={game.id} to={game.path} className="game-card">
              <h3>{game.name}</h3>
              <p>By {game.author}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelection;

