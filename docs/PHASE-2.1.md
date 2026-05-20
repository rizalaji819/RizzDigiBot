# Phase 2.1 - Hatch System

## Overview

Sistem menetas telur untuk mendapatkan pet. Pemain bisa dapat telur dari shop atau free hatch dengan cooldown.

---

## Features

| Feature | Detail |
|---------|--------|
| Free Hatch | 1x per 3 jam (cooldown) |
| Shop | Beli egg pakai coins |
| Egg Inventory | Simpan telur sebelum di-hatch |
| 4 Rarity Tiers | Common, Rare, Epic, Legendary |
| Instant Hatch | Langsung dapat pet + pilih nama |
| 24 Pet Species | Mix monster + animals |

---

## Rarity System

| Rarity | Drop Rate | Shop Price | Free Hatch |
|--------|-----------|------------|------------|
| Common | 55% | 100 coins | Yes |
| Rare | 27% | 500 coins | Yes |
| Epic | 14% | 2,500 coins | Yes |
| Legendary | 4% | 15,000 coins | Yes |

---

## Database Schema Changes

### New Table: egg_inventory

```sql
CREATE TABLE IF NOT EXISTS egg_inventory (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  rarity TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### Alter Table: users

```sql
ALTER TABLE users ADD COLUMN last_free_hatch DATETIME;
```

---

## Commands

| Command | Fungsi | Status |
|---------|--------|--------|
| `/hatch` | Free hatch (cooldown 3 jam) | Planned |
| `/hatch <rarity>` | Hatch egg dari inventory | Planned |
| `/shop` | Beli egg pakai coins | Planned |
| `/shop buy <rarity>` | Beli egg | Planned |
| `/eggs` | Lihat inventory telur | Planned |
| `/pets` | Lihat semua pets | Planned |

---

## Flow: Free Hatch

```
User: /hatch
  │
  ├─ Cek last_free_hatch
  │   ├─ Belum cooldown → "Free hatch ready!"
  │   └─ Masih cooldown → "Tunggu X jam lagi"
  │
  ├─ Roll rarity (55/27/14/4)
  │
  ├─ Roll species berdasarkan rarity
  │
  ├─ Insert ke pets table
  │
  └─ Tampilkan hasil:
     "🥚 You hatched a [Rarity] [Species]!
      Name: ???
      HP: X | ATK: Y | DEF: Z
      Reply with a name for your pet!"
```

---

## Flow: Shop

```
User: /shop
  │
  └─ Tampilkan:
     ┌─────────────────────────────┐
     │  🏪 RizzDigi Shop           │
     │                             │
     │  🥚 Common Egg    - 100c    │
     │  🥚 Rare Egg      - 500c    │
     │  🥚 Epic Egg      - 2,500c  │
     │  🥚 Legendary Egg - 15,000c │
     │                             │
     │  Your coins: 1,234          │
     └─────────────────────────────┘

User: [Click "Buy Common Egg"]
  │
  ├─ Cek coins >= 100
  │   ├─ Ya → Kurangi coins, tambah ke egg_inventory
  │   └─ Tidak → "Not enough coins!"
  │
  └─ Tampilkan:
     "✅ Bought 1 Common Egg! Use /eggs to view."
```

---

## Flow: Hatch from Inventory

```
User: /hatch
  │
  ├─ Cek egg_inventory
  │   ├─ Kosong → "No eggs! Buy from /shop"
  │   └─ Ada eggs → Tampilkan list
  │
  └─ User pilih egg
      │
      ├─ Roll species berdasarkan rarity
      ├─ Insert ke pets
      ├─ Kurangi egg_inventory
      └─ Tampilkan hasil + minta nama
