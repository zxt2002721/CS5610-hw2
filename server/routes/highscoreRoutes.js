const express = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const { boardsMatch } = require('../utils/sudoku');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/highscore', async (_req, res) => {
  try {
    const users = await User.find({ wins: { $gt: 0 } }).sort({ wins: -1, username: 1 });
    const games = await Game.find({ 'completedBy.0': { $exists: true } });
    const sortedGames = games.sort(
      (a, b) => (b.completedBy?.length || 0) - (a.completedBy?.length || 0),
    );

    return res.json({
      users: users.map((u) => ({ username: u.username, wins: u.wins })),
      games: sortedGames.map((g) => ({
        id: g._id.toString(),
        name: g.name,
        completionCount: g.completedBy?.length || 0,
        difficulty: g.difficulty,
      })),
    });
  } catch (err) {
    console.error('Get highscores error', err);
    return res.status(500).json({ error: 'Unable to fetch highscores' });
  }
});

router.get('/highscore/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const completions = [...(game.completedBy || [])].sort(
      (a, b) => (a.time || Infinity) - (b.time || Infinity),
    );

    return res.json({
      id: game._id.toString(),
      name: game.name,
      difficulty: game.difficulty,
      completions: completions.map((c) => ({
        username: c.username,
        time: c.time,
        completedAt: c.completedAt,
      })),
    });
  } catch (err) {
    console.error('Game highscore error', err);
    return res.status(500).json({ error: 'Unable to fetch game highscore' });
  }
});

router.post('/highscore', requireAuth, async (req, res) => {
  try {
    const { gameId, board, time } = req.body || {};
    if (!gameId || !Array.isArray(board)) {
      return res.status(400).json({ error: 'Missing game or board data' });
    }
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const alreadyCompleted = game.completedBy.some(
      (c) => c.user?.toString() === req.user._id.toString(),
    );
    if (alreadyCompleted) {
      return res.status(200).json({ message: 'Already recorded' });
    }

    if (!boardsMatch(board, game.solutionBoard)) {
      return res.status(400).json({ error: 'Submitted board is not solved correctly' });
    }

    game.completedBy.push({
      user: req.user._id,
      username: req.user.username,
      time: Number(time) || 0,
      completedAt: new Date(),
    });
    await game.save();

    req.user.wins = (req.user.wins || 0) + 1;
    req.user.completedGames = [...(req.user.completedGames || []), game._id];
    await req.user.save();

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Update highscore error', err);
    return res.status(500).json({ error: 'Unable to update highscore' });
  }
});

module.exports = router;
