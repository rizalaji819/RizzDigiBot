# 🎮 RizzDigiBot

Telegram bot RPG berbasis pet system. Hatch, train, battle, and level up your pets!

**👉 [Open RizzDigiBot](https://t.me/RizzDigiBot)**

---

## Features

### 🐾 Pet System
- **44 Pet Species** - Mix of monsters and animals
- **4 Rarity Tiers** - Common, Rare, Epic, Legendary
- **Pet Skills** - 15 unique skills with 5 elements
- **Pet Growth** - 5 growth rates (D/C/B/A/S)
- **Prestige System** - Reset at Lv.50 for +20% stats

### ⚔️ Battle System
- **5 Zones** - Green Forest → Void Realm
- **17 Wild Monsters** - Zone-based scaling
- **Turn-based Combat** - Manual skill selection
- **Element Advantage** - Fire > Earth > Water > Fire, Light ↔ Dark
- **Battle Rewards** - EXP, coins, items, egg drops

### 🛒 Shop System
- **Egg Shop** - Buy eggs with coins
- **Item Shop** - Buy food items for pet EXP
- **Skill Shop** - Buy skill scrolls

### 💰 Economy System
- **Daily Rewards** - 7-day cycle with streak bonuses
- **Trading** - Trade pets and items with other players
- **Leaderboard** - Compete for top rank
- **Leveling** - Gain EXP from battles

---

## Commands

### 🐾 Pet System
| Command | Description |
|---------|-------------|
| `/hatch` | Hatch a new pet (free every 3h) |
| `/eggs` | View egg inventory |
| `/pets` | View all pets |
| `/pet <id>` | View pet details |
| `/feed <id>` | Feed pet with food |
| `/train <id>` | Train pet with coins |
| `/release <id>` | Release pet |
| `/prestige <id>` | Prestige pet (Lv.50) |

### ⚔️ Battle System
| Command | Description |
|---------|-------------|
| `/battle` | Start battle |
| `/zones` | View zones |

### 📜 Skill System
| Command | Description |
|---------|-------------|
| `/skills <id>` | View pet skills |
| `/skilllearn <id> <skill_id>` | Learn skill |
| `/skillset <id> <slot> <skill_id>` | Set skill |
| `/skillshop` | Buy skill scrolls |

### 🛒 Shop System
| Command | Description |
|---------|-------------|
| `/shop` | Buy eggs |
| `/items` | Buy food items |
| `/inventory` | View items |

### 💰 Economy System
| Command | Description |
|---------|-------------|
| `/daily` | Claim daily reward |
| `/profile` | View profile |
| `/leaderboard` | Top 10 players |
| `/trade @username` | Trade with player |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 20 LTS |
| Bot Framework | Telegraf |
| Database | SQLite (better-sqlite3) |
| Process Manager | PM2 |
| Hosting | VPS (Ubuntu) |

---

## Quick Start

1. Open [t.me/RizzDigiBot](https://t.me/RizzDigiBot)
2. Send `/start`
3. Send `/hatch` to get your first pet
4. Send `/battle` to fight monsters
5. Send `/help` to see all commands

---

## Game Guide

### Getting Started
1. **Hatch your first pet** - Use `/hatch` (free every 3 hours)
2. **Feed your pet** - Buy food at `/items`, then `/feed <id>`
3. **Battle monsters** - Use `/battle` to gain EXP and coins
4. **Level up** - Both pet and player gain EXP from battles

### Tips
- **Rarer pets** have better growth rates (Legendary = S rank)
- **Element advantage** deals 1.3x damage
- **Skills** can be bought at `/skillshop`
- **Daily rewards** give coins and items (Lv.5+)
- **Trading** unlocks at Lv.10+

---

## License

ISC

---

Made with ❤️ by [@rizalaji819](https://github.com/rizalaji819)
