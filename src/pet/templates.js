const PET_TEMPLATES = {
  common: [
    { name: 'Slime', species: 'slime', type: 'monster', hp: 80, attack: 5, defense: 3, growth: 'D', description: 'A bouncy blob of goo. Simple but loyal.' },
    { name: 'Whiskers', species: 'cat', type: 'animal', hp: 70, attack: 8, defense: 4, growth: 'D', description: 'A curious cat with sharp claws.' },
    { name: 'Bark', species: 'dog', type: 'animal', hp: 90, attack: 7, defense: 5, growth: 'D', description: 'A faithful companion with strong jaws.' },
    { name: 'Squeaks', species: 'mouse', type: 'animal', hp: 50, attack: 6, defense: 2, growth: 'D', description: 'Small but surprisingly fast.' },
    { name: 'Chirpy', species: 'bird', type: 'animal', hp: 55, attack: 9, defense: 2, growth: 'D', description: 'A swift flyer with sharp beak.' },
    { name: 'Shelly', species: 'turtle', type: 'animal', hp: 120, attack: 4, defense: 8, growth: 'D', description: 'Slow but has a rock-hard shell.' },
    { name: 'Ribbit', species: 'frog', type: 'animal', hp: 60, attack: 7, defense: 3, growth: 'D', description: 'Can leap high and poison enemies.' },
    { name: 'Rocky', species: 'golem', type: 'monster', hp: 150, attack: 6, defense: 10, growth: 'D', description: 'Made of stone. Extremely durable.' },
    { name: 'Buzzy', species: 'bee', type: 'animal', hp: 45, attack: 10, defense: 1, growth: 'D', description: 'Small but packs a painful sting.' },
    { name: 'Chomp', species: 'piranha', type: 'animal', hp: 40, attack: 11, defense: 2, growth: 'D', description: 'Frenzied biter from the rivers.' },
    { name: 'Fuzzbear', species: 'bear_cub', type: 'animal', hp: 100, attack: 8, defense: 6, growth: 'D', description: 'Adorable now, terrifying later.' },
    { name: 'Hoot', species: 'owl', type: 'animal', hp: 60, attack: 9, defense: 3, growth: 'D', description: 'Silent hunter of the night.' },
    { name: 'Nippy', species: 'ferret', type: 'animal', hp: 55, attack: 8, defense: 3, growth: 'D', description: 'Quick and mischievous.' },
    { name: 'Pincers', species: 'beetle', type: 'animal', hp: 90, attack: 6, defense: 7, growth: 'D', description: 'Hard shell, stronger pinch.' },
    { name: 'Snappy', species: 'lizard', type: 'animal', hp: 65, attack: 7, defense: 4, growth: 'D', description: 'Quick reflexes, warm blood.' },
    { name: 'Squish', species: 'octopus', type: 'animal', hp: 70, attack: 8, defense: 5, growth: 'D', description: 'Eight arms of trouble.' },
    { name: 'Waddle', species: 'penguin', type: 'animal', hp: 75, attack: 6, defense: 6, growth: 'D', description: 'Looks silly, fights hard.' },
    { name: 'Yappy', species: 'hamster', type: 'animal', hp: 40, attack: 7, defense: 2, growth: 'D', description: 'Tiny but fierce energy.' },
    { name: 'Fins', species: 'goldfish', type: 'animal', hp: 35, attack: 5, defense: 1, growth: 'D', description: 'Surprisingly determined.' },
    { name: 'Crawly', species: 'ant', type: 'animal', hp: 30, attack: 6, defense: 2, growth: 'D', description: 'Weak alone, strong in spirit.' },
  ],
  rare: [
    { name: 'Fang', species: 'wolf', type: 'monster', hp: 110, attack: 14, defense: 7, growth: 'C', description: 'Pack hunter with devastating bite.' },
    { name: 'Ember', species: 'fox', type: 'monster', hp: 90, attack: 12, defense: 6, growth: 'C', description: 'Cunning and fast with fire tricks.' },
    { name: 'Hop', species: 'bunny', type: 'animal', hp: 80, attack: 10, defense: 5, growth: 'C', description: "Don't let the cuteness fool you." },
    { name: 'Snap', species: 'crocodile', type: 'monster', hp: 140, attack: 15, defense: 9, growth: 'C', description: 'Ancient predator with iron jaws.' },
    { name: 'Hiss', species: 'snake', type: 'monster', hp: 75, attack: 13, defense: 4, growth: 'C', description: 'Stealthy striker with venomous fangs.' },
    { name: 'Claw', species: 'crab', type: 'monster', hp: 100, attack: 11, defense: 12, growth: 'C', description: 'Hard shell and crushing claws.' },
    { name: 'Quill', species: 'porcupine', type: 'animal', hp: 95, attack: 10, defense: 11, growth: 'C', description: 'Spines make it hard to attack.' },
    { name: 'Hornet', species: 'giant_wasp', type: 'monster', hp: 70, attack: 16, defense: 3, growth: 'C', description: 'Aggressive flyer with toxic sting.' },
    { name: 'Tusker', species: 'boar', type: 'animal', hp: 130, attack: 13, defense: 8, growth: 'C', description: 'Charging force of nature.' },
    { name: 'Raptor', species: 'hawk', type: 'animal', hp: 85, attack: 15, defense: 4, growth: 'C', description: 'Skydiver with razor talons.' },
    { name: 'Snarl', species: 'hyena', type: 'monster', hp: 105, attack: 14, defense: 6, growth: 'C', description: 'Laughing predator, never gives up.' },
    { name: 'Shellback', species: 'armadillo', type: 'animal', hp: 120, attack: 9, defense: 14, growth: 'C', description: 'Roll up and bash through anything.' },
  ],
  epic: [
    { name: 'Blaze', species: 'dragon', type: 'monster', hp: 160, attack: 22, defense: 12, growth: 'B', description: 'Breathes fire, king of the skies.' },
    { name: 'Solar', species: 'phoenix', type: 'monster', hp: 130, attack: 20, defense: 8, growth: 'B', description: 'Reborn from its own ashes.' },
    { name: 'Sparkle', species: 'unicorn', type: 'monster', hp: 140, attack: 18, defense: 14, growth: 'B', description: 'Magical horn purifies all wounds.' },
    { name: 'Shadow', species: 'demon', type: 'monster', hp: 120, attack: 25, defense: 6, growth: 'B', description: 'Feeds on fear and darkness.' },
    { name: 'Frost', species: 'ice_wolf', type: 'monster', hp: 150, attack: 19, defense: 11, growth: 'B', description: 'Breathes freezing wind.' },
    { name: 'Thorn', species: 'treant', type: 'monster', hp: 180, attack: 16, defense: 16, growth: 'B', description: 'Ancient tree guardian.' },
    { name: 'Viper', species: 'wyvern', type: 'monster', hp: 135, attack: 21, defense: 9, growth: 'B', description: 'Flying reptile with toxic tail.' },
    { name: 'Tide', species: 'sea_serpent', type: 'monster', hp: 145, attack: 17, defense: 13, growth: 'B', description: 'Rules the deep oceans.' },
  ],
  legendary: [
    { name: 'Inferno', species: 'ancient_dragon', type: 'monster', hp: 220, attack: 35, defense: 20, growth: 'A', description: 'The oldest and most powerful dragon.' },
    { name: 'Luna', species: 'celestial_wolf', type: 'monster', hp: 200, attack: 30, defense: 18, growth: 'A', description: 'Guardian of the moonlit night.' },
    { name: 'Hydra', species: 'hydra', type: 'monster', hp: 250, attack: 28, defense: 25, growth: 'A', description: 'Cut one head, two more appear.' },
    { name: 'Zero', species: 'void_lord', type: 'monster', hp: 180, attack: 38, defense: 15, growth: 'A', description: 'Master of dimensions and time.' },
  ],
};

