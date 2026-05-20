const db = require('./database');

function getOrCreateUser(telegramId, username) {
  let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);
  if (!user) {
    const stmt = db.prepare('INSERT INTO users (telegram_id, username) VALUES (?, ?)');
    const result = stmt.run(telegramId, username || null);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }
  return user;
}

function getUserPets(userId) {
  return db.prepare('SELECT * FROM pets WHERE owner_id = ?').all(userId);
}

function getActivePet(userId) {
  return db.prepare('SELECT * FROM pets WHERE owner_id = ? AND is_active = 1').get(userId);
}

module.exports = { getOrCreateUser, getUserPets, getActivePet };
