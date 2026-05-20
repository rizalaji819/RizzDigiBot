const ZONES = [
  {
    id: 'green_forest',
    name: '🌲 Green Forest',
    description: 'A peaceful forest with weak monsters. Perfect for beginners.',
    minLevel: 1,
    maxLevel: 10,
    entryCost: 0,
  },
  {
    id: 'desert_ruins',
    name: '🏜️ Desert Ruins',
    description: 'Ancient ruins haunted by cunning predators.',
    minLevel: 10,
    maxLevel: 20,
    entryCost: 100,
  },
  {
    id: 'volcanic_peak',
    name: '🌋 Volcanic Peak',
    description: 'A fiery mountain home to powerful dragons.',
    minLevel: 20,
    maxLevel: 30,
    entryCost: 500,
  },
  {
    id: 'deep_ocean',
    name: '🌊 Deep Ocean',
    description: 'The depths of the sea, where ancient creatures lurk.',
    minLevel: 30,
    maxLevel: 40,
    entryCost: 1000,
  },
  {
    id: 'void_realm',
    name: '🌌 Void Realm',
    description: 'A dimension beyond reality. Only the strongest survive.',
    minLevel: 40,
    maxLevel: 50,
    entryCost: 2500,
  },
];

const WILD_MONSTERS = [
  // Zone 1: Green Forest
  { zone: 'green_forest', name: 'Wild Slime', species: 'slime', element: 'earth', minLevel: 1, maxLevel: 3, hp: 50, attack: 5, defense: 2, exp: 20, coins: 10 },
  { zone: 'green_forest', name: 'Wild Cat', species: 'cat', element: 'neutral', minLevel: 2, maxLevel: 5, hp: 60, attack: 8, defense: 3, exp: 35, coins: 15 },
  { zone: 'green_forest', name: 'Wild Dog', species: 'dog', element: 'neutral', minLevel: 4, maxLevel: 7, hp: 80, attack: 7, defense: 4, exp: 50, coins: 25 },
  { zone: 'green_forest', name: 'Wild Mouse', species: 'mouse', element: 'neutral', minLevel: 6, maxLevel: 10, hp: 40, attack: 10, defense: 2, exp: 75, coins: 35 },

  // Zone 2: Desert Ruins
  { zone: 'desert_ruins', name: 'Wild Wolf', species: 'wolf', element: 'dark', minLevel: 10, maxLevel: 14, hp: 120, attack: 14, defense: 6, exp: 100, coins: 50 },
  { zone: 'desert_ruins', name: 'Wild Fox', species: 'fox', element: 'fire', minLevel: 12, maxLevel: 16, hp: 100, attack: 12, defense: 5, exp: 120, coins: 60 },
  { zone: 'desert_ruins', name: 'Wild Snake', species: 'snake', element: 'dark', minLevel: 14, maxLevel: 18, hp: 90, attack: 16, defense: 4, exp: 140, coins: 70 },
  { zone: 'desert_ruins', name: 'Wild Crab', species: 'crab', element: 'water', minLevel: 16, maxLevel: 20, hp: 150, attack: 11, defense: 12, exp: 160, coins: 80 },

  // Zone 3: Volcanic Peak
  { zone: 'volcanic_peak', name: 'Wild Dragon', species: 'dragon', element: 'fire', minLevel: 20, maxLevel: 24, hp: 200, attack: 22, defense: 10, exp: 250, coins: 125 },
  { zone: 'volcanic_peak', name: 'Wild Phoenix', species: 'phoenix', element: 'fire', minLevel: 22, maxLevel: 26, hp: 180, attack: 20, defense: 8, exp: 280, coins: 140 },
  { zone: 'volcanic_peak', name: 'Wild Demon', species: 'demon', element: 'dark', minLevel: 24, maxLevel: 28, hp: 160, attack: 25, defense: 6, exp: 310, coins: 155 },
  { zone: 'volcanic_peak', name: 'Wild Wyvern', species: 'wyvern', element: 'fire', minLevel: 26, maxLevel: 30, hp: 190, attack: 21, defense: 9, exp: 340, coins: 170 },

  // Zone 4: Deep Ocean
  { zone: 'deep_ocean', name: 'Wild Sea Serpent', species: 'sea_serpent', element: 'water', minLevel: 30, maxLevel: 34, hp: 250, attack: 20, defense: 15, exp: 500, coins: 250 },
  { zone: 'deep_ocean', name: 'Wild Hydra', species: 'hydra', element: 'water', minLevel: 34, maxLevel: 38, hp: 300, attack: 28, defense: 20, exp: 600, coins: 300 },
  { zone: 'deep_ocean', name: 'Wild Ice Wolf', species: 'ice_wolf', element: 'water', minLevel: 36, maxLevel: 40, hp: 220, attack: 25, defense: 14, exp: 700, coins: 350 },

  // Zone 5: Void Realm
  { zone: 'void_realm', name: 'Wild Ancient Dragon', species: 'ancient_dragon', element: 'fire', minLevel: 40, maxLevel: 44, hp: 350, attack: 35, defense: 25, exp: 1000, coins: 500 },
  { zone: 'void_realm', name: 'Wild Celestial Wolf', species: 'celestial_wolf', element: 'light', minLevel: 44, maxLevel: 48, hp: 300, attack: 30, defense: 20, exp: 1200, coins: 600 },
  { zone: 'void_realm', name: 'Wild Void Lord', species: 'void_lord', element: 'dark', minLevel: 48, maxLevel: 50, hp: 280, attack: 38, defense: 18, exp: 1500, coins: 750 },
];

