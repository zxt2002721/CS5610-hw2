import React from 'react';
import Navbar from '../components/Navbar';

const HighScores = () => {
  const scores = [
    { id: 1, user: 'PuzzleMaster', solved: 42 },
    { id: 2, user: 'SudokuKing', solved: 30 },
    { id: 3, user: 'GridLocked', solved: 15 },
  ];

  return (
    <div className="page scores-page">
      <Navbar />
      <div className="content">
        <h2>High Scores</h2>
        <table className="scores-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Solved</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id}>
                <td>{index + 1}</td>
                <td>{score.user}</td>
                <td>{score.solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighScores;

