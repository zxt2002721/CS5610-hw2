const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    time: { type: Number, default: 0 }, // seconds to solve
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['easy', 'normal'], required: true },
  initialBoard: { type: [[Number]], required: true },
  solutionBoard: { type: [[Number]], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdByName: { type: String, default: 'Guest' },
  createdAt: { type: Date, default: Date.now },
  completedBy: { type: [completionSchema], default: [] },
});

module.exports = mongoose.model('Game', gameSchema);
