# AGENTS.md - RizzDigiBot Development Guide

## Project Overview

Telegram bot RPG dengan sistem pet. Pemain menetas telur, melatih pet, bertarung, dan naik level.

**Stack:** Node.js 20 + Telegraf + SQLite + PM2

---

## Project Structure

```
RizzDigiBot/
├── src/
│   ├── index.js              # Entry point, bot initialization
│   ├── config.js             # Environment config loader
│   ├── commands/
│   │   ├── start.js          # /start, /help commands
│   │   ├── pet.js            # /pets, /select, /rename commands
│   │   ├── hatch.js          # /hatch, /shop eggs
│   │   ├── battle.js         # /battle, /duel commands
│   │   ├── economy.js        # /daily, /shop, /inventory
│   │   └── admin.js          # /admin commands
│   ├── database/
│   │   ├── index.js          # SQLite connection + schema
│   │   └── migrations.js     # DB migrations
│   ├── pet/
│   │   ├── engine.js         # Pet logic (hatch, exp, level)
│   │   ├── combat.js         # Combat mechanics
│   │   └── templates.js      # Pet species data
│   └── utils/
│       ├── helpers.js        # DB helper functions
│       └── formatters.js     # Text formatting, keyboards
├── data/
│   └── rizzdigi.db           # SQLite database (git ignored)
├── .env                      # Environment variables (git ignored)
├── .env.example              # Template env
├── ROADMAP.md                # Development roadmap
├── AGENTS.md                 # This file
└── package.json
```

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

---

## Key Rules

1. **NEVER** commit `.env` file - it contains secrets
2. **ALWAYS** use prepared statements for SQL - prevent injection
3. **ALWAYS** handle errors gracefully - bot must not crash
4. **Test** every command before push - run `npm start`
5. **Commit** with clear messages - use conventional format

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

# Git
git status
git add -A
git commit -m "message"
git push
```

---

## Bot Token

- Token is in `.env` file as `BOT_TOKEN`
- Get token from @BotFather on Telegram
- **NEVER** expose token in code or commits

---

## Adding New Commands

1. Create file: `src/commands/yourcommand.js`
2. Export function: `module.exports = { yourCommand }`
3. Import in `src/index.js`: `const { yourCommand } = require('./commands/yourcommand')`
4. Register: `bot.command('yourcommand', yourCommand)`
5. Test: `npm start` then test on Telegram

---

## Database Changes

1. Edit schema in `src/database/index.js`
2. If migration needed, add to `src/database/migrations.js`
3. Test with fresh DB: delete `data/rizzdigi.db` and restart
