const SKILL_TEMPLATES = [
  // Attack Skills
  { id: 1, name: 'Fireball', type: 'attack', element: 'fire', power: 120, effect: null, description: 'Hurl a fiery projectile at the enemy.', price: 1000 },
  { id: 2, name: 'Hydro Pump', type: 'attack', element: 'water', power: 120, effect: null, description: 'Blast the enemy with high-pressure water.', price: 1000 },
  { id: 3, name: 'Earthquake', type: 'attack', element: 'earth', power: 120, effect: null, description: 'Shake the ground beneath the enemy.', price: 1000 },
  { id: 4, name: 'Holy Smite', type: 'attack', element: 'light', power: 130, effect: null, description: 'Call down divine light upon the enemy.', price: 1500 },
  { id: 5, name: 'Shadow Strike', type: 'attack', element: 'dark', power: 130, effect: null, description: 'Attack from the shadows with dark energy.', price: 1500 },

  // Defense Skills
  { id: 6, name: 'Iron Shield', type: 'defense', element: 'earth', power: 0, effect: 'block_50', description: 'Raise an impenetrable shield. Block 50% damage.', price: 1200 },
  { id: 7, name: 'Water Veil', type: 'defense', element: 'water', power: 0, effect: 'block_30_heal_10', description: 'Surround yourself with water. Block 30% + heal 10% HP.', price: 1500 },

  // Support Skills
  { id: 8, name: 'Healing Light', type: 'support', element: 'light', power: 0, effect: 'heal_25', description: 'Channel holy energy to heal 25% HP.', price: 1200 },
  { id: 9, name: 'War Cry', type: 'support', element: 'fire', power: 0, effect: 'atk_boost_20_3', description: 'Boost your attack by 20% for 3 turns.', price: 1000 },

  // Evasion Skills
  { id: 10, name: 'Shadow Step', type: 'evasion', element: 'dark', power: 0, effect: 'dodge_40', description: 'Step into shadows. 40% chance to dodge attack.', price: 1500 },

  // DoT Skills
  { id: 11, name: 'Poison Fang', type: 'dot', element: 'dark', power: 0, effect: 'poison_10_3', description: 'Bite with venom. 10% HP/turn for 3 turns.', price: 1200 },
  { id: 12, name: 'Burning Touch', type: 'dot', element: 'fire', power: 0, effect: 'burn_8_3', description: 'Set the enemy ablaze. 8% HP/turn for 3 turns.', price: 1000 },

  // Stun Skills
  { id: 13, name: 'Stun Bash', type: 'stun', element: 'earth', power: 80, effect: 'stun_30', description: 'BASH! 30% chance to stun for 1 turn.', price: 1500 },

  // Special Skills
  { id: 14, name: 'Divine Judgment', type: 'special', element: 'light', power: 0, effect: 'instant_kill_15', description: 'Call upon divine judgment. 15% instant kill.', price: 3000 },
  { id: 15, name: 'Coin Toss', type: 'special', element: 'dark', power: 0, effect: 'coin_toss', description: '50% chance: 2.5x damage. 50% chance: 0 damage.', price: 2500 },
];

const ELEMENT_EMOJI = {
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  light: '✨',
  dark: '🌑',
};

const ELEMENT_ADVANTAGE = {
  fire: 'earth',
  water: 'fire',
  earth: 'water',
  light: 'dark',
  dark: 'light',
};

const SKILL_TYPE_EMOJI = {
  attack: '⚔️',
  defense: '🛡️',
  support: '💚',
  evasion: '💨',
  dot: '☠️',
  stun: '⚡',
  special: '🌟',
};

const RARITY_SLOTS = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

function insertSkillTemplates(db) {
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO skills (id, name, type, element, power, effect, description, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertMany = db.transaction(() => {
    for (const skill of SKILL_TEMPLATES) {
      stmt.run(skill.id, skill.name, skill.type, skill.element, skill.power, skill.effect, skill.description, skill.price);
    }
  });
  insertMany();
}

function getSkillById(id) {
  return SKILL_TEMPLATES.find(s => s.id === id);
}

function getSkillsByType(type) {
  return SKILL_TEMPLATES.filter(s => s.type === type);
}

function getSkillsByElement(element) {
  return SKILL_TEMPLATES.filter(s => s.element === element);
}

function getRandomSkill() {
  return SKILL_TEMPLATES[Math.floor(Math.random() * SKILL_TEMPLATES.length)];
}

function calculateElementMultiplier(attackerElement, defenderElement) {
  if (ELEMENT_ADVANTAGE[attackerElement] === defenderElement) return 1.3;
  if (ELEMENT_ADVANTAGE[defenderElement] === attackerElement) return 0.7;
  return 1.0;
}

module.exports = {
  SKILL_TEMPLATES,
  ELEMENT_EMOJI,
  ELEMENT_ADVANTAGE,
  SKILL_TYPE_EMOJI,
  RARITY_SLOTS,
  insertSkillTemplates,
  getSkillById,
  getSkillsByType,
  getSkillsByElement,
  getRandomSkill,
  calculateElementMultiplier,
};
