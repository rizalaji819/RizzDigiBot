const db = require('../database');

function hatchPet(userId, name, species, rarity = 'common') {
  const template = db.prepare(
    'SELECT * FROM pet_templates WHERE species = ? AND rarity = ? LIMIT 1'
  ).get(species, rarity);

  const baseHp = template ? template.base_hp : 100;
  const baseAtk = template ? template.base_attack : 10;
  const baseDef = template ? template.base_defense : 5;

  const stmt = db.prepare(
    'INSERT INTO pets (owner_id, name, species, rarity, hp, attack, defense) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(userId, name, species, rarity, baseHp, baseAtk, baseDef);
  return db.prepare('SELECT * FROM pets WHERE id = ?').get(result.lastInsertRowid);
}

function addExp(petId, amount) {
  const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(petId);
  if (!pet) return null;

  let newExp = pet.exp + amount;
  let newLevel = pet.level;

  while (newExp >= newLevel * 100) {
    newExp -= newLevel * 100;
    newLevel++;
  }

  db.prepare('UPDATE pets SET exp = ?, level = ? WHERE id = ?').run(newExp, newLevel, petId);
  return db.prepare('SELECT * FROM pets WHERE id = ?').get(petId);
}

module.exports = { hatchPet, addExp };
