# Phase 2.3 - Pet Skills System ✅ COMPLETED

## Overview

Sistem skill untuk pet dengan 15 skill, 5 element, dan slot by rarity.

**Status:** ✅ Completed

---

## Features

| Feature | Detail | Status |
|---------|--------|--------|
| 15 Skills | Attack/Defense/Support/Evasion/DoT/Stun/Special | ✅ |
| 5 Elements | Fire/Water/Earth/Light/Dark | ✅ |
| Skill Slots | By rarity (1/2/3/4) | ✅ |
| Skill Shop | Beli skill scrolls | ✅ |
| Random Skill | 1 skill saat hatch | ✅ |

---

## Commands

| Command | Fungsi | Status |
|---------|--------|--------|
| `/skills <pet_id>` | Lihat skill pet | ✅ |
| `/skilllearn <pet_id> <skill_id>` | Learn skill dari scroll | ✅ |
| `/skillset <pet_id> <slot> <skill_id>` | Set skill ke slot | ✅ |
| `/skillshop` | Beli skill scrolls | ✅ |

---

## Skill Slots by Rarity

| Rarity | Skill Slots |
|--------|-------------|
| Common | 1 |
| Rare | 2 |
| Epic | 3 |
| Legendary | 4 |

---

## 5 Elements

| Element | Emoji | Strong Against | Weak Against |
|---------|-------|---------------|--------------|
| Fire | 🔥 | Earth | Water |
| Water | 💧 | Fire | Earth |
| Earth | 🌍 | Water | Fire |
| Light | ✨ | Dark | Dark |
| Dark | 🌑 | Light | Light |

**Element Advantage:** 1.3x damage
**Element Disadvantage:** 0.7x damage

---

## 15 Skills

### Attack Skills (5)
| ID | Name | Element | Power | Price | Description |
|----|------|---------|-------|-------|-------------|
| 1 | Fireball | 🔥 Fire | 120 | 1,000c | Hurl a fiery projectile |
| 2 | Hydro Pump | 💧 Water | 120 | 1,000c | Blast with high-pressure water |
| 3 | Earthquake | 🌍 Earth | 120 | 1,000c | Shake the ground |
| 4 | Holy Smite | ✨ Light | 130 | 1,500c | Call down divine light |
| 5 | Shadow Strike | 🌑 Dark | 130 | 1,500c | Attack from shadows |

### Defense Skills (2)
| ID | Name | Element | Effect | Price | Description |
|----|------|---------|--------|-------|-------------|
| 6 | Iron Shield | 🌍 Earth | Block 50% | 1,200c | Raise impenetrable shield |
| 7 | Water Veil | 💧 Water | Block 30% + Heal 10% | 1,500c | Surround with water |

### Support Skills (2)
| ID | Name | Element | Effect | Price | Description |
|----|------|---------|--------|-------|-------------|
| 8 | Healing Light | ✨ Light | Heal 25% HP | 1,200c | Channel holy energy |
| 9 | War Cry | 🔥 Fire | +20% ATK 3 turns | 1,000c | Boost attack |

### Evasion Skills (1)
| ID | Name | Element | Effect | Price | Description |
|----|------|---------|--------|-------|-------------|
| 10 | Shadow Step | 🌑 Dark | 40% dodge | 1,500c | Step into shadows |

### DoT Skills (2)
| ID | Name | Element | Effect | Price | Description |
|----|------|---------|--------|-------|-------------|
| 11 | Poison Fang | 🌑 Dark | 10% HP/turn 3 turns | 1,200c | Bite with venom |
| 12 | Burning Touch | 🔥 Fire | 8% HP/turn 3 turns | 1,000c | Set ablaze |

### Stun Skills (1)
| ID | Name | Element | Effect | Price | Description |
|----|------|---------|--------|-------|-------------|
| 13 | Stun Bash | 🌍 Earth | 30% stun 1 turn | 1,500c | BASH! |

### Special Skills (2)
| ID | Name | Element | Effect | Price | Description |
|----|------|---------|--------|-------|-------------|
| 14 | Divine Judgment | ✨ Light | 15% instant kill | 3,000c | Divine judgment |
| 15 | Coin Toss | 🌑 Dark | 50%: 2.5x or 0 damage | 2,500c | Heads or tails? |

---

## Skill Effects Reference

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
| coin_toss | 50%: 2.5x damage, 50%: 0 damage |

---

## Skill Obtain Methods

| Method | Detail |
|--------|--------|
| Random at hatch | 1 random skill (any rarity) |
| Shop | Buy skill scrolls (1,000-3,000 coins) |
| Battle drop | 5% chance per battle |

---

## Files Created/Modified

### New Files
| File | Description |
|------|-------------|
| `src/commands/skills.js` | Skill shop, learn, set commands |
| `src/pet/skills.js` | 15 skill templates, element system |

### Modified Files
| File | Change |
|------|--------|
| `src/database/index.js` | Add skills, pet_skills tables |
| `src/commands/hatch.js` | Add random skill on hatch |
| `src/index.js` | Register skill commands |

---

## Implementation Checklist

- [x] Update database schema (skills, pet_skills)
- [x] Create skill templates (15 skills)
- [x] Create skill shop command
- [x] Create pet skills management
- [x] Integrate with hatch (random skill)
- [x] Register commands in index.js
- [x] Test all flows
- [x] Push to GitHub
