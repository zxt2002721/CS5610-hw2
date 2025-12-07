import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Sudoku</Link>
      </div>
      <div className="navbar-links">
        <Link to="/games">Play</Link>
        <Link to="/rules">Rules</Link>
        <Link to="/scores">High Scores</Link>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <div className="auth-cluster">
            <span className="username-pill">{user.username}</span>
            <button className="link-button" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

