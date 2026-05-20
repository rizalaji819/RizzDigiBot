# RizzDigiBot - Development Roadmap

## Overview

Telegram bot RPG berbasis pet system. Pemain bisa menetas telur, melatih pet, bertarung, dan naik level.

---

## Phase 1: Core System ✅ (Current)

- [x] Project setup (Node.js + Telegraf + SQLite)
- [x] Database schema (users, pets, pet_templates)
- [x] Basic bot skeleton
- [x] `/start` command
- [x] PM2 deployment

---

## Phase 2: Pet System

### 2.1 Hatch System
- [ ] Shop / gacha telur (Common, Rare, Epic, Legendary)
- [ ] Inventory telur
- [ ] Hatch animation (reply keyboard)
- [ ] Random rarity chance
- [ ] Naming pet setelah hatch

### 2.2 Pet Management
- [ ] `/pets` - List semua pets
- [ ] `/select [pet_id]` - Pilih active pet
- [ ] Pet detail view (stats, rarity, level)
- [ ] Pet rename
- [ ] Release pet

### 2.3 Pet Stats
- HP (Health Points)
- ATK (Attack)
- DEF (Defense)
- SPD (Speed)
- Rarity multiplier

---

## Phase 3: Combat System

### 3.1 PvE - Wild Battle
- [ ] `/battle` - Fight wild monster
- [ ] Turn-based combat (simple)
- [ ] Monster scaling by player level
- [ ] EXP & coin reward
- [ ] Item drop (rare chance)

### 3.2 PvP - Player Battle
- [ ] `/duel [@username]` - Challenge player
- [ ] Matchmaking system
- [ ] Leaderboard / ranking

### 3.3 Combat Mechanics
- [ ] Damage formula: `ATK * (1 + level/10) - DEF * 0.5`
- [ ] Critical hit chance (SPD based)
- [ ] Pet ability/skill system
- [ ] Status effects (poison, burn, stun)

---

## Phase 4: Leveling & Economy

### 4.1 Player Leveling
- [ ] EXP from battles
- [ ] Level-up rewards (coins, stat points)
- [ ] Prestige system (late game)

### 4.2 Economy
- [ ] `/daily` - Daily coins
- [ ] `/shop` - Buy eggs, items, boosts
- [ ] `/inventory` - View items
- [ ] Trading system (player to player)

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
├── is_active
└── created_at

pet_templates
├── id (PK)
├── name
├── species
├── rarity
├── base_hp
├── base_attack
├── base_defense
└── description
```

---

## Priority Queue

| Priority | Feature | Est. Time |
|----------|---------|-----------|
| P0 | Hatch system | 2-3 hours |
| P0 | Pet management | 1-2 hours |
| P1 | PvE battle | 3-4 hours |
| P1 | Leveling system | 1-2 hours |
| P2 | Economy (daily/shop) | 2-3 hours |
| P2 | PvP battle | 3-4 hours |
| P3 | Guild system | 5-6 hours |
| P3 | Events | 2-3 hours |
