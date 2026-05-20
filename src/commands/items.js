const { Markup } = require('telegraf');
const db = require('../database');
const { getOrCreateUser } = require('../utils/helpers');

const ITEM_SHOP = [
  { name: 'Basic Food', price: 50, exp: 50, description: '+50 EXP' },
  { name: 'Premium Food', price: 200, exp: 200, description: '+200 EXP' },
  { name: 'Ultra Food', price: 1000, exp: 500, description: '+500 EXP' },
];

const PET_SLOT_PRICE = 1000;
const MAX_PET_SLOTS = 20;

function itemShopCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  let text =
    `🛒 *Item Shop*\n\n` +
    `Buy food for your pets!\n\n`;

  for (const item of ITEM_SHOP) {
    text += `🍽️ *${item.name}*\n`;
    text += `   ${item.description} | ${item.price} coins\n\n`;
  }

  text += `💰 Your coins: *${user.coins.toLocaleString()}*\n`;
  text += `🐾 Pet slots: ${user.max_pet_slots}/${MAX_PET_SLOTS}`;

  const buttons = ITEM_SHOP.map((item) => {
    return [Markup.button.callback(`${item.name} (${item.price}c)`, `item_buy_${item.name.replace(/\s/g, '_')}`)];
  });

  if (user.max_pet_slots < MAX_PET_SLOTS) {
    buttons.push([Markup.button.callback(`📦 Buy Slot (+1) - ${PET_SLOT_PRICE}c`, 'item_buy_slot')]);
  }

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(buttons),
  });
}

function handleItemBuy(ctx, itemName) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const item = ITEM_SHOP.find(i => i.name === itemName.replace(/_/g, ' '));

  if (!item) {
    return ctx.reply('❌ Item not found!');
  }

  if (user.coins < item.price) {
    return ctx.reply(
      `❌ Not enough coins!\n\n` +
      `Item: ${item.name}\n` +
      `Price: ${item.price} coins\n` +
      `Your coins: ${user.coins}`,
      { parse_mode: 'Markdown' }
    );
  }

  db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(item.price, user.id);

  const existing = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ?').get(user.id, item.name);
  if (existing) {
    db.prepare('UPDATE pet_items SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
  } else {
    db.prepare('INSERT INTO pet_items (owner_id, item_name, quantity) VALUES (?, ?, 1)').run(user.id, item.name);
  }

  const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

  ctx.reply(
    `✅ Bought 1 ${item.name}!\n\n` +
    `${item.description}\n` +
    `💰 Remaining coins: ${updatedUser.coins.toLocaleString()}\n\n` +
    `Use /feed <pet_id> to feed your pet!`
  );
}

function handleSlotBuy(ctx) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  if (user.max_pet_slots >= MAX_PET_SLOTS) {
    return ctx.reply('❌ You already have the maximum number of pet slots!');
  }

  if (user.coins < PET_SLOT_PRICE) {
    return ctx.reply(
      `❌ Not enough coins!\n\n` +
      `Slot price: ${PET_SLOT_PRICE} coins\n` +
      `Your coins: ${user.coins}`,
      { parse_mode: 'Markdown' }
    );
  }

  db.prepare('UPDATE users SET coins = coins - ?, max_pet_slots = max_pet_slots + 1 WHERE id = ?').run(PET_SLOT_PRICE, user.id);

  const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

  ctx.reply(
    `📦 Bought 1 Pet Slot!\n\n` +
    `Pet slots: ${updatedUser.max_pet_slots}/${MAX_PET_SLOTS}\n` +
    `💰 Remaining coins: ${updatedUser.coins.toLocaleString()}`
  );
}

function inventoryCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const items = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND quantity > 0').all(user.id);

  if (items.length === 0) {
    return ctx.reply(
      `📦 *Your Inventory*\n\n` +
      `No items yet!\n\n` +
      `🛒 Use /shop items to buy food.`,
      { parse_mode: 'Markdown' }
    );
  }

  let text = `📦 *Your Inventory*\n\n`;

  for (const item of items) {
    const template = db.prepare('SELECT * FROM item_templates WHERE name = ?').get(item.item_name);
    const expText = template ? `+${template.exp_value} EXP` : '';
    text += `🍽️ *${item.item_name}*: ${item.quantity} ${expText}\n`;
  }

  ctx.reply(text, { parse_mode: 'Markdown' });
}

module.exports = {
  itemShopCommand,
  handleItemBuy,
  handleSlotBuy,
  inventoryCommand,
};
