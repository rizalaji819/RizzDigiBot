# Phase 3.1 - PvE Combat System ✅ COMPLETED

## Overview

Sistem combat PvE dengan 5 zones, 17 wild monsters, turn-based combat, dan rewards.

**Status:** ✅ Completed

---

## Features

| Feature | Detail | Status |
|---------|--------|--------|
| 5 Zones | Green Forest → Void Realm | ✅ |
| 17 Wild Monsters | Zone-based scaling | ✅ |
| Turn-based Combat | Manual skill selection | ✅ |
| Element Advantage | 1.3x/0.7x multiplier | ✅ |
| Critical Hits | 10% chance, 1.5x damage | ✅ |
| Skill Effects | 10 different effects | ✅ |
| Battle Rewards | EXP, coins, items, eggs | ✅ |

---

## Commands

| Command | Fungsi | Status |
|---------|--------|--------|
| `/battle` | Start battle (select zone) | ✅ |
| `/zones` | View available zones | ✅ |

---

## 5 Zones

| Zone | Emoji | Level | Cost | Monsters |
|------|-------|-------|------|----------|
| Green Forest | 🌲 | 1-10 | Free | Slime, Cat, Dog, Mouse |
| Desert Ruins | 🏜️ | 10-20 | 100c | Wolf, Fox, Snake, Crab |
| Volcanic Peak | 🌋 | 20-30 | 500c | Dragon, Phoenix, Demon, Wyvern |
| Deep Ocean | 🌊 | 30-40 | 1,000c | Sea Serpent, Hydra, Ice Wolf |
| Void Realm | 🌌 | 40-50 | 2,500c | Ancient Dragon, Celestial Wolf, Void Lord |

---

## 17 Wild Monsters

### Zone 1: Green Forest
| Monster | Level | HP | ATK | DEF | EXP | Coins |
|---------|-------|----|-----|-----|-----|-------|
| Wild Slime | 1-3 | 50 | 5 | 2 | 20 | 10 |
| Wild Cat | 2-5 | 60 | 8 | 3 | 35 | 15 |
| Wild Dog | 4-7 | 80 | 7 | 4 | 50 | 25 |
| Wild Mouse | 6-10 | 40 | 10 | 2 | 75 | 35 |

### Zone 2: Desert Ruins
| Monster | Level | HP | ATK | DEF | EXP | Coins |
|---------|-------|----|-----|-----|-----|-------|
| Wild Wolf | 10-14 | 120 | 14 | 6 | 100 | 50 |
| Wild Fox | 12-16 | 100 | 12 | 5 | 120 | 60 |
| Wild Snake | 14-18 | 90 | 16 | 4 | 140 | 70 |
| Wild Crab | 16-20 | 150 | 11 | 12 | 160 | 80 |

### Zone 3: Volcanic Peak
| Monster | Level | HP | ATK | DEF | EXP | Coins |
|---------|-------|----|-----|-----|-----|-------|
| Wild Dragon | 20-24 | 200 | 22 | 10 | 250 | 125 |
| Wild Phoenix | 22-26 | 180 | 20 | 8 | 280 | 140 |
| Wild Demon | 24-28 | 160 | 25 | 6 | 310 | 155 |
| Wild Wyvern | 26-30 | 190 | 21 | 9 | 340 | 170 |

### Zone 4: Deep Ocean
| Monster | Level | HP | ATK | DEF | EXP | Coins |
|---------|-------|----|-----|-----|-----|-------|
| Wild Sea Serpent | 30-34 | 250 | 20 | 15 | 500 | 250 |
| Wild Hydra | 34-38 | 300 | 28 | 20 | 600 | 300 |
| Wild Ice Wolf | 36-40 | 220 | 25 | 14 | 700 | 350 |

### Zone 5: Void Realm
| Monster | Level | HP | ATK | DEF | EXP | Coins |
|---------|-------|----|-----|-----|-----|-------|
| Wild Ancient Dragon | 40-44 | 350 | 35 | 25 | 1,000 | 500 |
| Wild Celestial Wolf | 44-48 | 300 | 30 | 20 | 1,200 | 600 |
| Wild Void Lord | 48-50 | 280 | 38 | 18 | 1,500 | 750 |

---

## Damage Formula

```
Base Damage = ATK × Skill Power / 100
Element Bonus = 1.3 (strong) / 0.7 (weak) / 1.0 (neutral)
Critical = 1.5x (10% + SPD/1000 chance)
Defense Reduction = DEF × 0.5
Final Damage = max(1, Base × Element × Critical - Defense)
```

---

## Battle Flow

```
1. Player: /battle
2. Bot: Show zone selection
3. Player: Select zone
4. Bot: Wild monster appears
5. Turn-based combat:
   - Player chooses skill (inline keyboard)
   - Skill executes with effects
   - Check monster HP → if 0, win
   - Monster attacks
   - Check player HP → if 0, lose
6. Rewards:
   - Pet EXP
   - Coins
   - Item drops (10%)
   - Egg drops (5%)
```

---

## Drop Rates

| Drop | Rate | Detail |
|------|------|--------|
| Basic Food | 10% | Random food item |
| Premium Food | 10% | Random food item |
| Ultra Food | 10% | Random food item |
| Skill Scroll | 5% | Random skill |
| Common Egg | 5% | Zone-specific |
| Rare Egg | 5% | Zone-specific |
| Epic Egg | 5% | Zone-specific |
| Legendary Egg | 5% | Zone-specific |

---

## Skill Effects in Battle

| Effect | Description |
|--------|-------------|
| block_50 | Block 50% damage |
| block_30_heal_10 | Block 30% + heal 10% HP |
| heal_25 | Heal 25% HP |
| atk_boost_20_3 | +20% ATK for 3 turns |
| dodge_40 | 40% dodge chance |
| poison_10_3 | 10% HP/turn for 3 turns |
| burn_8_3 | 8% HP/turn for 3 turns |
| stun_30 | 30% stun 1 turn |
| instant_kill_15 | 15% instant kill |
| coin_toss | 50%: 2.5x or 0 damage |

---

## Files Created/Modified

### New Files
| File | Description |
|------|-------------|
| `src/battle/engine.js` | Battle command + turn logic |
| `src/battle/combat.js` | Damage calc, effects, rewards |
| `src/battle/monsters.js` | Zone + monster data |

### Modified Files
| File | Change |
|------|--------|
| `src/database/index.js` | Add wild_monsters, battle_cooldowns tables |
| `src/index.js` | Register battle commands |

---

## Implementation Checklist

- [x] Update database schema (wild_monsters)
- [x] Create zone & monster data (17 monsters)
- [x] Create battle command with zone selection
- [x] Implement turn-based combat engine
- [x] Add skill effects & element advantage
- [x] Add rewards & drops
- [x] Register commands in index.js
- [x] Test all flows
- [x] Push to GitHub
