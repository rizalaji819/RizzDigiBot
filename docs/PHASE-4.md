# Phase 4 - Economy System ✅ COMPLETED

## Overview

Sistem ekonomi dengan player leveling, daily rewards, leaderboard, dan trading.

**Status:** ✅ Completed

---

## Features

| Feature | Detail | Status |
|---------|--------|--------|
| Player Leveling | EXP dari battle, level-up rewards | ✅ |
| Daily System | 7-day cycle, streak bonus | ✅ |
| Profile | View player stats | ✅ |
| Leaderboard | Top 10 players | ✅ |
| Trading | Pet for pet, items for items | ✅ |
| Level-gated Content | Daily Lv.5, Trading Lv.10 | ✅ |

---

## Commands

| Command | Fungsi | Level | Status |
|---------|--------|-------|--------|
| `/daily` | Claim daily reward | Lv.5 | ✅ |
| `/profile` | View player stats | Any | ✅ |
| `/leaderboard` | Top 10 players | Any | ✅ |
| `/trade @username` | Start trade | Lv.10 | ✅ |

---

## Player Leveling

### EXP Formula
```
EXP to next level = level × 100
Total EXP to Lv.50 = 12,750
```

### Level-up Rewards

| Level | Coins | Item |
|-------|-------|------|
| 2-10 | 100 × level | Basic Food |
| 11-20 | 200 × level | Premium Food |
| 21-30 | 300 × level | Rare Egg |
| 31-40 | 500 × level | Epic Egg |
| 41-50 | 1,000 × level | Legendary Egg |

### Level-gated Content

| Level | Unlock |
|-------|--------|
| 5 | /daily command |
| 10 | Trading system |
| 15 | Premium shop (future) |
| 20 | Guild system (future) |
| 30 | Special events (future) |

---

## Daily System

### 7-Day Cycle

| Day | Coins | Item |
|-----|-------|------|
| 1 | 100 | Basic Food ×1 |
| 2 | 150 | Basic Food ×2 |
| 3 | 200 | Premium Food ×1 |
| 4 | 250 | Premium Food ×2 |
| 5 | 300 | Rare Egg ×1 |
| 6 | 350 | Skill Scroll ×1 |
| 7 | 500 | Epic Egg ×1 |
| 8+ | 500 + streak × 10 | Random |

### Streak System
- Claim daily = streak +1
- Miss daily = streak reset to 0
- Max streak bonus: +500 coins
- Cooldown: 20 hours between claims

---

## Profile System

```
👤 rizalaji1st's Profile

📊 Stats
Level: 15/50
EXP: ████░░░░░░ 450/1500
Total EXP: 5,250

💰 Inventory
Coins: 12,500
Pets: 3/5
Eggs: 5
Items: 8

🔥 Daily Streak: 7
```

---

## Trading System

### Trade Commands
| Command | Description |
|---------|-------------|
| `/trade @username` | Send trade request |
| `/trade accept` | Accept trade |
| `/trade cancel` | Cancel trade |

### Trade Flow
1. `/trade @username` → Send request
2. Other user sees request
3. `/trade accept` → Trade accepted
4. Add items/pets to trade
5. Both confirm → Trade complete

### Trade Rules
- Both users must be Lv.10+
- Only one active trade per user
- Cannot trade with yourself

---

## Leaderboard

```
🏆 Leaderboard - Top 10 Players

🥇 rizalaji1st
   Level 15 | 5,250 EXP

🥈 player2
   Level 12 | 3,800 EXP

🥉 player3
   Level 10 | 2,500 EXP
```

---

## Files Created/Modified

### New Files
| File | Description |
|------|-------------|
| `src/commands/economy.js` | Daily, profile, leaderboard, trade |

### Modified Files
| File | Change |
|------|--------|
| `src/database/index.js` | Add daily_streak, last_daily, trades tables |
| `src/index.js` | Register economy commands |

---

## Implementation Checklist

- [x] Update database schema (daily_streak, last_daily, trades)
- [x] Implement player leveling with rewards
- [x] Create daily command with streak system
- [x] Create trade system
- [x] Create leaderboard command
- [x] Register commands in index.js
- [x] Test all flows
- [x] Push to GitHub
