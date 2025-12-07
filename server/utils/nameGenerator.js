const baseWords = [
  'Cedar', 'Maple', 'Ocean', 'Aurora', 'Cobalt', 'Amber', 'Velvet', 'Echo', 'Quartz',
  'Nova', 'Harbor', 'Pioneer', 'Saffron', 'Indigo', 'Glacier', 'Prairie', ' Summit',
  'Orchid', 'Marble', 'Copper', 'Canyon', 'Nimbus', 'Clover', 'Voyage', 'Horizon',
  'Lotus', 'Sierra', 'Cascade', 'Vertex', 'Arbor', 'Nimbus', 'Zephyr', 'Monarch',
  'Harbor', 'Juniper', 'Bamboo', 'Ivory', 'Sable', 'Slate', 'Crimson', 'Denim',
  'Pebble', 'Galaxy', 'Meteor', 'Fjord', 'Lagoon', 'Meadow', 'Timber', 'Moss', 'Flint',
];

const pick = () => baseWords[Math.floor(Math.random() * baseWords.length)] || 'Puzzle';

const buildName = () => `${pick()} ${pick()} ${pick()}`.replace(/\s+/g, ' ').trim();

// Attempt to generate a unique name given a Game model.
const generateUniqueName = async (GameModel) => {
  for (let i = 0; i < 20; i += 1) {
    const candidate = buildName();
    // eslint-disable-next-line no-await-in-loop
    const exists = await GameModel.exists({ name: candidate });
    if (!exists) return candidate;
  }
  return `${buildName()}-${Date.now()}`;
};

module.exports = { generateUniqueName };