```

---

## Pet Templates

### Common Species (55%)

| ID | Name | Species | Type | Base HP | Base ATK | Base DEF | Description |
|----|------|---------|------|---------|----------|----------|-------------|
| 1 | Slime | slime | Monster | 80 | 5 | 3 | A bouncy blob of goo. Simple but loyal. |
| 2 | Whiskers | cat | Animal | 70 | 8 | 4 | A curious cat with sharp claws. |
| 3 | Bark | dog | Animal | 90 | 7 | 5 | A faithful companion with strong jaws. |
| 4 | Squeaks | mouse | Animal | 50 | 6 | 2 | Small but surprisingly fast. |
| 5 | Chirpy | bird | Animal | 55 | 9 | 2 | A swift flyer with sharp beak. |
| 6 | Shelly | turtle | Animal | 120 | 4 | 8 | Slow but has a rock-hard shell. |
| 7 | Ribbit | frog | Animal | 60 | 7 | 3 | Can leap high and poison enemies. |
| 8 | Rocky | golem | Monster | 150 | 6 | 10 | Made of stone. Extremely durable. |

### Rare Species (27%)

| ID | Name | Species | Type | Base HP | Base ATK | Base DEF | Description |
|----|------|---------|------|---------|----------|----------|-------------|
| 9 | Fang | wolf | Monster | 110 | 14 | 7 | Pack hunter with devastating bite. |
| 10 | Ember | fox | Monster | 90 | 12 | 6 | Cunning and fast with fire tricks. |
| 11 | Hop | bunny | Animal | 80 | 10 | 5 | Don't let the cuteness fool you. |
| 12 | Snap | crocodile | Monster | 140 | 15 | 9 | Ancient predator with iron jaws. |
| 13 | Hiss | snake | Monster | 75 | 13 | 4 | Stealthy striker with venomous fangs. |
| 14 | Claw | crab | Monster | 100 | 11 | 12 | Hard shell and crushing claws. |
| 15 | Buzz | bee | Monster | 65 | 14 | 3 | Small but packs a painful sting. |
| 16 | Quill | porcupine | Animal | 95 | 10 | 11 | Spines make it hard to attack. |

### Epic Species (14%)

| ID | Name | Species | Type | Base HP | Base ATK | Base DEF | Description |
|----|------|---------|------|---------|----------|----------|-------------|
| 17 | Blaze | dragon | Monster | 160 | 22 | 12 | Breathes fire, king of the skies. |
| 18 | Solar | phoenix | Monster | 130 | 20 | 8 | Reborn from its own ashes. |
| 19 | Sparkle | unicorn | Monster | 140 | 18 | 14 | Magical horn purifies all wounds. |
| 20 | Shadow | demon | Monster | 120 | 25 | 6 | Feeds on fear and darkness. |
| 21 | Frost | ice_wolf | Monster | 150 | 19 | 11 | Breathes freezing wind. |
| 22 | Thorn | treant | Monster | 180 | 16 | 16 | Ancient tree guardian. |
| 23 | Viper | wyvern | Monster | 135 | 21 | 9 | Flying reptile with toxic tail. |
| 24 | Tide | sea_serpent | Monster | 145 | 17 | 13 | Rules the deep oceans. |

### Legendary Species (4%)

| ID | Name | Species | Type | Base HP | Base ATK | Base DEF | Description |
|----|------|---------|------|---------|----------|----------|-------------|
| 25 | Inferno | ancient_dragon | Monster | 220 | 35 | 20 | The oldest and most powerful dragon. |
| 26 | Luna | celestial_wolf | Monster | 200 | 30 | 18 | Guardian of the moonlit night. |
| 27 | Hydra | hydra | Monster | 250 | 28 | 25 | Cut one head, two more appear. |
| 28 | Zero | void_lord | Monster | 180 | 38 | 15 | Master of dimensions and time. |

---

## Egg Prices

| Rarity | Shop Price | Free Hatch |
|--------|------------|------------|
| Common | 100 coins | ✅ Yes |
| Rare | 500 coins | ✅ Yes |
| Epic | 2,500 coins | ✅ Yes |
| Legendary | 15,000 coins | ✅ Yes |

---

## Files to Create/Modify

### New Files
| File | Description |
|------|-------------|
| `src/commands/hatch.js` | /hatch, /eggs commands |
| `src/commands/shop.js` | /shop command |
| `src/pet/templates.js` | All 28 pet templates data |

### Modified Files
| File | Change |
|------|--------|
| `src/database/index.js` | Add egg_inventory table, alter users |
| `src/index.js` | Register new commands |
| `src/commands/start.js` | Update menu text |
| `.gitignore` | Already correct |

---

## Implementation Order

1. [ ] Update database schema (egg_inventory table, users alteration)
2. [ ] Create pet templates data (28 species)
3. [ ] Create shop command
4. [ ] Create hatch command
5. [ ] Update start command
6. [ ] Register commands in index.js
7. [ ] Test all flows
8. [ ] Push to GitHub
