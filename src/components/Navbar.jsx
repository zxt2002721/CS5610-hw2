import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Sudoku</Link>
      </div>
      <div className="navbar-links">
        <Link to="/games">Play</Link>
        <Link to="/rules">Rules</Link>
        <Link to="/scores">High Scores</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;

