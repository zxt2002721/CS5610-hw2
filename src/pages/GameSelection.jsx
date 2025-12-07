import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const GameSelection = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchGames = async () => {
    try {
      const res = await fetch('/api/sudoku', { credentials: 'include' });
      const data = await res.json();
      setGames(data || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createGame = async (mode) => {
    if (!user) {
      setError('Login required to create a game.');
      return;
    }
    setError('');
    const res = await fetch('/api/sudoku', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ mode }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || 'Unable to create game');
      return;
    }
    const data = await res.json();
    navigate(`/game/${data.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="page selection-page">
      <Navbar />
      <div className="content">
        <h2>Select a Game</h2>
        <p>Create a new puzzle or hop into an existing one.</p>
        <div className="actions">
          <button onClick={() => createGame('normal')} disabled={!user}>
            Create Normal Game
          </button>
          <button onClick={() => createGame('easy')} disabled={!user}>
            Create Easy Game
          </button>
        </div>
        {!user && <div className="notice">Login to create or play games.</div>}
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div className="loading">Loading games...</div>
        ) : (
          <div className="game-list">
            {games.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`} className="game-card">
                <div className="card-top">
                  <h3>{game.name}</h3>
                  <span className="pill">{game.difficulty}</span>
                </div>
                <p>By {game.createdBy}</p>
                <p className="muted">Created {formatDate(game.createdAt)}</p>
                <p className="muted">{game.completionCount} completions</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSelection;

