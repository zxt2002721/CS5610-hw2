import React from 'react';
import Navbar from '../components/Navbar';

const Rules = () => {
  return (
    <div className="page rules-page">
      <Navbar />
      <div className="content">
        <h2>Rules</h2>
        <p>The rules of Sudoku are simple: every column, row and sub-graph can only contain the numbers 1-X (where X is the height/width of the game board) exactly once.</p>
        <ul>
          <li>Each column must contain the numbers 1-9 (or 1-6) exactly once.</li>
          <li>Each row must contain the numbers 1-9 (or 1-6) exactly once.</li>
          <li>Each sub-grid must contain the numbers 1-9 (or 1-6) exactly once.</li>
        </ul>
        
        <div className="credits">
          <h3>Credits</h3>
          <p>Made by: Junkai Chen, Xiaotian Zhang</p>
          <p>GitHub: <a href="https://github.com/chenjunkai" target="_blank" rel="noreferrer">github.com/chenjunkai</a></p>
        </div>
      </div>
    </div>
  );
};

export default Rules;

