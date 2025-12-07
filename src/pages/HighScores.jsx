import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const HighScores = () => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const res = await fetch('/api/highscore', { credentials: 'include' });
        const data = await res.json();
        setUsers(data.users || []);
        setGames(data.games || []);
      } catch (err) {
        console.error('Failed to load scores', err);
      } finally {
        setLoading(false);
      }
    };
    loadScores();
  }, []);

  return (
    <div className="page scores-page">
      <Navbar />
      <div className="content">
        <h2>High Scores</h2>
        {loading ? (
          <div className="loading">Loading scores...</div>
        ) : (
          <>
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Wins</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3">No wins recorded yet.</td>
                  </tr>
                )}
                {users.map((score, index) => (
                  <tr key={score.username}>
                    <td>{index + 1}</td>
                    <td>{score.username}</td>
                    <td>{score.wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ marginTop: '24px' }}>Popular Games</h3>
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Difficulty</th>
                  <th>Completions</th>
                </tr>
              </thead>
              <tbody>
                {games.length === 0 && (
                  <tr>
                    <td colSpan="3">No completed games yet.</td>
                  </tr>
                )}
                {games.map((game) => (
                  <tr key={game.id}>
                    <td>{game.name}</td>
                    <td>{game.difficulty}</td>
                    <td>{game.completionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default HighScores;

