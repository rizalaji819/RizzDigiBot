const { Markup } = require('telegraf');
const db = require('../database');
const { rollRarity, getRandomPetByRarity, RARITY_EMOJI, GROWTH_EMOJI } = require('../pet/templates');
const { getExpToLevel } = require('../pet/templates');
const { getOrCreateUser } = require('../utils/helpers');

const FREE_HATCH_COOLDOWN = 3 * 60 * 60 * 1000;

function hatchCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  const eggs = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND quantity > 0').all(user.id);

  if (eggs.length === 0) {
    const lastHatch = user.last_free_hatch ? new Date(user.last_free_hatch).getTime() : 0;
    const now = Date.now();
    const canFreeHatch = now - lastHatch >= FREE_HATCH_COOLDOWN;

    if (canFreeHatch) {
      return ctx.reply(
        `🥚 *Free Hatch Available!*\n\nYou have no eggs, but you can hatch for free!\nCooldown: Ready now\n\nClick below to hatch!`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🥚 Free Hatch!', 'hatch_free')],
          ]),
        }
      );
    }

    const remaining = FREE_HATCH_COOLDOWN - (now - lastHatch);
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return ctx.reply(
      `🥚 *No Eggs*\n\nYou have no eggs in your inventory.\n\n` +
      `⏰ Free hatch in: ${hours}h ${mins}m\n` +
      `🛒 Buy eggs from /shop`,
      { parse_mode: 'Markdown' }
    );
  }

  const buttons = eggs.map((egg) => {
    const count = egg.quantity;
    return [Markup.button.callback(`${RARITY_EMOJI[egg.rarity]} ${egg.rarity.charAt(0).toUpperCase() + egg.rarity.slice(1)} Egg (x${count})`, `hatch_egg_${egg.rarity}`)];
  });

  const lastHatch = user.last_free_hatch ? new Date(user.last_free_hatch).getTime() : 0;
  const now = Date.now();
  const canFreeHatch = now - lastHatch >= FREE_HATCH_COOLDOWN;

  if (canFreeHatch) {
    buttons.push([Markup.button.callback('🥚 Free Hatch!', 'hatch_free')]);
  }

  ctx.reply(
    `🥚 *Your Eggs*\n\nSelect an egg to hatch:`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(buttons),
    }
  );
}

function handleHatchEgg(ctx, rarity) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const eggs = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND rarity = ? AND quantity > 0').get(user.id, rarity);

  if (!eggs || eggs.quantity <= 0) {
    return ctx.reply('❌ You don\'t have this egg!');
  }

  if (eggs.quantity > 1) {
    db.prepare('UPDATE egg_inventory SET quantity = quantity - 1 WHERE id = ?').run(eggs.id);
  } else {
    db.prepare('DELETE FROM egg_inventory WHERE id = ?').run(eggs.id);
  }

  performHatch(ctx, user, rarity);
}

function handleFreeHatch(ctx) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const lastHatch = user.last_free_hatch ? new Date(user.last_free_hatch).getTime() : 0;
  const now = Date.now();

  if (now - lastHatch < FREE_HATCH_COOLDOWN) {
    const remaining = FREE_HATCH_COOLDOWN - (now - lastHatch);
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return ctx.reply(`⏰ Free hatch not ready yet! Wait ${hours}h ${mins}m.`);
  }

  const rarity = rollRarity();
  db.prepare('UPDATE users SET last_free_hatch = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
  performHatch(ctx, user, rarity);
}

function performHatch(ctx, user, rarity) {
  const template = getRandomPetByRarity(rarity);

  const stmt = db.prepare(
    'INSERT INTO pets (owner_id, name, species, rarity, growth_rate, hp, attack, defense) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(user.id, template.name, template.species, rarity, template.growth, template.hp, template.attack, template.defense);

  const newPet = db.prepare('SELECT * FROM pets WHERE id = ?').get(result.lastInsertRowid);

  const autoSelect = db.prepare('SELECT COUNT(*) as count FROM pets WHERE owner_id = ?').get(user.id);
  if (autoSelect.count === 1) {
    db.prepare('UPDATE pets SET is_active = 1 WHERE id = ?').run(newPet.id);
  }

  ctx.reply(
    `${RARITY_EMOJI[rarity]} *You hatched a ${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${template.name}!*\n\n` +
    `Species: ${template.species}\n` +
    `Type: ${template.type}\n` +
    `HP: ${template.hp} | ATK: ${template.attack} | DEF: ${template.defense}\n` +
    `Growth: ${GROWTH_EMOJI[template.growth]} ${template.growth}\n\n` +
    `_${template.description}_\n\n` +
    `To rename your pet, use: /rename ${newPet.id} <new_name>`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Set as Active', `pet_setactive_${newPet.id}`)],
      ]),
    }
  );
}

function eggsCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const eggs = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND quantity > 0').all(user.id);

  if (eggs.length === 0) {
    return ctx.reply(
      `🥚 *Your Eggs*\n\nNo eggs in inventory.\n\n🛒 Buy eggs from /shop`,
      { parse_mode: 'Markdown' }
    );
  }

  let text = `🥚 *Your Eggs*\n\n`;
  for (const egg of eggs) {
    text += `${RARITY_EMOJI[egg.rarity]} ${egg.rarity.charAt(0).toUpperCase() + egg.rarity.slice(1)} Egg: ${egg.quantity}\n`;
  }

  ctx.reply(text, { parse_mode: 'Markdown' });
}

function renameCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply('Usage: /rename <pet_id> <new_name>');
  }

  const petId = parseInt(args[0]);
  const newName = args.slice(1).join(' ');

  if (isNaN(petId)) {
    return ctx.reply('❌ Invalid pet ID.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  db.prepare('UPDATE pets SET name = ? WHERE id = ?').run(newName, petId);
  ctx.reply(`✅ Pet renamed to *${newName}*!`, { parse_mode: 'Markdown' });
}

function petsCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pets = db.prepare('SELECT * FROM pets WHERE owner_id = ? ORDER BY is_active DESC, level DESC').all(user.id);

  if (pets.length === 0) {
    return ctx.reply(
      `🐾 *Your Pets*\n\nNo pets yet!\n\n🥚 Use /hatch to get your first pet.`,
      { parse_mode: 'Markdown' }
    );
  }

  let text = `🐾 *Your Pets (${pets.length}/${user.max_pet_slots})*\n\n`;
  for (const pet of pets) {
    const active = pet.is_active ? ' ⭐' : '';
    const expToNext = getExpToLevel(pet.level);
    text += `${RARITY_EMOJI[pet.rarity]} *${pet.name}* (${pet.rarity}) - Lv.${pet.level}${active}\n`;
    text += `   HP: ${pet.hp} | ATK: ${pet.attack} | DEF: ${pet.defense}\n`;
    text += `   Growth: ${GROWTH_EMOJI[pet.growth_rate]} ${pet.growth_rate} | EXP: ${pet.exp}/${expToNext}\n\n`;
  }

  ctx.reply(text, { parse_mode: 'Markdown' });
}

function handleSetActive(ctx, petId) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  db.prepare('UPDATE pets SET is_active = 0 WHERE owner_id = ?').run(user.id);
  db.prepare('UPDATE pets SET is_active = 1 WHERE id = ?').run(petId);

  ctx.reply(`✅ *${pet.name}* is now your active pet!`, { parse_mode: 'Markdown' });
}

module.exports = {
  hatchCommand,
  handleHatchEgg,
  handleFreeHatch,
  eggsCommand,
  renameCommand,
  petsCommand,
  handleSetActive,
};
