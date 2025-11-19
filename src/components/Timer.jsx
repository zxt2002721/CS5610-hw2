import React from 'react';
import { useGame } from '../context/GameContext';

const Timer = () => {
  const { timer } = useGame();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      Time: {formatTime(timer)}
    </div>
  );
};

export default Timer;

