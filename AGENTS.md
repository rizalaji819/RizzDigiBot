# AGENTS.md - RizzDigiBot Development Guide

## Project Overview

Telegram bot RPG dengan sistem pet. Pemain menetas telur, melatih pet, bertarung, dan naik level.

**Stack:** Node.js 20 + Telegraf + SQLite + PM2
**GitHub:** https://github.com/rizalaji819/RizzDigiBot

---

## Project Structure

```
RizzDigiBot/
├── src/
│   ├── index.js              # Entry point, bot initialization
│   ├── config.js             # Environment config loader
│   ├── commands/
│   │   ├── start.js          # /start, /help commands
│   │   ├── shop.js           # /shop (egg shop)
│   │   ├── hatch.js          # /hatch, /eggs, /pets, /rename
│   │   ├── pet.js            # /pet, /feed, /train, /release, /prestige
│   │   ├── items.js          # /items (food shop), /inventory
│   │   ├── skills.js         # /skillshop, /skills, /skilllearn, /skillset
│   │   └── economy.js        # /daily, /profile, /leaderboard, /trade
│   ├── database/
│   │   └── index.js          # SQLite connection + schema
│   ├── pet/
│   │   ├── engine.js         # Pet logic (hatch, exp, level)
│   │   ├── templates.js      # 44 pet species data
│   │   └── skills.js         # 15 skill templates
│   ├── battle/
│   │   ├── engine.js         # Battle command + turn logic
│   │   ├── combat.js         # Damage calc, effects, rewards
│   │   └── monsters.js       # Zone + monster data
│   └── utils/
│       └── helpers.js        # DB helper functions
├── data/
│   └── rizzdigi.db           # SQLite database (git ignored)
├── docs/
│   ├── ROADMAP.md            # Full development roadmap
│   └── PHASE-2.1.md          # Hatch system details
├── .env                      # Environment variables (git ignored)
├── .env.example              # Template env
├── AGENTS.md                 # This file
└── package.json
```

---

## All Commands

### 🐾 Pet System
| Command | Description |
|---------|-------------|
| `/hatch` | Hatch a new pet (free every 3h or use eggs) |
| `/eggs` | View your egg inventory |
| `/pets` | View all your pets |
| `/pet <id>` | View detailed pet stats |
| `/rename <id> <name>` | Rename your pet |
| `/feed <id>` | Feed pet with food items |
| `/train <id>` | Train pet with coins |
| `/release <id>` | Release pet (sell or fuse) |
| `/prestige <id>` | Prestige pet (Lv.50 → reset +20% stats) |

### ⚔️ Battle System
| Command | Description |
|---------|-------------|
| `/battle` | Start battle (select zone) |
| `/zones` | View available zones |

### 📜 Skill System
| Command | Description |
|---------|-------------|
| `/skills <pet_id>` | View pet skills |
| `/skilllearn <pet_id> <skill_id>` | Learn skill from scroll |
| `/skillset <pet_id> <slot> <skill_id>` | Set skill to slot |

### 🛒 Shop System
| Command | Description |
|---------|-------------|
| `/shop` | Buy eggs |
| `/items` | Buy food items |
| `/skillshop` | Buy skill scrolls |
| `/inventory` | View your items |

### 💰 Economy System
| Command | Description |
|---------|-------------|
| `/daily` | Claim daily reward (Lv.5+) |
| `/profile` | View your profile |
| `/leaderboard` | Top 10 players |
| `/trade @username` | Trade with player (Lv.10+) |

---

## Coding Conventions

### JavaScript Style
- CommonJS modules (`require` / `module.exports`)
- 2-space indentation
- Semicolons required
- Single quotes for strings
- camelCase for variables/functions
- UPPER_SNAKE_CASE for constants

### Command Pattern
Every command file exports a function:
```js
function commandName(ctx) {
  // ctx is Telegraf context
  // Use ctx.reply() for responses
}
module.exports = { commandName };
```

