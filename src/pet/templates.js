const PET_TEMPLATES = {
  common: [
    { name: 'Slime', species: 'slime', type: 'monster', hp: 80, attack: 5, defense: 3, description: 'A bouncy blob of goo. Simple but loyal.' },
    { name: 'Whiskers', species: 'cat', type: 'animal', hp: 70, attack: 8, defense: 4, description: 'A curious cat with sharp claws.' },
    { name: 'Bark', species: 'dog', type: 'animal', hp: 90, attack: 7, defense: 5, description: 'A faithful companion with strong jaws.' },
    { name: 'Squeaks', species: 'mouse', type: 'animal', hp: 50, attack: 6, defense: 2, description: 'Small but surprisingly fast.' },
    { name: 'Chirpy', species: 'bird', type: 'animal', hp: 55, attack: 9, defense: 2, description: 'A swift flyer with sharp beak.' },
    { name: 'Shelly', species: 'turtle', type: 'animal', hp: 120, attack: 4, defense: 8, description: 'Slow but has a rock-hard shell.' },
    { name: 'Ribbit', species: 'frog', type: 'animal', hp: 60, attack: 7, defense: 3, description: 'Can leap high and poison enemies.' },
    { name: 'Rocky', species: 'golem', type: 'monster', hp: 150, attack: 6, defense: 10, description: 'Made of stone. Extremely durable.' },
    { name: 'Buzzy', species: 'bee', type: 'animal', hp: 45, attack: 10, defense: 1, description: 'Small but packs a painful sting.' },
    { name: 'Chomp', species: 'piranha', type: 'animal', hp: 40, attack: 11, defense: 2, description: 'Frenzied biter from the rivers.' },
    { name: 'Fuzzbear', species: 'bear_cub', type: 'animal', hp: 100, attack: 8, defense: 6, description: 'Adorable now, terrifying later.' },
    { name: 'Hoot', species: 'owl', type: 'animal', hp: 60, attack: 9, defense: 3, description: 'Silent hunter of the night.' },
    { name: 'Nippy', species: 'ferret', type: 'animal', hp: 55, attack: 8, defense: 3, description: 'Quick and mischievous.' },
    { name: 'Pincers', species: 'beetle', type: 'animal', hp: 90, attack: 6, defense: 7, description: 'Hard shell, stronger pinch.' },
    { name: 'Snappy', species: 'lizard', type: 'animal', hp: 65, attack: 7, defense: 4, description: 'Quick reflexes, warm blood.' },
    { name: 'Squish', species: 'octopus', type: 'animal', hp: 70, attack: 8, defense: 5, description: 'Eight arms of trouble.' },
    { name: 'Waddle', species: 'penguin', type: 'animal', hp: 75, attack: 6, defense: 6, description: 'Looks silly, fights hard.' },
    { name: 'Yappy', species: 'hamster', type: 'animal', hp: 40, attack: 7, defense: 2, description: 'Tiny but fierce energy.' },
    { name: 'Fins', species: 'goldfish', type: 'animal', hp: 35, attack: 5, defense: 1, description: 'Surprisingly determined.' },
    { name: 'Crawly', species: 'ant', type: 'animal', hp: 30, attack: 6, defense: 2, description: 'Weak alone, strong in spirit.' },
  ],
  rare: [
    { name: 'Fang', species: 'wolf', type: 'monster', hp: 110, attack: 14, defense: 7, description: 'Pack hunter with devastating bite.' },
    { name: 'Ember', species: 'fox', type: 'monster', hp: 90, attack: 12, defense: 6, description: 'Cunning and fast with fire tricks.' },
    { name: 'Hop', species: 'bunny', type: 'animal', hp: 80, attack: 10, defense: 5, description: "Don't let the cuteness fool you." },
    { name: 'Snap', species: 'crocodile', type: 'monster', hp: 140, attack: 15, defense: 9, description: 'Ancient predator with iron jaws.' },
    { name: 'Hiss', species: 'snake', type: 'monster', hp: 75, attack: 13, defense: 4, description: 'Stealthy striker with venomous fangs.' },
    { name: 'Claw', species: 'crab', type: 'monster', hp: 100, attack: 11, defense: 12, description: 'Hard shell and crushing claws.' },
    { name: 'Quill', species: 'porcupine', type: 'animal', hp: 95, attack: 10, defense: 11, description: 'Spines make it hard to attack.' },
    { name: 'Hornet', species: 'giant_wasp', type: 'monster', hp: 70, attack: 16, defense: 3, description: 'Aggressive flyer with toxic sting.' },
    { name: 'Tusker', species: 'boar', type: 'animal', hp: 130, attack: 13, defense: 8, description: 'Charging force of nature.' },
    { name: 'Raptor', species: 'hawk', type: 'animal', hp: 85, attack: 15, defense: 4, description: 'Skydiver with razor talons.' },
    { name: 'Snarl', species: 'hyena', type: 'monster', hp: 105, attack: 14, defense: 6, description: 'Laughing predator, never gives up.' },
    { name: 'Shellback', species: 'armadillo', type: 'animal', hp: 120, attack: 9, defense: 14, description: 'Roll up and bash through anything.' },
  ],
  epic: [
    { name: 'Blaze', species: 'dragon', type: 'monster', hp: 160, attack: 22, defense: 12, description: 'Breathes fire, king of the skies.' },
    { name: 'Solar', species: 'phoenix', type: 'monster', hp: 130, attack: 20, defense: 8, description: 'Reborn from its own ashes.' },
    { name: 'Sparkle', species: 'unicorn', type: 'monster', hp: 140, attack: 18, defense: 14, description: 'Magical horn purifies all wounds.' },
    { name: 'Shadow', species: 'demon', type: 'monster', hp: 120, attack: 25, defense: 6, description: 'Feeds on fear and darkness.' },
    { name: 'Frost', species: 'ice_wolf', type: 'monster', hp: 150, attack: 19, defense: 11, description: 'Breathes freezing wind.' },
    { name: 'Thorn', species: 'treant', type: 'monster', hp: 180, attack: 16, defense: 16, description: 'Ancient tree guardian.' },
    { name: 'Viper', species: 'wyvern', type: 'monster', hp: 135, attack: 21, defense: 9, description: 'Flying reptile with toxic tail.' },
    { name: 'Tide', species: 'sea_serpent', type: 'monster', hp: 145, attack: 17, defense: 13, description: 'Rules the deep oceans.' },
  ],
  legendary: [
    { name: 'Inferno', species: 'ancient_dragon', type: 'monster', hp: 220, attack: 35, defense: 20, description: 'The oldest and most powerful dragon.' },
    { name: 'Luna', species: 'celestial_wolf', type: 'monster', hp: 200, attack: 30, defense: 18, description: 'Guardian of the moonlit night.' },
    { name: 'Hydra', species: 'hydra', type: 'monster', hp: 250, attack: 28, defense: 25, description: 'Cut one head, two more appear.' },
    { name: 'Zero', species: 'void_lord', type: 'monster', hp: 180, attack: 38, defense: 15, description: 'Master of dimensions and time.' },
  ],
};

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

module.exports = {
  PET_TEMPLATES,
  RARITY_WEIGHTS,
  EGG_PRICES,
  RARITY_EMOJI,
  rollRarity,
  getRandomPetByRarity,
  insertPetTemplates,
};
