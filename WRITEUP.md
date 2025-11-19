# Sudoku Project Writeup

## Challenges Faced
One of the main challenges was implementing the Sudoku generator to ensure valid and uniquely solvable boards. Balancing the difficulty (number of removed cells) with the performance of the backtracking algorithm, especially for the uniqueness check, required careful tuning. Another challenge was managing the application state with React Context to handle game logic, timer, and local storage persistence simultaneously, ensuring that the game resumes correctly on refresh but starts fresh when navigating from the menu.

## Additional Features (Given More Time)
If I had more time, I would implement:
- **Keyboard Navigation:** Allow users to move selection with arrow keys (actually implemented this!).
- **Note Taking:** A "pencil mode" where users can annotate possible numbers in a cell.
- **Leaderboard Backend:** Replace the mocked high scores with a real backend service to store user times.
- **Animations:** Add smoother transitions for filling numbers and winning animations.

## Assumptions
- **6x6 Layout:** I assumed the 6x6 grid uses standard 2x3 subgrids (2 rows, 3 columns per block) based on common variations.
- **Uniqueness:** I assumed that "solvable one way" meant strictly checking that the board has exactly one solution after removing cells, which I implemented using a backtracking solver that counts solutions.
- **Persistence:** I assumed "Randomly generated" applies to new game sessions initiated from the menu, while browser refreshes should strictly resume the current session (Bonus requirement).

## Time Taken
This assignment took approximately 5 hours to complete, including planning, implementation, and testing.

## Bonus Points Accomplished

### 1. Local Storage (3 Points)
I implemented local storage persistence to save the game state (board, timer, mode) automatically on every change. The game resumes exactly where you left off if you refresh the browser.
- Code: `src/context/GameContext.jsx` (Lines 18-58)

### 2. Backtracking (3 Points)
The board is generated using a backtracking algorithm. I also implemented a uniqueness check where, after removing a cell, the solver verifies if the board still has exactly one solution. If not, the cell is put back.
- Code: `src/utils/sudokuGenerator.js` (Lines 40-83, 168-173)

### 3. Hint System (5 Points)
I added a "Hint" button that finds a cell with only one valid candidate (based on the current board state) or falls back to an empty cell, and highlights it for the user.
- Code: `src/context/GameContext.jsx` (Lines 142-178)
- UI: `src/components/SudokuCell.css` (Lines 38-43)

