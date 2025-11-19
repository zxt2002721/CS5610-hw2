import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="page home-page">
      <Navbar />
      <div className="content">
        <h1>Welcome to Sudoku</h1>
        <p>Experience the classic puzzle game.</p>
        <div className="actions">
          <Link to="/games" className="btn-primary">Play Game</Link>
          <Link to="/rules" className="btn-secondary">Rules</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