const ZONE_EMOJI = {
  green_forest: '🌲',
  desert_ruins: '🏜️',
  volcanic_peak: '🌋',
  deep_ocean: '🌊',
  void_realm: '🌌',
};

const ELEMENT_EMOJI = {
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  light: '✨',
  dark: '🌑',
  neutral: '⚪',
};

function insertWildMonsters(db) {
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO wild_monsters (zone, name, species, element, min_level, max_level, base_hp, base_attack, base_defense, exp_reward, coin_reward) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertMany = db.transaction(() => {
    for (const monster of WILD_MONSTERS) {
      stmt.run(monster.zone, monster.name, monster.species, monster.element, monster.minLevel, monster.maxLevel, monster.hp, monster.attack, monster.defense, monster.exp, monster.coins);
    }
  });
  insertMany();
}

function getZoneById(zoneId) {
  return ZONES.find(z => z.id === zoneId);
}

function getMonstersByZone(zoneId) {
  return WILD_MONSTERS.filter(m => m.zone === zoneId);
}

function getRandomMonster(zoneId, playerLevel) {
  const monsters = WILD_MONSTERS.filter(m => m.zone === zoneId && playerLevel >= m.minLevel && playerLevel <= m.maxLevel);
  if (monsters.length === 0) return WILD_MONSTERS.find(m => m.zone === zoneId);
  return monsters[Math.floor(Math.random() * monsters.length)];
}

function scaleMonster(monster, playerLevel) {
  const level = Math.max(monster.minLevel, Math.min(monster.maxLevel, playerLevel));
  const levelMultiplier = 1 + (level - monster.minLevel) * 0.1;
  return {
    ...monster,
    level,
    hp: Math.floor(monster.hp * levelMultiplier),
    maxHp: Math.floor(monster.hp * levelMultiplier),
    attack: Math.floor(monster.attack * levelMultiplier),
    defense: Math.floor(monster.defense * levelMultiplier),
    exp: Math.floor(monster.exp * levelMultiplier),
    coins: Math.floor(monster.coins * levelMultiplier),
  };
}

module.exports = {
  ZONES,
  WILD_MONSTERS,
  ZONE_EMOJI,
  ELEMENT_EMOJI,
  insertWildMonsters,
  getZoneById,
  getMonstersByZone,
  getRandomMonster,
  scaleMonster,
};