### Database Queries
Use `better-sqlite3` prepared statements:
```js
const db = require('../database');

// SELECT
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

// INSERT
const result = db.prepare('INSERT INTO users (name) VALUES (?)').run(name);

// UPDATE
db.prepare('UPDATE users SET coins = ? WHERE id = ?').run(amount, userId);
```

### Inline Keyboard Pattern
```js
const { Markup } = require('telegraf');

ctx.reply('Choose action:', Markup.inlineKeyboard([
  [Markup.button.callback('Option A', 'action_a')],
  [Markup.button.callback('Option B', 'action_b')],
]));
```

### Action Handler Pattern
```js
bot.action(/^action_(.+)$/, (ctx) => {
  handleAction(ctx, ctx.match[1]);
});
```

---

## Key Rules

1. **NEVER** commit `.env` file - it contains secrets
2. **ALWAYS** use prepared statements for SQL - prevent injection
3. **ALWAYS** handle errors gracefully - bot must not crash
4. **Test** every command before push - run `npm start`
5. **Commit** with clear messages - use conventional format
6. **Database files** (*.db, *.db-shm, *.db-wal) - git ignored

---

## Common Commands

```bash
# Development
npm start              # Start bot
npm run dev            # Start with auto-reload (--watch)

# PM2 Production
pm2 status             # Check bot status
pm2 logs RizzDigiBot   # View bot logs
pm2 restart RizzDigiBot # Restart bot
pm2 stop RizzDigiBot   # Stop bot
pm2 flush RizzDigiBot  # Clear logs

# Git
git status
git add -A
git commit -m "message"
git push
```

---

## Bot Token & Admin

- Token is in `.env` file as `BOT_TOKEN`
- Admin ID is in `.env` file as `ADMIN_IDS`
- Get token from @BotFather on Telegram
- **NEVER** expose token in code or commits

---

## Adding New Commands

1. Create file: `src/commands/yourcommand.js`
2. Export function: `module.exports = { yourCommand }`
3. Import in `src/index.js`: `const { yourCommand } = require('./commands/yourcommand')`
4. Register: `bot.command('yourcommand', yourCommand)`
5. Add action handlers if needed: `bot.action(/^action_(.+)$/, handler)`
6. Test: `npm start` then test on Telegram
7. Restart PM2: `pm2 restart RizzDigiBot`

---

## Database Changes

1. Edit schema in `src/database/index.js`
2. Add new tables with `CREATE TABLE IF NOT EXISTS`
3. Test with fresh DB: delete `data/rizzdigi.db` and restart
4. Push to GitHub

---

## Pet System Reference

### Growth Rates
| Rate | HP/Level | ATK/Level | DEF/Level |
|------|----------|-----------|-----------|
| D | +2 | +1 | +0.5 |
| C | +4 | +2 | +1 |
| B | +6 | +3 | +1.5 |
| A | +8 | +4 | +2 |
| S | +10 | +5 | +2.5 |

### Element Advantage
| Element | Strong Against | Weak Against |
|---------|---------------|--------------|
| 🔥 Fire | 🌍 Earth | 💧 Water |
| 💧 Water | 🔥 Fire | 🌍 Earth |
| 🌍 Earth | 💧 Water | 🔥 Fire |
| ✨ Light | 🌑 Dark | 🌑 Dark |
| 🌑 Dark | ✨ Light | ✨ Light |

### Zones
| Zone | Level | Cost | Monsters |
|------|-------|------|----------|
| 🌲 Green Forest | 1-10 | Free | Slime, Cat, Dog, Mouse |
| 🏜️ Desert Ruins | 10-20 | 100c | Wolf, Fox, Snake, Crab |
| 🌋 Volcanic Peak | 20-30 | 500c | Dragon, Phoenix, Demon, Wyvern |
| 🌊 Deep Ocean | 30-40 | 1000c | Sea Serpent, Hydra, Ice Wolf |
| 🌌 Void Realm | 40-50 | 2500c | Ancient Dragon, Celestial Wolf, Void Lord |
