# Sudoku Project Writeup

## Challenges Faced
- **Full-stack wiring:** Keeping React, cookies, and the Express/Mongo stack in sync required careful proxy/CORS setup so `/api` calls stay authenticated locally and in production.
- **Persisted game data:** Moving Sudoku generation to the backend meant storing full boards/solutions in Mongo while keeping the UI responsive as it waited on network calls.
- **Scoring rules:** Tracking completions per game while preventing duplicate wins for the same user—and adjusting wins when a game is deleted—needed extra aggregation logic.

## Additional Features (Given More Time)
- Custom game creator that validates a user-authored 9x9 grid for uniqueness before adding it to the catalog.
- Richer gameplay tools (notes/pencil marks, undo stack, keyboard shortcuts beyond arrows).
- Public profile pages showing personal history and best times per game.
- Animation polish for tile fills, win states, and navigation transitions.

## Assumptions
- Logged-out visitors can browse every page and board but cannot change cell values or create/reset games until they authenticate.
- Session data can live in-memory on the server (acceptable for the assignment); passwords must be hashed before storage.
- Game names can be auto-generated from a large word list to satisfy the “unique name” rule without extra user input.

## Time Taken
Roughly 6 hours including planning, implementation, and sanity checks.

## Bonus Points Accomplished
- **Password Encryption (2 pts):** User passwords are hashed with bcrypt before being stored (`server/routes/userRoutes.js`).  
- **Delete Game (5 pts):** A DELETE `/api/sudoku/:id` endpoint exists and adjusts user win counts if a game with completions is removed (`server/routes/sudokuRoutes.js`).  
- **Backtracking Generation (carryover):** Boards are generated on the backend with uniqueness checks so every created game has a single solution (`server/utils/sudoku.js`).  
