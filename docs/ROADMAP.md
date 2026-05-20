# RizzDigiBot - Development Roadmap

## Overview

Telegram bot RPG berbasis pet system. Pemain bisa menetas telur, melatih pet, bertarung, dan naik level.

---

## Phase 1: Core System ✅

- [x] Project setup (Node.js + Telegraf + SQLite)
- [x] Database schema (users, pets, pet_templates)
- [x] Basic bot skeleton
- [x] `/start` command
- [x] PM2 deployment
- [x] SSH & GitHub setup

---

## Phase 2: Pet System ✅

### 2.1 Hatch System ✅
- [x] Shop / gacha telur (Common, Rare, Epic, Legendary)
- [x] Egg inventory system
- [x] Random rarity chance (50/30/15/5)
- [x] Naming pet setelah hatch
- [x] Free hatch (cooldown 3 jam)
- [x] 44 pet species (20 Common, 12 Rare, 8 Epic, 4 Legendary)

### 2.2 Pet Management ✅
- [x] `/pets` - List semua pets
- [x] `/pet <id>` - Pet detail view (stats, rarity, level)
- [x] Pet rename (`/rename`)
- [x] Release pet (sell/fuse)
- [x] Growth rate system (D/C/B/A/S)
- [x] Power score calculation
- [x] Prestige system (Lv.50 → reset +20% stats)
- [x] Pet slot expansion (5 base, max 20)

### 2.3 Pet Skills ✅
- [x] 15 skills (Attack/Defense/Support/Evasion/DoT/Stun/Special)
- [x] 5 element system (Fire/Water/Earth/Light/Dark)
- [x] Skill slots by rarity (1/2/3/4)
- [x] Skill shop (`/skillshop`)
- [x] Skill management (`/skills`, `/skilllearn`, `/skillset`)
- [x] Random skill on hatch

---

## Phase 3: Combat System ✅

### 3.1 PvE - Wild Battle ✅
- [x] `/battle` - Fight wild monster
- [x] Turn-based combat (manual skill selection)
- [x] 5 zones (Green Forest, Desert Ruins, Volcanic Peak, Deep Ocean, Void Realm)
- [x] 17 wild monsters with zone-based scaling
- [x] Element advantage system (1.3x/0.7x)
- [x] Critical hits (10% chance, 1.5x damage)
- [x] Skill effects (block, heal, buff, dodge, DoT, stun, instant kill, coin toss)
- [x] Battle rewards (EXP, coins, item drops, egg drops)

### 3.2 PvP - Player Battle
- [ ] `/duel [@username]` - Challenge player
- [ ] Matchmaking system
- [ ] Leaderboard / ranking

### 3.3 Combat Mechanics
- [x] Damage formula with element bonus
- [x] Critical hit chance
- [x] Status effects (poison, burn, stun)
- [ ] More advanced combat mechanics

---

## Phase 4: Leveling & Economy ✅

### 4.1 Player Leveling ✅
- [x] EXP from battles
- [x] Level-up rewards (coins + items)
- [x] Level-gated content (daily Lv.5, trading Lv.10)
- [x] `/profile` - View player stats
- [x] `/leaderboard` - Top 10 players

### 4.2 Economy ✅
- [x] `/daily` - Daily coins + items (7-day cycle)
- [x] `/shop` - Buy eggs, items, skill scrolls
- [x] `/inventory` - View items
- [x] Trading system (request/accept/cancel)
- [x] Sell items for coins

---

## Phase 5: Advanced Features

### 5.1 Guild System
- [ ] `/guild create` - Create guild
- [ ] `/guild join` - Join guild
- [ ] Guild wars
- [ ] Guild shop

### 5.2 Events
- [ ] Limited time raids
- [ ] Seasonal events
- [ ] Special egg drops

### 5.3 Admin Panel
- [ ] `/admin broadcast` - Send message to all users
- [ ] `/admin stats` - Bot statistics
- [ ] `/admin give [user] [item]` - Give items

