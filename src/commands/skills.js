const { Markup } = require('telegraf');
const db = require('../database');
const { getOrCreateUser } = require('../utils/helpers');
const {
  SKILL_TEMPLATES,
  ELEMENT_EMOJI,
  SKILL_TYPE_EMOJI,
} = require('../pet/skills');

function skillShopCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  let text = `📜 *Skill Shop*\n\nBuy skill scrolls for your pets!\n\n`;

  const grouped = {};
  for (const skill of SKILL_TEMPLATES) {
    if (!grouped[skill.type]) grouped[skill.type] = [];
    grouped[skill.type].push(skill);
  }

  for (const [type, skills] of Object.entries(grouped)) {
    text += `${SKILL_TYPE_EMOJI[type]} *${type.charAt(0).toUpperCase() + type.slice(1)}*\n`;
    for (const skill of skills) {
      text += `   ${ELEMENT_EMOJI[skill.element]} ${skill.name} - ${skill.price}c\n`;
    }
    text += '\n';
  }

  text += `💰 Your coins: *${user.coins.toLocaleString()}*`;

  const buttons = SKILL_TEMPLATES.map((skill) => {
    return [Markup.button.callback(`${ELEMENT_EMOJI[skill.element]} ${skill.name} (${skill.price}c)`, `skillshop_buy_${skill.id}`)];
  });

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(buttons, { columns: 2 }),
  });
}

function handleSkillShopBuy(ctx, skillId) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const skill = SKILL_TEMPLATES.find(s => s.id === parseInt(skillId));

  if (!skill) {
    return ctx.reply('❌ Skill not found!');
  }

  if (user.coins < skill.price) {
    return ctx.reply(
      `❌ Not enough coins!\n\n` +
      `Skill: ${skill.name}\n` +
      `Price: ${skill.price} coins\n` +
      `Your coins: ${user.coins}`,
      { parse_mode: 'Markdown' }
    );
  }

  db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(skill.price, user.id);

  const existing = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ?').get(user.id, `Scroll: ${skill.name}`);
  if (existing) {
    db.prepare('UPDATE pet_items SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
  } else {
    db.prepare('INSERT INTO pet_items (owner_id, item_name, quantity) VALUES (?, ?, 1)').run(user.id, `Scroll: ${skill.name}`);
  }

  const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

  ctx.reply(
    `✅ *Bought Skill Scroll: ${skill.name}!*\n\n` +
    `${ELEMENT_EMOJI[skill.element]} ${skill.name} (${skill.type})\n` +
    `${skill.description}\n\n` +
    `💰 Remaining coins: *${updatedUser.coins.toLocaleString()}*\n\n` +
    `Use /skilllearn <pet_id> <skill_id> to teach your pet!`,
    { parse_mode: 'Markdown' }
  );
}

function skillLearnCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply('Usage: /skilllearn <pet_id> <skill_id>\nExample: /skilllearn 1 1');
  }

  const petId = parseInt(args[0]);
  const skillId = parseInt(args[1]);

  if (isNaN(petId) || isNaN(skillId)) {
    return ctx.reply('❌ Invalid pet_id or skill_id.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  const skill = SKILL_TEMPLATES.find(s => s.id === skillId);
  if (!skill) {
    return ctx.reply('❌ Skill not found!');
  }

  const maxSlots = { common: 1, rare: 2, epic: 3, legendary: 4 };
  const petSlots = maxSlots[pet.rarity] || 1;
  const currentSkills = db.prepare('SELECT * FROM pet_skills WHERE pet_id = ?').all(petId);

  if (currentSkills.length >= petSlots) {
    return ctx.reply(
      `❌ ${pet.name} already has ${petSlots} skill(s)!\n\n` +
      `Use /skillset to replace a skill, or release a pet to make room.`,
      { parse_mode: 'Markdown' }
    );
  }

  const scrollName = `Scroll: ${skill.name}`;
  const scroll = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ? AND quantity > 0').get(user.id, scrollName);

  if (!scroll) {
    return ctx.reply(
      `❌ You don't have a ${skill.name} scroll!\n\n` +
      `Buy one from /skillshop.`,
      { parse_mode: 'Markdown' }
    );
  }

  if (scroll.quantity > 1) {
    db.prepare('UPDATE pet_items SET quantity = quantity - 1 WHERE id = ?').run(scroll.id);
  } else {
    db.prepare('DELETE FROM pet_items WHERE id = ?').run(scroll.id);
  }

  const nextSlot = currentSkills.length + 1;
  db.prepare('INSERT INTO pet_skills (pet_id, skill_id, slot) VALUES (?, ?, ?)').run(petId, skillId, nextSlot);

  ctx.reply(
    `✅ *${pet.name} learned ${skill.name}!*\n\n` +
    `${ELEMENT_EMOJI[skill.element]} ${skill.name} (${skill.type})\n` +
    `Slot: ${nextSlot}/${petSlots}\n\n` +
    `${skill.description}`,
    { parse_mode: 'Markdown' }
  );
}

function skillsCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 1) {
    return ctx.reply('Usage: /skills <pet_id>\nExample: /skills 1');
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

  const maxSlots = { common: 1, rare: 2, epic: 3, legendary: 4 };
  const petSlots = maxSlots[pet.rarity] || 1;
  const petSkills = db.prepare('SELECT ps.*, s.name, s.type, s.element, s.power, s.effect, s.description FROM pet_skills ps JOIN skills s ON ps.skill_id = s.id WHERE ps.pet_id = ? ORDER BY ps.slot').all(petId);

  let text = `📜 *${pet.name}'s Skills*\n\n`;
  text += `Slots: ${petSkills.length}/${petSlots}\n\n`;

  if (petSkills.length === 0) {
    text += `No skills learned yet.\n`;
    text += `Use /skilllearn <pet_id> <skill_id> to teach a skill.`;
  } else {
    for (const skill of petSkills) {
      text += `Slot ${skill.slot}: ${ELEMENT_EMOJI[skill.element]} *${skill.name}*\n`;
      text += `   Type: ${skill.type} | Power: ${skill.power}\n`;
      text += `   ${skill.description}\n\n`;
    }
  }

  ctx.reply(text, { parse_mode: 'Markdown' });
}

function skillSetCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 3) {
    return ctx.reply('Usage: /skillset <pet_id> <slot> <skill_id>\nExample: /skillset 1 1 5');
  }

  const petId = parseInt(args[0]);
  const slot = parseInt(args[1]);
  const skillId = parseInt(args[2]);

  if (isNaN(petId) || isNaN(slot) || isNaN(skillId)) {
    return ctx.reply('❌ Invalid parameters.');
  }

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND owner_id = ?').get(petId, user.id);

  if (!pet) {
    return ctx.reply('❌ Pet not found!');
  }

  const maxSlots = { common: 1, rare: 2, epic: 3, legendary: 4 };
  const petSlots = maxSlots[pet.rarity] || 1;

  if (slot < 1 || slot > petSlots) {
    return ctx.reply(`❌ Invalid slot! ${pet.name} has ${petSlots} slot(s).`);
  }

  const skill = SKILL_TEMPLATES.find(s => s.id === skillId);
  if (!skill) {
    return ctx.reply('❌ Skill not found!');
  }

  const existingSkill = db.prepare('SELECT * FROM pet_skills WHERE pet_id = ? AND slot = ?').get(petId, slot);

  if (existingSkill) {
    db.prepare('UPDATE pet_skills SET skill_id = ? WHERE id = ?').run(skillId, existingSkill.id);
  } else {
    db.prepare('INSERT INTO pet_skills (pet_id, skill_id, slot) VALUES (?, ?, ?)').run(petId, skillId, slot);
  }

  ctx.reply(
    `✅ *${pet.name}'s Slot ${slot} set to ${skill.name}!*\n\n` +
    `${ELEMENT_EMOJI[skill.element]} ${skill.name} (${skill.type})\n` +
    `${skill.description}`,
    { parse_mode: 'Markdown' }
  );
}

function inventoryCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const items = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND quantity > 0').all(user.id);

  if (items.length === 0) {
    return ctx.reply(
      `📦 *Your Inventory*\n\n` +
      `No items yet!\n\n` +
      `🛒 Use /shop items or /skillshop to buy items.`,
      { parse_mode: 'Markdown' }
    );
  }

  let text = `📦 *Your Inventory*\n\n`;

  for (const item of items) {
    const template = db.prepare('SELECT * FROM item_templates WHERE name = ?').get(item.item_name);
    const skillScroll = item.item_name.startsWith('Scroll: ');
    if (template) {
      text += `🍽️ *${item.item_name}*: ${item.quantity} (+${template.exp_value} EXP)\n`;
    } else if (skillScroll) {
      text += `📜 *${item.item_name}*: ${item.quantity}\n`;
    } else {
      text += `📦 *${item.item_name}*: ${item.quantity}\n`;
    }
  }

  ctx.reply(text, { parse_mode: 'Markdown' });
}

module.exports = {
  skillShopCommand,
  handleSkillShopBuy,
  skillLearnCommand,
  skillsCommand,
  skillSetCommand,
  inventoryCommand,
};
