const { Markup } = require('telegraf');
const db = require('../database');
const { getOrCreateUser } = require('../utils/helpers');

const DAILY_REWARDS = {
  coins: (day) => Math.min(100 + (day - 1) * 50, 500),
  item: (day) => {
    if (day >= 7) return { name: 'Epic Egg', type: 'egg', rarity: 'epic' };
    if (day >= 5) return { name: 'Rare Egg', type: 'egg', rarity: 'rare' };
    if (day >= 3) return { name: 'Premium Food', type: 'food' };
    return { name: 'Basic Food', type: 'food' };
  },
};

const LEVEL_REWARDS = {
  coins: (level) => {
    if (level <= 10) return 100 * level;
    if (level <= 20) return 200 * level;
    if (level <= 30) return 300 * level;
    if (level <= 40) return 500 * level;
    return 1000 * level;
  },
  item: (level) => {
    if (level >= 41) return { name: 'Legendary Egg', type: 'egg', rarity: 'legendary' };
    if (level >= 31) return { name: 'Epic Egg', type: 'egg', rarity: 'epic' };
    if (level >= 21) return { name: 'Rare Egg', type: 'egg', rarity: 'rare' };
    if (level >= 11) return { name: 'Premium Food', type: 'food' };
    return { name: 'Basic Food', type: 'food' };
  },
};

function getExpToLevel(level) {
  return level * 100;
}

function addPlayerExp(userId, amount) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return null;

  let newExp = user.exp + amount;
  let newLevel = user.level;
  let leveledUp = false;
  const levelUps = [];

  while (newExp >= getExpToLevel(newLevel) && newLevel < 50) {
    newExp -= getExpToLevel(newLevel);
    newLevel++;
    leveledUp = true;

    const coinsReward = LEVEL_REWARDS.coins(newLevel);
    const itemReward = LEVEL_REWARDS.item(newLevel);

    db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(coinsReward, userId);

    if (itemReward.type === 'egg') {
      const existing = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND rarity = ?').get(userId, itemReward.rarity);
      if (existing) {
        db.prepare('UPDATE egg_inventory SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
      } else {
        db.prepare('INSERT INTO egg_inventory (owner_id, rarity, quantity) VALUES (?, ?, 1)').run(userId, itemReward.rarity);
      }
    } else {
      const existing = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ?').get(userId, itemReward.name);
      if (existing) {
        db.prepare('UPDATE pet_items SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
      } else {
        db.prepare('INSERT INTO pet_items (owner_id, item_name, quantity) VALUES (?, ?, 1)').run(userId, itemReward.name);
      }
    }

    levelUps.push({ level: newLevel, coins: coinsReward, item: itemReward.name });
  }

  if (newLevel >= 50) newExp = 0;

  db.prepare('UPDATE users SET exp = ?, level = ?, total_exp = total_exp + ? WHERE id = ?')
    .run(newExp, newLevel, amount, userId);

  return { newLevel, newExp, leveledUp, levelUps };
}

function dailyCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  if (user.level < 5) {
    return ctx.reply(
      `❌ *Daily Command Locked*\n\n` +
      `You need to be level 5 to use /daily.\n` +
      `Current level: ${user.level}\n` +
      `EXP to next level: ${user.exp}/${getExpToLevel(user.level)}`,
      { parse_mode: 'Markdown' }
    );
  }

  const now = new Date();
  const lastDaily = user.last_daily ? new Date(user.last_daily) : null;

  if (lastDaily) {
    const hoursSinceLastDaily = (now - lastDaily) / (1000 * 60 * 60);
    if (hoursSinceLastDaily < 20) {
      const hoursLeft = Math.ceil(20 - hoursSinceLastDaily);
      return ctx.reply(
        `⏰ *Daily not ready yet!*\n\n` +
        `Come back in ${hoursLeft} hour(s).`,
        { parse_mode: 'Markdown' }
      );
    }
  }

  let streak = user.daily_streak;
  if (lastDaily) {
    const hoursSinceLastDaily = (now - lastDaily) / (1000 * 60 * 60);
    if (hoursSinceLastDaily > 48) {
      streak = 0;
    }
  }

  streak++;
  const coinsReward = DAILY_REWARDS.coins(streak);
  const itemReward = DAILY_REWARDS.item(streak);

  db.prepare('UPDATE users SET coins = coins + ?, daily_streak = ?, last_daily = CURRENT_TIMESTAMP WHERE id = ?')
    .run(coinsReward, streak, user.id);

  if (itemReward.type === 'egg') {
    const existing = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND rarity = ?').get(user.id, itemReward.rarity);
    if (existing) {
      db.prepare('UPDATE egg_inventory SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
    } else {
      db.prepare('INSERT INTO egg_inventory (owner_id, rarity, quantity) VALUES (?, ?, 1)').run(user.id, itemReward.rarity);
    }
  } else {
    const existing = db.prepare('SELECT * FROM pet_items WHERE owner_id = ? AND item_name = ?').get(user.id, itemReward.name);
    if (existing) {
      db.prepare('UPDATE pet_items SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
    } else {
      db.prepare('INSERT INTO pet_items (owner_id, item_name, quantity) VALUES (?, ?, 1)').run(user.id, itemReward.name);
    }
  }

  const updatedUser = getOrCreateUser(ctx.from.id, ctx.from.username);

  let text = `📅 *Daily Reward Claimed!*\n\n`;
  text += `🔥 Streak: ${streak} day(s)\n\n`;
  text += `💰 *Rewards:*\n`;
  text += `+${coinsReward} Coins\n`;
  text += `+1 ${itemReward.name}\n\n`;
  text += `💰 Total coins: ${updatedUser.coins.toLocaleString()}\n`;
  text += `⏰ Next daily in: 20 hours`;

  ctx.reply(text, { parse_mode: 'Markdown' });
}

function profileCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pets = db.prepare('SELECT COUNT(*) as count FROM pets WHERE owner_id = ?').get(user.id);
  const eggs = db.prepare('SELECT SUM(quantity) as total FROM egg_inventory WHERE owner_id = ?').get(user.id);
  const items = db.prepare('SELECT SUM(quantity) as total FROM pet_items WHERE owner_id = ?').get(user.id);

  const expToNext = getExpToLevel(user.level);
  const expPercent = Math.floor((user.exp / expToNext) * 100);
  const expBar = '█'.repeat(Math.floor(expPercent / 10)) + '░'.repeat(10 - Math.floor(expPercent / 10));

  let text = `👤 *${user.username || 'Player'}'s Profile*\n\n`;
  text += `📊 *Stats*\n`;
  text += `Level: ${user.level}/50\n`;
  text += `EXP: ${expBar} ${user.exp}/${expToNext}\n`;
  text += `Total EXP: ${(user.total_exp || 0).toLocaleString()}\n\n`;
  text += `💰 *Inventory*\n`;
  text += `Coins: ${user.coins.toLocaleString()}\n`;
  text += `Pets: ${pets.count}/${user.max_pet_slots}\n`;
  text += `Eggs: ${eggs.total || 0}\n`;
  text += `Items: ${items.total || 0}\n\n`;
  text += `🔥 *Daily Streak: ${user.daily_streak}*\n`;

  ctx.reply(text, { parse_mode: 'Markdown' });
}

function leaderboardCommand(ctx) {
  const topPlayers = db.prepare('SELECT * FROM users ORDER BY level DESC, total_exp DESC LIMIT 10').all();

  let text = `🏆 *Leaderboard - Top 10 Players*\n\n`;

  const medals = ['🥇', '🥈', '🥉'];
  topPlayers.forEach((player, index) => {
    const medal = medals[index] || `${index + 1}.`;
    text += `${medal} *${player.username || 'Player'}*\n`;
    text += `   Level ${player.level} | ${(player.total_exp || 0).toLocaleString()} EXP\n`;
  });

  ctx.reply(text, { parse_mode: 'Markdown' });
}

function tradeCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  if (user.level < 10) {
    return ctx.reply(
      `❌ *Trading Locked*\n\n` +
      `You need to be level 10 to trade.\n` +
      `Current level: ${user.level}`,
      { parse_mode: 'Markdown' }
    );
  }

  if (args.length < 1) {
    return ctx.reply(
      `📦 *Trade Commands*\n\n` +
      `/trade @username - Start trade\n` +
      `/trade accept - Accept trade\n` +
      `/trade cancel - Cancel trade`,
      { parse_mode: 'Markdown' }
    );
  }

  if (args[0] === 'accept') {
    return handleTradeAccept(ctx);
  }

  if (args[0] === 'cancel') {
    return handleTradeCancel(ctx);
  }

  const targetUsername = args[0].replace('@', '');

  if (targetUsername === ctx.from.username) {
    return ctx.reply('❌ You cannot trade with yourself!');
  }

  const target = db.prepare('SELECT * FROM users WHERE username = ?').get(targetUsername);
  if (!target) {
    return ctx.reply('❌ User not found!');
  }

  if (target.level < 10) {
    return ctx.reply('❌ That user needs to be level 10 to trade!');
  }

  const existingTrade = db.prepare('SELECT * FROM trades WHERE (sender_id = ? OR receiver_id = ?) AND status = ?')
    .get(user.id, user.id, 'pending');
  if (existingTrade) {
    return ctx.reply('❌ You already have a pending trade!');
  }

  db.prepare('INSERT INTO trades (sender_id, receiver_id) VALUES (?, ?)').run(user.id, target.id);

  ctx.reply(
    `📦 *Trade Request Sent!*\n\n` +
    `To: @${targetUsername}\n` +
    `Waiting for them to accept...`,
    { parse_mode: 'Markdown' }
  );
}

