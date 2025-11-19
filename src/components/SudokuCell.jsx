import React from 'react';
import { useGame } from '../context/GameContext';
import './SudokuCell.css';

const SudokuCell = ({ 
  row, 
  col, 
  value, 
  isInitial, 
  isSelected, 
  isConflict, 
  isHint 
}) => {
  const { setSelectedCell } = useGame();

  const classes = [
    'sudoku-cell',
    isInitial ? 'initial' : '',
    isSelected ? 'selected' : '',
    isConflict ? 'conflict' : '',
    isHint ? 'hint' : '',
    value === 0 ? 'empty' : ''
  ].join(' ');

  return (
    <div 
      className={classes} 
      onClick={() => setSelectedCell({ row, col, isHint: false })}
      data-row={row}
      data-col={col}
    >
      {value !== 0 ? value : ''}
    </div>
  );
};

export default SudokuCell;