### 5.4 Pet Evolution
- [ ] Evolution system (Lv.30 → evolve)
- [ ] New forms & stats
- [ ] Evolution items

### 5.5 Pet Expedition
- [ ] Send pets on expeditions
- [ ] Timed rewards
- [ ] Special expedition items

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

## Database Schema

```
users
├── id (PK)
├── telegram_id (UNIQUE)
├── username
├── coins
├── level
├── exp
├── total_exp
├── daily_streak
├── last_daily
├── last_free_hatch
├── max_pet_slots
└── created_at

pets
├── id (PK)
├── owner_id (FK → users)
├── name
├── species
├── rarity (common/rare/epic/legendary)
├── level
├── exp
├── hp
├── attack
├── defense
├── growth_rate (D/C/B/A/S)
├── prestige
├── prestige_bonus
├── is_active
└── created_at

egg_inventory
├── id (PK)
├── owner_id (FK → users)
├── rarity
├── quantity
└── created_at

pet_items
├── id (PK)
├── owner_id (FK → users)
├── item_name
├── quantity
└── created_at

skills
├── id (PK)
├── name
├── type (attack/defense/support/evasion/dot/stun/special)
├── element (fire/water/earth/light/dark)
├── power
├── effect
├── description
└── price

pet_skills
├── id (PK)
├── pet_id (FK → pets)
├── skill_id (FK → skills)
├── slot
└── created_at

wild_monsters
├── id (PK)
├── zone
├── name
├── species
├── element
├── min_level
├── max_level
├── base_hp
├── base_attack
├── base_defense
├── exp_reward
└── coin_reward

trades
├── id (PK)
├── sender_id (FK → users)
├── receiver_id (FK → users)
├── status (pending/accepted/cancelled)
├── sender_pet_id
├── sender_items
├── sender_coins
├── receiver_pet_id
├── receiver_items
├── receiver_coins
└── created_at
```

---

## Commands Reference

| Command | Description | Level |
|---------|-------------|-------|
| `/start` | Welcome message | Any |
| `/help` | Help guide (categorized) | Any |
| `/profile` | View player stats | Any |
| `/hatch` | Hatch a new pet | Any |
| `/eggs` | View egg inventory | Any |
| `/pets` | View all pets | Any |
| `/pet <id>` | View pet details | Any |
| `/rename <id> <name>` | Rename pet | Any |
| `/feed <id>` | Feed pet | Any |
| `/train <id>` | Train pet | Any |
| `/release <id>` | Release pet | Any |
| `/prestige <id>` | Prestige pet | Lv.50 |
| `/battle` | Start battle | Any |
| `/zones` | View zones | Any |
| `/skills <id>` | View pet skills | Any |
| `/skilllearn <pet_id> <skill_id>` | Learn skill | Any |
| `/skillset <pet_id> <slot> <skill_id>` | Set skill | Any |
| `/shop` | Buy eggs | Any |
| `/items` | Buy food items | Any |
| `/skillshop` | Buy skill scrolls | Any |
| `/inventory` | View items | Any |
| `/daily` | Claim daily reward | Lv.5 |
| `/leaderboard` | Top 10 players | Any |
| `/trade @username` | Start trade | Lv.10 |

---

## Priority Queue

| Priority | Feature | Status |
|----------|---------|--------|
| P0 | Hatch system | ✅ Done |
| P0 | Pet management | ✅ Done |
| P0 | Pet skills | ✅ Done |
| P1 | PvE battle | ✅ Done |
| P1 | Leveling system | ✅ Done |
| P1 | Economy system | ✅ Done |
| P2 | PvP battle | Planned |
| P2 | Pet evolution | Planned |
| P2 | Pet expedition | Planned |
| P3 | Guild system | Planned |
| P3 | Events | Planned |
| P3 | Admin panel | Planned |
