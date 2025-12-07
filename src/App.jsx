import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameSelection from './pages/GameSelection';
import Game from './pages/Game';
import Rules from './pages/Rules';
import HighScores from './pages/HighScores';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<GameSelection />} />
      <Route path="/game/:id" element={<Game />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/scores" element={<HighScores />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;

