# Phase 2.1 - Hatch System ✅ COMPLETED

## Overview

Sistem menetas telur untuk mendapatkan pet. Pemain bisa dapat telur dari shop atau free hatch dengan cooldown.

**Status:** ✅ Completed

---

## Features

| Feature | Detail | Status |
|---------|--------|--------|
| Free Hatch | 1x per 3 jam (cooldown) | ✅ |
| Shop | Beli egg pakai coins | ✅ |
| Egg Inventory | Simpan telur sebelum di-hatch | ✅ |
| 4 Rarity Tiers | Common, Rare, Epic, Legendary | ✅ |
| Instant Hatch | Langsung dapat pet + pilih nama | ✅ |
| 44 Pet Species | Mix monster + animals | ✅ |
| Random Skill | 1 skill saat hatch | ✅ |

---

## Rarity System

| Rarity | Drop Rate | Shop Price | Free Hatch |
|--------|-----------|------------|------------|
| Common | 50% | 100 coins | Yes |
| Rare | 30% | 500 coins | Yes |
| Epic | 15% | 2,500 coins | Yes |
| Legendary | 5% | 15,000 coins | Yes |

---

## Commands

| Command | Fungsi | Status |
|---------|--------|--------|
| `/hatch` | Free hatch (cooldown 3 jam) | ✅ |
| `/shop` | Beli egg pakai coins | ✅ |
| `/eggs` | Lihat inventory telur | ✅ |
| `/pets` | Lihat semua pets | ✅ |

---

## Pet Templates

### Common Species (50%) - 20 Pets

| ID | Name | Species | Type | HP | ATK | DEF | Growth |
|----|------|---------|------|-----|-----|-----|--------|
| 1 | Slime | slime | Monster | 80 | 5 | 3 | D |
| 2 | Whiskers | cat | Animal | 70 | 8 | 4 | D |
| 3 | Bark | dog | Animal | 90 | 7 | 5 | D |
| 4 | Squeaks | mouse | Animal | 50 | 6 | 2 | D |
| 5 | Chirpy | bird | Animal | 55 | 9 | 2 | D |
| 6 | Shelly | turtle | Animal | 120 | 4 | 8 | D |
| 7 | Ribbit | frog | Animal | 60 | 7 | 3 | D |
| 8 | Rocky | golem | Monster | 150 | 6 | 10 | D |
| 9 | Buzzy | bee | Animal | 45 | 10 | 1 | D |
| 10 | Chomp | piranha | Animal | 40 | 11 | 2 | D |
| 11 | Fuzzbear | bear_cub | Animal | 100 | 8 | 6 | D |
| 12 | Hoot | owl | Animal | 60 | 9 | 3 | D |
| 13 | Nippy | ferret | Animal | 55 | 8 | 3 | D |
| 14 | Pincers | beetle | Animal | 90 | 6 | 7 | D |
| 15 | Snappy | lizard | Animal | 65 | 7 | 4 | D |
| 16 | Squish | octopus | Animal | 70 | 8 | 5 | D |
| 17 | Waddle | penguin | Animal | 75 | 6 | 6 | D |
| 18 | Yappy | hamster | Animal | 40 | 7 | 2 | D |
| 19 | Fins | goldfish | Animal | 35 | 5 | 1 | D |
| 20 | Crawly | ant | Animal | 30 | 6 | 2 | D |

### Rare Species (30%) - 12 Pets

| ID | Name | Species | Type | HP | ATK | DEF | Growth |
|----|------|---------|------|-----|-----|-----|--------|
| 21 | Fang | wolf | Monster | 110 | 14 | 7 | C |
| 22 | Ember | fox | Monster | 90 | 12 | 6 | C |
| 23 | Hop | bunny | Animal | 80 | 10 | 5 | C |
| 24 | Snap | crocodile | Monster | 140 | 15 | 9 | C |
| 25 | Hiss | snake | Monster | 75 | 13 | 4 | C |
| 26 | Claw | crab | Monster | 100 | 11 | 12 | C |
| 27 | Quill | porcupine | Animal | 95 | 10 | 11 | C |
| 28 | Hornet | giant_wasp | Monster | 70 | 16 | 3 | C |
| 29 | Tusker | boar | Animal | 130 | 13 | 8 | C |
| 30 | Raptor | hawk | Animal | 85 | 15 | 4 | C |
| 31 | Snarl | hyena | Monster | 105 | 14 | 6 | C |
| 32 | Shellback | armadillo | Animal | 120 | 9 | 14 | C |

### Epic Species (15%) - 8 Pets

| ID | Name | Species | Type | HP | ATK | DEF | Growth |
|----|------|---------|------|-----|-----|-----|--------|
| 33 | Blaze | dragon | Monster | 160 | 22 | 12 | B |
| 34 | Solar | phoenix | Monster | 130 | 20 | 8 | B |
| 35 | Sparkle | unicorn | Monster | 140 | 18 | 14 | B |
| 36 | Shadow | demon | Monster | 120 | 25 | 6 | B |
| 37 | Frost | ice_wolf | Monster | 150 | 19 | 11 | B |
| 38 | Thorn | treant | Monster | 180 | 16 | 16 | B |
| 39 | Viper | wyvern | Monster | 135 | 21 | 9 | B |
| 40 | Tide | sea_serpent | Monster | 145 | 17 | 13 | B |

### Legendary Species (5%) - 4 Pets

| ID | Name | Species | Type | HP | ATK | DEF | Growth |
|----|------|---------|------|-----|-----|-----|--------|
| 41 | Inferno | ancient_dragon | Monster | 220 | 35 | 20 | A |
| 42 | Luna | celestial_wolf | Monster | 200 | 30 | 18 | A |
| 43 | Hydra | hydra | Monster | 250 | 28 | 25 | A |
| 44 | Zero | void_lord | Monster | 180 | 38 | 15 | A |

---

## Egg Prices

| Rarity | Shop Price | Free Hatch |
|--------|------------|------------|
| Common | 100 coins | ✅ Yes |
| Rare | 500 coins | ✅ Yes |
| Epic | 2,500 coins | ✅ Yes |
| Legendary | 15,000 coins | ✅ Yes |

---

## Files Created/Modified

### New Files
| File | Description |
|------|-------------|
| `src/commands/hatch.js` | /hatch, /eggs commands |
| `src/commands/shop.js` | /shop command |
| `src/pet/templates.js` | All 44 pet templates data |

### Modified Files
| File | Change |
|------|--------|
| `src/database/index.js` | Add egg_inventory table, alter users |
| `src/index.js` | Register new commands |
| `src/commands/start.js` | Update menu text |

---

## Implementation Checklist

- [x] Update database schema (egg_inventory table, users alteration)
- [x] Create pet templates data (44 species)
- [x] Create shop command
- [x] Create hatch command
- [x] Update start command
- [x] Register commands in index.js
- [x] Test all flows
- [x] Push to GitHub
