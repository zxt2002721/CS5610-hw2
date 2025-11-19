import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import SudokuCell from './SudokuCell';
import { checkConflict } from '../utils/sudokuGenerator';
import './SudokuBoard.css';

const SudokuBoard = () => {
  const { 
    board, 
    initialBoard, 
    gameMode, 
    selectedCell, 
    setSelectedCell, 
    updateCell,
    isGameOver 
  } = useGame();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver || !selectedCell) return;

      const { row, col } = selectedCell;
      const size = gameMode === 'easy' ? 6 : 9;

      // Number input
      if (e.key >= '1' && e.key <= size.toString()) {
        updateCell(row, col, parseInt(e.key));
      }
      // Delete
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        updateCell(row, col, 0);
      }
      // Navigation
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, row: Math.max(0, prev.row - 1) }));
      }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, row: Math.min(size - 1, prev.row + 1) }));
      }
      else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, col: Math.max(0, prev.col - 1) }));
      }
      else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, col: Math.min(size - 1, prev.col + 1) }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isGameOver, gameMode, updateCell, setSelectedCell]);

  if (!board) return <div className="loading">Loading board...</div>;

  const size = gameMode === 'easy' ? 6 : 9;
  const boxWidth = 3;
  const boxHeight = gameMode === 'easy' ? 2 : 3;
  
  // CSS Grid template
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    gap: '0', 
    border: '2px solid #333',
    maxWidth: '500px',
    margin: '0 auto',
    userSelect: 'none'
  };

  return (
    <div className={`sudoku-board mode-${gameMode}`} style={gridStyle}>
      {board.map((row, rIndex) => (
        row.map((cellValue, cIndex) => {
          const isInitial = initialBoard[rIndex][cIndex] !== 0;
          const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
          const isHint = selectedCell?.isHint && isSelected;
          
          const conflict = cellValue !== 0 && checkConflict(board, rIndex, cIndex, cellValue, size);

          const cellStyle = {
             borderRight: (cIndex + 1) % boxWidth === 0 && cIndex !== size - 1 ? '2px solid #333' : '1px solid #ccc',
             borderBottom: (rIndex + 1) % boxHeight === 0 && rIndex !== size - 1 ? '2px solid #333' : '1px solid #ccc',
             borderLeft: cIndex === 0 ? 'none' : undefined,
          };

          return (
            <div key={`${rIndex}-${cIndex}`} style={cellStyle} className="cell-wrapper">
                <SudokuCell
                row={rIndex}
                col={cIndex}
                value={cellValue}
                isInitial={isInitial}
                isSelected={isSelected}
                isConflict={conflict}
                isHint={isHint}
                />
            </div>
          );
        })
      ))}
    </div>
  );
};

export default SudokuBoard;