const GROWTH_RATES = {
  D: { hp: 2, attack: 1, defense: 0.5 },
  C: { hp: 4, attack: 2, defense: 1 },
  B: { hp: 6, attack: 3, defense: 1.5 },
  A: { hp: 8, attack: 4, defense: 2 },
  S: { hp: 10, attack: 5, defense: 2.5 },
};

const ITEM_TEMPLATES = [
  { name: 'Basic Food', type: 'food', exp: 50, price: 50, description: '+50 EXP. A simple meal for your pet.' },
  { name: 'Premium Food', type: 'food', exp: 200, price: 200, description: '+200 EXP. A delicious feast.' },
  { name: 'Ultra Food', type: 'food', exp: 500, price: 1000, description: '+500 EXP. A royal banquet.' },
  { name: 'Rare Drop', type: 'food', exp: 100, price: 0, description: '+100 EXP. A mysterious item from battle.' },
  { name: 'Epic Drop', type: 'food', exp: 300, price: 0, description: '+300 EXP. A legendary treasure.' },
];

const RARITY_WEIGHTS = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5,
};

const EGG_PRICES = {
  common: 100,
  rare: 500,
  epic: 2500,
  legendary: 15000,
};

const RARITY_EMOJI = {
  common: '⚪',
  rare: '🔵',
  epic: '🟣',
  legendary: '🟡',
};

const GROWTH_EMOJI = {
  D: '🥉',
  C: '🥈',
  B: '🥇',
  A: '💎',
  S: '👑',
};

const MAX_LEVEL = 50;
const PRESTIGE_BONUS = 0.2;

function rollRarity() {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }
  return 'common';
}

function getRandomPetByRarity(rarity) {
  const pets = PET_TEMPLATES[rarity];
  return pets[Math.floor(Math.random() * pets.length)];
}

function getExpToLevel(level) {
  return level * 100;
}

function getTrainingCost(level) {
  return 20 * level;
}

function getTrainingExp(level) {
  return level * 10;
}

function getSellPrice(rarity) {
  const prices = { common: 50, rare: 250, epic: 1250, legendary: 7500 };
  return prices[rarity] || 50;
}

function insertPetTemplates(db) {
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO pet_templates (name, species, rarity, base_hp, base_attack, base_defense, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertMany = db.transaction(() => {
    for (const [rarity, pets] of Object.entries(PET_TEMPLATES)) {
      for (const pet of pets) {
        stmt.run(pet.name, pet.species, rarity, pet.hp, pet.attack, pet.defense, pet.description);
      }
    }
  });
  insertMany();
}

function insertItemTemplates(db) {
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO item_templates (name, type, exp_value, price, description) VALUES (?, ?, ?, ?, ?)'
  );
  const insertMany = db.transaction(() => {
    for (const item of ITEM_TEMPLATES) {
      stmt.run(item.name, item.type, item.exp, item.price, item.description);
    }
  });
  insertMany();
}

module.exports = {
  PET_TEMPLATES,
  GROWTH_RATES,
  ITEM_TEMPLATES,
  RARITY_WEIGHTS,
  EGG_PRICES,
  RARITY_EMOJI,
  GROWTH_EMOJI,
  MAX_LEVEL,
  PRESTIGE_BONUS,
  rollRarity,
  getRandomPetByRarity,
  getExpToLevel,
  getTrainingCost,
  getTrainingExp,
  getSellPrice,
  insertPetTemplates,
  insertItemTemplates,
};
