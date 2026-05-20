const { Markup } = require('telegraf');
const db = require('../database');
const { EGG_PRICES, RARITY_EMOJI } = require('../pet/templates');
const { getOrCreateUser } = require('../utils/helpers');

function shopCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  const text =
    `🏪 *RizzDigi Shop*\n\n` +
    `Buy eggs and hatch your dream pet!\n\n` +
    `${RARITY_EMOJI.common} Common Egg    - ${EGG_PRICES.common.toLocaleString()} coins\n` +
    `${RARITY_EMOJI.rare} Rare Egg      - ${EGG_PRICES.rare.toLocaleString()} coins\n` +
    `${RARITY_EMOJI.epic} Epic Egg      - ${EGG_PRICES.epic.toLocaleString()} coins\n` +
    `${RARITY_EMOJI.legendary} Legendary Egg - ${EGG_PRICES.legendary.toLocaleString()} coins\n\n` +
    `💰 Your coins: *${user.coins.toLocaleString()}*`;

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback(`${RARITY_EMOJI.common} Common (100c)`, 'shop_buy_common'),
        Markup.button.callback(`${RARITY_EMOJI.rare} Rare (500c)`, 'shop_buy_rare'),
      ],
      [
        Markup.button.callback(`${RARITY_EMOJI.epic} Epic (2,500c)`, 'shop_buy_epic'),
        Markup.button.callback(`${RARITY_EMOJI.legendary} Legendary (15k)`, 'shop_buy_legendary'),
      ],
    ]),
  });
}

function handleShopBuy(ctx, rarity) {
  ctx.answerCbQuery();

  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const price = EGG_PRICES[rarity];

  if (user.coins < price) {
    return ctx.reply(`❌ Not enough coins! You need ${price.toLocaleString()} coins but have ${user.coins.toLocaleString()}.`);
  }

  db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').run(price, user.id);

  const existing = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND rarity = ?').get(user.id, rarity);
  if (existing) {
    db.prepare('UPDATE egg_inventory SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
  } else {
    db.prepare('INSERT INTO egg_inventory (owner_id, rarity, quantity) VALUES (?, ?, 1)').run(user.id, rarity);
  }

  const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

  ctx.reply(
    `${RARITY_EMOJI[rarity]} *Bought 1 ${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Egg!*\n\n` +
    `💰 Remaining coins: *${updatedUser.coins.toLocaleString()}*\n\n` +
    `Use /eggs to view your eggs or /hatch to hatch one!`,
    { parse_mode: 'Markdown' }
  );
}

module.exports = { shopCommand, handleShopBuy };
