const { Markup } = require('telegraf');
const db = require('../database');
const { getOrCreateUser } = require('../utils/helpers');
const { ZONES, ZONE_EMOJI, ELEMENT_EMOJI, getRandomMonster, scaleMonster } = require('./monsters');
const { calculateDamage, applySkillEffect, processDotEffects, monsterAttack, calculateBattleRewards } = require('./combat');
const { SKILL_TEMPLATES, getSkillById, RARITY_EMOJI } = require('../pet/skills');

const activeBattles = new Map();

function zonesCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const activePet = db.prepare('SELECT * FROM pets WHERE owner_id = ? AND is_active = 1').get(user.id);

  if (!activePet) {
    return ctx.reply('❌ You need an active pet to battle!\n\nUse /pets to select one.');
  }

  let text = `⚔️ *Available Zones*\n\n`;
  text += `Your pet: ${activePet.name} (Lv.${activePet.level})\n\n`;

  for (const zone of ZONES) {
    const canEnter = activePet.level >= zone.minLevel;
    const status = canEnter ? '✅' : '🔒';
    text += `${status} ${ZONE_EMOJI[zone.id]} *${zone.name}*\n`;
    text += `   Level: ${zone.minLevel}-${zone.maxLevel} | Cost: ${zone.entryCost > 0 ? zone.entryCost + ' coins' : 'Free'}\n`;
    text += `   ${zone.description}\n\n`;
  }

  text += `Use /battle to start a battle!`;

  ctx.reply(text, { parse_mode: 'Markdown' });
}

function battleCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const activePet = db.prepare('SELECT * FROM pets WHERE owner_id = ? AND is_active = 1').get(user.id);

  if (!activePet) {
    return ctx.reply('❌ You need an active pet to battle!\n\nUse /pets to select one.');
  }

  if (activeBattles.has(user.id)) {
    return ctx.reply('❌ You already have an active battle!\n\nFinish it first or wait.');
  }

  const buttons = ZONES.map((zone) => {
    const canEnter = activePet.level >= zone.minLevel;
    const prefix = canEnter ? '✅' : '🔒';
    return [Markup.button.callback(`${prefix} ${ZONE_EMOJI[zone.id]} ${zone.name}`, `battle_zone_${zone.id}`)];
  });

  ctx.reply(
    `⚔️ *Select a Zone*\n\n` +
    `Your pet: ${activePet.name} (Lv.${activePet.level})\n` +
    `HP: ${activePet.hp}/${activePet.hp}\n\n` +
    `Select a zone to battle:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(buttons),
    }
  );
}

function handleZoneSelect(ctx, zoneId) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const activePet = db.prepare('SELECT * FROM pets WHERE owner_id = ? AND is_active = 1').get(user.id);

  if (!activePet) {
    return ctx.reply('❌ No active pet!');
  }

  const zone = ZONES.find(z => z.id === zoneId);
  if (!zone) {
    return ctx.reply('❌ Zone not found!');
  }

  if (activePet.level < zone.minLevel) {
    return ctx.reply(`❌ Your pet needs to be level ${zone.minLevel} to enter ${zone.name}!`);
  }

  if (zone.entryCost > 0 && user.coins < zone.entryCost) {
    return ctx.reply(
      `❌ Not enough coins!\n\n` +
      `Entry cost: ${zone.entryCost} coins\n` +
      `Your coins: ${user.coins}`,
      { parse_mode: 'Markdown' }
    );
  }

  if (zone.entryCost > 0) {
    db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(zone.entryCost, user.id);
  }

  const monsterTemplate = getRandomMonster(zoneId, activePet.level);
  const monster = scaleMonster(monsterTemplate, activePet.level);

  const petSkills = db.prepare('SELECT ps.*, s.name as skill_name, s.type as skill_type, s.element, s.power, s.effect FROM pet_skills ps JOIN skills s ON ps.skill_id = s.id WHERE ps.pet_id = ?').all(activePet.id);

  const battleState = {
    userId: user.id,
    pet: { ...activePet, currentHp: activePet.hp, maxHp: activePet.hp, buffs: [], dots: [], stunned: false },
    monster: { ...monster, currentHp: monster.hp, maxHp: monster.hp, stunned: false },
    zone,
    turn: 1,
    petSkills: petSkills.length > 0 ? petSkills : [{ skill_name: 'Tackle', skill_type: 'attack', element: 'neutral', power: 80, effect: null }],
    log: [],
  };

  activeBattles.set(user.id, battleState);

  showBattleScene(ctx, battleState);
}

function showBattleScene(ctx, battle) {
  const petHpPercent = Math.floor((battle.pet.currentHp / battle.pet.maxHp) * 100);
  const monsterHpPercent = Math.floor((battle.monster.currentHp / battle.monster.maxHp) * 100);

  const petHpBar = '█'.repeat(Math.floor(petHpPercent / 10)) + '░'.repeat(10 - Math.floor(petHpPercent / 10));
  const monsterHpBar = '█'.repeat(Math.floor(monsterHpPercent / 10)) + '░'.repeat(10 - Math.floor(monsterHpPercent / 10));

  let text = `⚔️ *BATTLE - Turn ${battle.turn}*\n\n`;
  text += `🌲 ${battle.zone.name}\n\n`;

  text += `🐾 *${battle.pet.name}* (Lv.${battle.pet.level})\n`;
  text += `HP: ${petHpBar} ${battle.pet.currentHp}/${battle.pet.maxHp}\n`;
  if (battle.pet.buffs && battle.pet.buffs.length > 0) {
    text += `Buffs: ${battle.pet.buffs.map(b => `${b.stat.toUpperCase()} +${b.boost}% (${b.duration}t)`).join(', ')}\n`;
  }
  if (battle.pet.dots && battle.pet.dots.length > 0) {
    text += `DoT: ${battle.pet.dots.map(d => `${d.type} (${d.duration}t)`).join(', ')}\n`;
  }
  text += `\n`;

  text += `👾 *${battle.monster.name}* (Lv.${battle.monster.level}) ${ELEMENT_EMOJI[battle.monster.element] || '⚪'}\n`;
  text += `HP: ${monsterHpBar} ${battle.monster.currentHp}/${battle.monster.maxHp}\n\n`;

  if (battle.log.length > 0) {
    text += `📝 *Battle Log:*\n`;
    for (const msg of battle.log.slice(-3)) {
      text += `${msg}\n`;
    }
    text += `\n`;
  }

  const skillButtons = battle.petSkills.map((skill, i) => {
    return [Markup.button.callback(`${ELEMENT_EMOJI[skill.element] || '⚪'} ${skill.skill_name}`, `battle_skill_${i}`)];
  });

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(skillButtons),
  });
}

function handleBattleSkill(ctx, skillIndex) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const battle = activeBattles.get(user.id);

  if (!battle) {
    return ctx.reply('❌ No active battle!');
  }

  if (battle.pet.stunned) {
    battle.pet.stunned = false;
    battle.log.push(`⚡ ${battle.pet.name} is stunned and cannot act!`);
    processMonsterTurn(ctx, battle);
    return;
  }

  const skill = battle.petSkills[skillIndex];
  if (!skill) {
    return ctx.reply('❌ Invalid skill!');
  }

  const skillData = getSkillById(skill.skill_id);
  if (!skillData) {
    return ctx.reply('❌ Skill not found!');
  }

  let totalDamage = 0;
  let skillMessages = [];

  if (skillData.power > 0) {
    const { damage, isCritical, elementMultiplier } = calculateDamage(battle.pet, battle.monster, skillData);
    totalDamage = damage;

    if (skillData.effect) {
      const effectResult = applySkillEffect(skillData.effect, battle.monster, battle.pet);
      if (effectResult.coinTossMultiplier !== undefined) {
        totalDamage = Math.floor(damage * effectResult.coinTossMultiplier);
      }
      if (effectResult.message) skillMessages.push(effectResult.message);
      if (effectResult.stun) battle.monster.stunned = true;
      if (effectResult.dot) {
        if (!battle.monster.dots) battle.monster.dots = [];
        battle.monster.dots.push({ ...effectResult.dot, type: skillData.name });
      }
    }

    let msg = `⚔️ ${battle.pet.name} used ${skillData.name}!`;
    if (isCritical) msg += ' 💥 CRITICAL!';
    if (elementMultiplier > 1) msg += ' 🔥 Super effective!';
    if (elementMultiplier < 1) msg += ' 💧 Not very effective...';
    msg += ` Dealt ${totalDamage} damage!`;
    skillMessages.unshift(msg);
  } else if (skillData.effect) {
    const effectResult = applySkillEffect(skillData.effect, battle.pet, battle.pet);
    if (effectResult.heal > 0) {
      battle.pet.currentHp = Math.min(battle.pet.maxHp, battle.pet.currentHp + effectResult.heal);
    }
    if (effectResult.message) skillMessages.push(effectResult.message);
    if (effectResult.buff) {
      if (!battle.pet.buffs) battle.pet.buffs = [];
      battle.pet.buffs.push(effectResult.buff);
    }
  }

  battle.monster.currentHp -= totalDamage;
  battle.monster.currentHp = Math.max(0, battle.monster.currentHp);

  battle.log.push(...skillMessages);

  if (battle.monster.currentHp <= 0) {
    endBattle(ctx, battle, true);
    return;
  }

  processMonsterTurn(ctx, battle);
}

function processMonsterTurn(ctx, battle) {
  if (battle.monster.stunned) {
    battle.monster.stunned = false;
    battle.log.push(`⚡ ${battle.monster.name} is stunned and cannot attack!`);
    battle.turn++;
    showBattleScene(ctx, battle);
    return;
  }

  const { damage, isCritical } = monsterAttack(battle.monster, battle.pet);

  let blocked = 0;
  if (battle.pet.blockPercent) {
    blocked = Math.floor(damage * battle.pet.blockPercent / 100);
    damage -= blocked;
    battle.pet.blockPercent = 0;
  }

  battle.pet.currentHp -= damage;
  battle.pet.currentHp = Math.max(0, battle.pet.currentHp);

  let msg = `👾 ${battle.monster.name} attacked!`;
  if (isCritical) msg += ' 💥 CRITICAL!';
  if (blocked > 0) msg += ` 🛡️ Blocked ${blocked}!`;
  msg += ` Dealt ${damage} damage!`;
  battle.log.push(msg);

  if (battle.pet.currentHp <= 0) {
    endBattle(ctx, battle, false);
    return;
  }

  const dotResult = processDotEffects(battle.pet);
  if (dotResult.messages.length > 0) {
    battle.log.push(...dotResult.messages);
  }
  if (battle.pet.currentHp <= 0) {
    endBattle(ctx, battle, false);
    return;
  }

  battle.turn++;
  showBattleScene(ctx, battle);
}

function endBattle(ctx, battle, won) {
  activeBattles.delete(battle.userId);

  if (won) {
    const rewards = calculateBattleRewards(battle.monster, battle.pet);

    db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(rewards.coinReward, battle.userId);

    const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(battle.pet.id);
    let newExp = pet.exp + rewards.expReward;
    let newLevel = pet.level;
    let leveledUp = false;

    while (newExp >= newLevel * 100 && newLevel < 50) {
      newExp -= newLevel * 100;
      newLevel++;
      leveledUp = true;
    }

    if (newLevel >= 50) newExp = 0;

    const growth = { D: { hp: 2, atk: 1, def: 0.5 }, C: { hp: 4, atk: 2, def: 1 }, B: { hp: 6, atk: 3, def: 1.5 }, A: { hp: 8, atk: 4, def: 2 }, S: { hp: 10, atk: 5, def: 2.5 } };
    const g = growth[pet.growth_rate] || growth.D;
    const levelsGained = newLevel - pet.level;

    db.prepare('UPDATE pets SET exp = ?, level = ?, hp = hp + ?, attack = attack + ?, defense = defense + ? WHERE id = ?')
      .run(newExp, newLevel, Math.floor(levelsGained * g.hp * pet.prestige_bonus), Math.floor(levelsGained * g.atk * pet.prestige_bonus), Math.floor(levelsGained * g.def * pet.prestige_bonus), battle.pet.id);

    for (const drop of rewards.drops) {
      if (drop.type === 'food') {
        const existing = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ?').get(battle.userId, drop.name);
        if (existing) {
          db.prepare('UPDATE pet_items SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
        } else {
          db.prepare('INSERT INTO pet_items (owner_id, item_name, quantity) VALUES (?, ?, 1)').run(battle.userId, drop.name);
        }
      } else if (drop.type === 'egg') {
        const existing = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND rarity = ?').get(battle.userId, drop.rarity);
        if (existing) {
          db.prepare('UPDATE egg_inventory SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
        } else {
          db.prepare('INSERT INTO egg_inventory (owner_id, rarity, quantity) VALUES (?, ?, 1)').run(battle.userId, drop.rarity);
        }
      } else if (drop.type === 'scroll') {
        const { getRandomSkill } = require('../pet/skills');
        const randomSkill = getRandomSkill();
        const scrollName = `Scroll: ${randomSkill.name}`;
        const existing = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ?').get(battle.userId, scrollName);
        if (existing) {
          db.prepare('UPDATE pet_items SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
        } else {
          db.prepare('INSERT INTO pet_items (owner_id, item_name, quantity) VALUES (?, ?, 1)').run(battle.userId, scrollName);
        }
      }
    }

    const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

    let text = `🎉 *VICTORY!*\n\n`;
    text += `🐾 ${battle.pet.name} defeated ${battle.monster.name}!\n\n`;
    text += `📝 *Battle Summary:*\n`;
    for (const msg of battle.log) {
      text += `${msg}\n`;
    }
    text += `\n💰 *Rewards:*\n`;
    text += `+${rewards.expReward} EXP\n`;
    text += `+${rewards.coinReward} Coins\n`;
    if (leveledUp) text += `🎉 Level Up! Now Lv.${newLevel}!\n`;
    if (rewards.drops.length > 0) {
      text += `\n🎁 *Drops:*\n`;
      for (const drop of rewards.drops) {
        text += `${drop.name} x${drop.quantity}\n`;
      }
    }
    text += `\n💰 Total coins: ${updatedUser.coins}`;

    ctx.reply(text, { parse_mode: 'Markdown' });
  } else {
    let text = `💀 *DEFEAT!*\n\n`;
    text += `${battle.monster.name} defeated ${battle.pet.name}!\n\n`;
    text += `📝 *Battle Summary:*\n`;
    for (const msg of battle.log) {
      text += `${msg}\n`;
    }
    text += `\nBetter luck next time!`;

    ctx.reply(text, { parse_mode: 'Markdown' });
  }
}

module.exports = {
  zonesCommand,
  battleCommand,
  handleZoneSelect,
  handleBattleSkill,
};
