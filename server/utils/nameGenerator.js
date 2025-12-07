const fs = require('fs');
const path = require('path');
const wordListPath = require('word-list');

const rawWords = fs
  .readFileSync(path.resolve(wordListPath), 'utf8')
  .split('\n')
  .filter((w) => w.length >= 3 && w.length <= 10);

const pickWord = () => {
  const index = Math.floor(Math.random() * rawWords.length);
  const word = rawWords[index] || 'puzzle';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const buildName = () => `${pickWord()} ${pickWord()} ${pickWord()}`;

// Tries to generate a unique name by checking the Game collection.
const generateUniqueName = async (GameModel) => {
  for (let i = 0; i < 20; i += 1) {
    const nameCandidate = buildName();
    // eslint-disable-next-line no-await-in-loop
    const exists = await GameModel.exists({ name: nameCandidate });
    if (!exists) return nameCandidate;
  }
  return `${buildName()}-${Date.now()}`;
};

module.exports = { generateUniqueName };