function handleTradeAccept(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  const trade = db.prepare('SELECT * FROM trades WHERE receiver_id = ? AND status = ?')
    .get(user.id, 'pending');

  if (!trade) {
    return ctx.reply('❌ No pending trade request!');
  }

  db.prepare('UPDATE trades SET status = ? WHERE id = ?').run('accepted', trade.id);

  ctx.reply(
    `✅ *Trade Accepted!*\n\n` +
    `To add items/pets to trade, use:\n` +
    `/tradeadd pet <pet_id>\n` +
    `/tradeadd item <item_name>\n` +
    `/tradeadd coins <amount>\n` +
    `/tradefinalize - Confirm trade`,
    { parse_mode: 'Markdown' }
  );
}

function handleTradeCancel(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);

  const trade = db.prepare('SELECT * FROM trades WHERE (sender_id = ? OR receiver_id = ?) AND status IN (?, ?)')
    .get(user.id, user.id, 'pending', 'accepted');

  if (!trade) {
    return ctx.reply('❌ No active trade!');
  }

  db.prepare('UPDATE trades SET status = ? WHERE id = ?').run('cancelled', trade.id);

  ctx.reply('❌ Trade cancelled.');
}

module.exports = {
  dailyCommand,
  profileCommand,
  leaderboardCommand,
  tradeCommand,
  handleTradeAccept,
  handleTradeCancel,
  addPlayerExp,
  getExpToLevel,
};
