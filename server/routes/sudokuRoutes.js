const express = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const { generateUniqueName } = require('../utils/nameGenerator');
const { generateBoard } = require('../utils/sudoku');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const serializeGame = (game) => ({
  id: game._id.toString(),
  name: game.name,
  difficulty: game.difficulty,
  createdBy: game.createdByName,
  createdAt: game.createdAt,
  completionCount: game.completedBy?.length || 0,
});

router.get('/sudoku', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    return res.json(games.map(serializeGame));
  } catch (err) {
    console.error('List sudoku error', err);
    return res.status(500).json({ error: 'Unable to fetch games' });
  }
});

router.get('/sudoku/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const hasCompleted = req.user
      ? game.completedBy.some((c) => c.user?.toString() === req.user._id.toString())
      : false;

    return res.json({
      ...serializeGame(game),
      initialBoard: game.initialBoard,
      solutionBoard: game.solutionBoard,
      hasCompleted,
    });
  } catch (err) {
    console.error('Get sudoku error', err);
    return res.status(500).json({ error: 'Unable to fetch game' });
  }
});

router.post('/sudoku', requireAuth, async (req, res) => {
  try {
    const { mode } = req.body || {};
    const normalized = (mode || '').toLowerCase();
    if (!['easy', 'normal'].includes(normalized)) {
      return res.status(400).json({ error: 'Mode must be easy or normal' });
    }

    const size = normalized === 'easy' ? 6 : 9;
    const { initial, solved } = generateBoard(size);
    const name = await generateUniqueName(Game);

    const game = await Game.create({
      name,
      difficulty: normalized,
      initialBoard: initial,
      solutionBoard: solved,
      createdBy: req.user?._id || null,
      createdByName: req.user?.username || 'Guest',
    });

    return res.status(201).json({ id: game._id.toString(), name: game.name });
  } catch (err) {
    console.error('Create sudoku error', err);
    return res.status(500).json({ error: 'Unable to create game' });
  }
});

router.put('/sudoku/:id', requireAuth, async (req, res) => {
  try {
    const updates = {};
    if (req.body?.name) updates.name = req.body.name;
    if (req.body?.difficulty && ['easy', 'normal'].includes(req.body.difficulty)) {
      updates.difficulty = req.body.difficulty;
    }

    const game = await Game.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    return res.json(serializeGame(game));
  } catch (err) {
    console.error('Update sudoku error', err);
    return res.status(500).json({ error: 'Unable to update game' });
  }
});

router.delete('/sudoku/:id', requireAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Bonus: adjust wins for users who completed this game.
    const completions = game.completedBy || [];
    for (const completion of completions) {
      if (!completion.user) continue;
      // eslint-disable-next-line no-await-in-loop
      const user = await User.findById(completion.user);
      if (user) {
        user.wins = Math.max(0, (user.wins || 0) - 1);
        user.completedGames = (user.completedGames || []).filter(
          (g) => g.toString() !== game._id.toString(),
        );
        // eslint-disable-next-line no-await-in-loop
        await user.save();
      }
    }

    await game.deleteOne();
    return res.json({ ok: true });
  } catch (err) {
    console.error('Delete sudoku error', err);
    return res.status(500).json({ error: 'Unable to delete game' });
  }
});

module.exports = router;
