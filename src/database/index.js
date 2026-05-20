const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const dbDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(config.DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    telegram_id INTEGER UNIQUE NOT NULL,
    username TEXT,
    coins INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    total_exp INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    last_daily DATETIME,
    last_free_hatch DATETIME,
    max_pet_slots INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    rarity TEXT DEFAULT 'common',
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    hp INTEGER DEFAULT 100,
    attack INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 5,
    growth_rate TEXT DEFAULT 'C',
    prestige INTEGER DEFAULT 0,
    prestige_bonus REAL DEFAULT 1.0,
    is_active INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS egg_inventory (
    id INTEGER PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    rarity TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS pet_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    rarity TEXT NOT NULL,
    base_hp INTEGER DEFAULT 100,
    base_attack INTEGER DEFAULT 10,
    base_defense INTEGER DEFAULT 5,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS item_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    exp_value INTEGER DEFAULT 0,
    price INTEGER DEFAULT 0,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS pet_items (
    id INTEGER PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    element TEXT NOT NULL,
    power INTEGER DEFAULT 0,
    effect TEXT,
    description TEXT,
    price INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS pet_skills (
    id INTEGER PRIMARY KEY,
    pet_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    slot INTEGER NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pets(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
  );

  CREATE TABLE IF NOT EXISTS wild_monsters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zone TEXT NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    element TEXT DEFAULT 'neutral',
    min_level INTEGER,
    max_level INTEGER,
    base_hp INTEGER,
    base_attack INTEGER,
    base_defense INTEGER,
    exp_reward INTEGER,
    coin_reward INTEGER
  );

  CREATE TABLE IF NOT EXISTS battle_cooldowns (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    zone TEXT NOT NULL,
    last_battle DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    sender_pet_id INTEGER,
    sender_items TEXT,
    sender_coins INTEGER DEFAULT 0,
    receiver_pet_id INTEGER,
    receiver_items TEXT,
    receiver_coins INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );
`);

const { insertPetTemplates, insertItemTemplates } = require('../pet/templates');
const { insertSkillTemplates } = require('../pet/skills');
const { insertWildMonsters } = require('../battle/monsters');
insertPetTemplates(db);
insertItemTemplates(db);
insertSkillTemplates(db);
insertWildMonsters(db);

module.exports = db;
