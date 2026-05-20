const { Markup } = require('telegraf');
const db = require('../database');
const {
  RARITY_EMOJI,
  GROWTH_EMOJI,
  GROWTH_RATES,
  MAX_LEVEL,
  PRESTIGE_BONUS,
  getExpToLevel,
  getTrainingCost,
  getTrainingExp,
  getSellPrice,
} = require('../pet/templates');
const { getOrCreateUser } = require('../utils/helpers');

function petDetailCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length === 0) {
    return ctx.reply('Usage: /pet <pet_id>\nExample: /pet 1');
  }

  const petId = parseInt(args[0]);
  if (isNaN(petId)) {
    return ctx.reply('❌ Invalid pet ID.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  const growth = GROWTH_RATES[pet.growth_rate] || GROWTH_RATES.D;
  const expToNext = getExpToLevel(pet.level);
  const powerScore = Math.floor(pet.attack + pet.defense + pet.hp / 2);
  const active = pet.is_active ? ' ⭐ ACTIVE' : '';

  let text =
    `${RARITY_EMOJI[pet.rarity]} *${pet.name}*${active}\n\n` +
    `📊 *Basic Stats*\n` +
    `Species: ${pet.species}\n` +
    `Rarity: ${pet.rarity.charAt(0).toUpperCase() + pet.rarity.slice(1)}\n` +
    `Level: ${pet.level}/${MAX_LEVEL}\n` +
    `EXP: ${pet.exp}/${expToNext}\n` +
    `Prestige: ${pet.prestige}\n\n` +
    `⚔️ *Combat Stats*\n` +
    `HP: ${pet.hp}\n` +
    `ATK: ${pet.attack}\n` +
    `DEF: ${pet.defense}\n\n` +
    `📈 *Power Score: ${powerScore}*\n\n` +
    `🌱 *Growth Rate: ${GROWTH_EMOJI[pet.growth_rate]} ${pet.growth_rate}*\n` +
    `Per level: +${growth.hp} HP, +${growth.attack} ATK, +${growth.defense} DEF\n\n` +
    `🎯 *Actions*\n` +
    `/feed ${pet.id} - Feed with food item\n` +
    `/train ${pet.id} - Train (${getTrainingCost(pet.level)} coins)\n` +
    `/rename ${pet.id} <name> - Rename\n` +
    `/release ${pet.id} - Release pet`;

  if (pet.level >= MAX_LEVEL) {
    text += `\n/prestige ${pet.id} - Prestige (reset to Lv.1, +20% stats)`;
  }

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('⭐ Set Active', `pet_setactive_${pet.id}`)],
      [Markup.button.callback('🔄 Refresh', `pet_refresh_${pet.id}`)],
    ]),
  });
}

function feedCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 1) {
    return ctx.reply('Usage: /feed <pet_id>\nExample: /feed 1');
  }

  const petId = parseInt(args[0]);
  if (isNaN(petId)) {
    return ctx.reply('❌ Invalid pet ID.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  const items = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND quantity > 0').all(user.id);
  if (items.length === 0) {
    return ctx.reply(
      `❌ You have no food items!\n\n` +
      `Use /shop items to buy food.`,
      { parse_mode: 'Markdown' }
    );
  }

  const buttons = items.map((item) => {
    return [Markup.button.callback(`${item.item_name} (x${item.quantity})`, `feed_${pet.id}_${item.item_name.replace(/\s/g, '_')}`)];
  });

  ctx.reply(
    `🍽️ *Feed ${pet.name}*\n\nSelect food item:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(buttons),
    }
  );
}

function handleFeed(ctx, petId, itemName) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  const item = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ? AND quantity > 0').get(user.id, itemName.replace(/_/g, ' '));
  if (!item) {
    return ctx.reply('❌ Item not found!');
  }

  if (item.quantity > 1) {
    db.prepare('UPDATE pet_items SET quantity = quantity - 1 WHERE id = ?').run(item.id);
  } else {
    db.prepare('DELETE FROM pet_items WHERE id = ?').run(item.id);
  }

  const itemTemplate = db.prepare('SELECT * FROM item_templates WHERE name = ?').get(itemName.replace(/_/g, ' '));
  const expGain = itemTemplate ? itemTemplate.exp_value : 50;

  const result = addExpToPet(pet, expGain);

  ctx.reply(
    `🍽️ *Fed ${pet.name} with ${itemName.replace(/_/g, ' ')}!*\n\n` +
    `+${result.expGained} EXP\n` +
    (result.leveledUp ? `🎉 Level Up! Now Lv.${result.newLevel}!\n` : '') +
    `EXP: ${result.newExp}/${getExpToLevel(result.newLevel)}\n` +
    `Level: ${result.newLevel}/${MAX_LEVEL}`,
    { parse_mode: 'Markdown' }
  );
}

function trainCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 1) {
    return ctx.reply('Usage: /train <pet_id>\nExample: /train 1');
  }

  const petId = parseInt(args[0]);
  if (isNaN(petId)) {
    return ctx.reply('❌ Invalid pet ID.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  if (pet.level >= MAX_LEVEL) {
    return ctx.reply('❌ Pet is already at max level! Use /prestige to reset.');
  }

  const cost = getTrainingCost(pet.level);
  const expGain = getTrainingExp(pet.level);

  if (user.coins < cost) {
    return ctx.reply(
      `❌ Not enough coins!\n\n` +
      `Training cost: ${cost} coins\n` +
      `Your coins: ${user.coins}`,
      { parse_mode: 'Markdown' }
    );
  }

  db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(cost, user.id);

  const result = addExpToPet(pet, expGain);

  const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

  ctx.reply(
    `🏋️ *Trained ${pet.name}!*\n\n` +
    `-${cost} coins\n` +
    `+${result.expGained} EXP\n` +
    (result.leveledUp ? `🎉 Level Up! Now Lv.${result.newLevel}!\n` : '') +
    `EXP: ${result.newExp}/${getExpToLevel(result.newLevel)}\n` +
    `Level: ${result.newLevel}/${MAX_LEVEL}\n` +
    `💰 Remaining coins: ${updatedUser.coins}`,
    { parse_mode: 'Markdown' }
  );
}

function releaseCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 1) {
    return ctx.reply('Usage: /release <pet_id>\nExample: /release 1');
  }

  const petId = parseInt(args[0]);
  if (isNaN(petId)) {
    return ctx.reply('❌ Invalid pet ID.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  if (pet.is_active) {
    return ctx.reply('❌ Cannot release active pet! Set another pet as active first.');
  }

  const sellPrice = getSellPrice(pet.rarity);

  ctx.reply(
    `⚠️ *Release ${pet.name}?*\n\n` +
    `Rarity: ${pet.rarity}\n` +
    `Level: ${pet.level}\n\n` +
    `Choose action:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(`💰 Sell (+${sellPrice} coins)`, `release_sell_${pet.id}`)],
        [Markup.button.callback(`🔄 Fuse (transfer EXP)`, `release_fuse_${pet.id}`)],
        [Markup.button.callback('❌ Cancel', 'release_cancel')],
      ]),
    }
  );
}

function handleReleaseSell(ctx, petId) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  const sellPrice = getSellPrice(pet.rarity);
  db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(sellPrice, user.id);
  db.prepare('DELETE FROM pets WHERE id = ?').run(petId);

  const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

  ctx.reply(
    `💰 *Sold ${pet.name}!*\n\n` +
    `+${sellPrice} coins\n` +
    `💰 Total coins: ${updatedUser.coins}`,
    { parse_mode: 'Markdown' }
  );
}

function handleReleaseFuse(ctx, petId) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  const activePet = db.prepare('SELECT * FROM pets WHERE owner_id = ? AND is_active = 1').get(user.id);
  if (!activePet) {
    return ctx.reply('❌ No active pet to fuse with!');
  }

  const expTransfer = Math.floor(pet.exp + (pet.level - 1) * 50);
  db.prepare('DELETE FROM pets WHERE id = ?').run(petId);

  const result = addExpToPet(activePet, expTransfer);

  ctx.reply(
    `🔄 *Fused ${pet.name} into ${activePet.name}!*\n\n` +
    `+${expTransfer} EXP transferred\n` +
    (result.leveledUp ? `🎉 ${activePet.name} leveled up! Now Lv.${result.newLevel}!\n` : '') +
    `${activePet.name} EXP: ${result.newExp}/${getExpToLevel(result.newLevel)}`,
    { parse_mode: 'Markdown' }
  );
}

function prestigeCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 1) {
    return ctx.reply('Usage: /prestige <pet_id>\nExample: /prestige 1');
  }

  const petId = parseInt(args[0]);
  if (isNaN(petId)) {
    return ctx.reply('❌ Invalid pet ID.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  if (pet.level < MAX_LEVEL) {
    return ctx.reply(`❌ Pet must be at max level (${MAX_LEVEL}) to prestige!`);
  }

  const newPrestigeBonus = pet.prestige_bonus + PRESTIGE_BONUS;

  db.prepare(
    'UPDATE pets SET level = 1, exp = 0, prestige = prestige + 1, prestige_bonus = ?, hp = ?, attack = ?, defense = ? WHERE id = ?'
  ).run(
    newPrestigeBonus,
    Math.floor(pet.hp * (1 + PRESTIGE_BONUS)),
    Math.floor(pet.attack * (1 + PRESTIGE_BONUS)),
    Math.floor(pet.defense * (1 + PRESTIGE_BONUS)),
    petId
  );

  const updatedPet = db.prepare('SELECT * FROM pets WHERE id = ?').get(petId);

  ctx.reply(
    `✨ *${pet.name} has Prestiged!*\n\n` +
    `Prestige: ${pet.prestige} → ${updatedPet.prestige}\n` +
    `Level: ${MAX_LEVEL} → 1\n` +
    `Stats: +20% bonus applied!\n\n` +
    `New Stats:\n` +
    `HP: ${updatedPet.hp}\n` +
    `ATK: ${updatedPet.attack}\n` +
    `DEF: ${updatedPet.defense}`,
    { parse_mode: 'Markdown' }
  );
}

function handlePetRefresh(ctx, petId) {
  ctx.answerCbQuery('Refreshing...');
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);
  if (!pet) return;

  const growth = GROWTH_RATES[pet.growth_rate] || GROWTH_RATES.D;
  const expToNext = getExpToLevel(pet.level);
  const powerScore = Math.floor(pet.attack + pet.defense + pet.hp / 2);

  ctx.editMessageText(
    `${RARITY_EMOJI[pet.rarity]} *${pet.name}*${pet.is_active ? ' ⭐ ACTIVE' : ''}\n\n` +
    `📊 *Basic Stats*\n` +
    `Species: ${pet.species}\n` +
    `Rarity: ${pet.rarity.charAt(0).toUpperCase() + pet.rarity.slice(1)}\n` +
    `Level: ${pet.level}/${MAX_LEVEL}\n` +
    `EXP: ${pet.exp}/${expToNext}\n` +
    `Prestige: ${pet.prestige}\n\n` +
    `⚔️ *Combat Stats*\n` +
    `HP: ${pet.hp}\n` +
    `ATK: ${pet.attack}\n` +
    `DEF: ${pet.defense}\n\n` +
    `📈 *Power Score: ${powerScore}*\n\n` +
    `🌱 *Growth Rate: ${GROWTH_EMOJI[pet.growth_rate]} ${pet.growth_rate}*\n` +
    `Per level: +${growth.hp} HP, +${growth.attack} ATK, +${growth.defense} DEF`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('⭐ Set Active', `pet_setactive_${pet.id}`)],
        [Markup.button.callback('🔄 Refresh', `pet_refresh_${pet.id}`)],
      ]),
    }
  );
}

function addExpToPet(pet, expAmount) {
  let newExp = pet.exp + expAmount;
  let newLevel = pet.level;
  let leveledUp = false;
  let totalExpGained = expAmount;

  while (newExp >= getExpToLevel(newLevel) && newLevel < MAX_LEVEL) {
    newExp -= getExpToLevel(newLevel);
    newLevel++;
    leveledUp = true;
  }

  if (newLevel >= MAX_LEVEL) {
    newExp = 0;
  }

  const growth = GROWTH_RATES[pet.growth_rate] || GROWTH_RATES.D;
  const levelsGained = newLevel - pet.level;

  const hpGain = Math.floor(levelsGained * growth.hp * pet.prestige_bonus);
  const atkGain = Math.floor(levelsGained * growth.attack * pet.prestige_bonus);
  const defGain = Math.floor(levelsGained * growth.defense * pet.prestige_bonus);

  db.prepare('UPDATE pets SET exp = ?, level = ?, hp = hp + ?, attack = attack + ?, defense = defense + ? WHERE id = ?')
    .run(newExp, newLevel, hpGain, atkGain, defGain, pet.id);

  return {
    expGained: totalExpGained,
    newExp,
    newLevel,
    leveledUp,
  };
}

module.exports = {
  petDetailCommand,
  feedCommand,
  handleFeed,
  trainCommand,
  releaseCommand,
  handleReleaseSell,
  handleReleaseFuse,
  prestigeCommand,
  handlePetRefresh,
  addExpToPet,
};
