const { Markup } = require('telegraf');
const { getOrCreateUser, getUserPets, getActivePet } = require('../utils/helpers');
const { RARITY_EMOJI } = require('../pet/templates');
const db = require('../database');

const HELP_CATEGORIES = [
  {
    id: 'pet',
    name: '🐾 Pet System',
    commands: [
      { cmd: '/hatch', desc: 'Hatch a new pet (free every 3h or use eggs)' },
      { cmd: '/eggs', desc: 'View your egg inventory' },
      { cmd: '/pets', desc: 'View all your pets' },
      { cmd: '/pet <id>', desc: 'View detailed pet stats' },
      { cmd: '/rename <id> <name>', desc: 'Rename your pet' },
      { cmd: '/feed <id>', desc: 'Feed pet with food items' },
      { cmd: '/train <id>', desc: 'Train pet with coins' },
      { cmd: '/release <id>', desc: 'Release pet (sell or fuse)' },
      { cmd: '/prestige <id>', desc: 'Prestige pet (Lv.50 → reset +20% stats)' },
    ],
  },
  {
    id: 'battle',
    name: '⚔️ Battle System',
    commands: [
      { cmd: '/battle', desc: 'Start battle (select zone)' },
      { cmd: '/zones', desc: 'View available zones' },
    ],
  },
  {
    id: 'skill',
    name: '📜 Skill System',
    commands: [
      { cmd: '/skills <pet_id>', desc: 'View pet skills' },
      { cmd: '/skilllearn <pet_id> <skill_id>', desc: 'Learn skill from scroll' },
      { cmd: '/skillset <pet_id> <slot> <skill_id>', desc: 'Set skill to slot' },
    ],
  },
  {
    id: 'shop',
    name: '🛒 Shop System',
    commands: [
      { cmd: '/shop', desc: 'Buy eggs' },
      { cmd: '/items', desc: 'Buy food items' },
      { cmd: '/skillshop', desc: 'Buy skill scrolls' },
      { cmd: '/inventory', desc: 'View your items' },
    ],
  },
  {
    id: 'economy',
    name: '💰 Economy System',
    commands: [
      { cmd: '/daily', desc: 'Claim daily reward (Lv.5+)' },
      { cmd: '/profile', desc: 'View your profile' },
      { cmd: '/leaderboard', desc: 'Top 10 players' },
      { cmd: '/trade @username', desc: 'Trade with player (Lv.10+)' },
    ],
  },
];

function startCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pets = getUserPets(user.id);
  const eggs = db.prepare('SELECT * FROM egg_inventory WHERE owner_id = ? AND quantity > 0').all(user.id);

  let petInfo = '';
  if (pets.length === 0) {
    petInfo = '\n\nYou don\'t have any pets yet! Use /hatch to get your first pet.';
  } else {
    const activePet = getActivePet(user.id);
    petInfo = `\n\n🐾 Your pets: ${pets.length}`;
    if (activePet) {
      petInfo += `\n⭐ Active: ${activePet.name} (${RARITY_EMOJI[activePet.rarity]} ${activePet.rarity}) - Lv.${activePet.level}`;
    }
  }

  let eggInfo = '';
  if (eggs.length > 0) {
    eggInfo = '\n\n🥚 Eggs: ';
    eggInfo += eggs.map(e => `${RARITY_EMOJI[e.rarity]} ${e.rarity.charAt(0).toUpperCase() + e.rarity.slice(1)} (x${e.quantity})`).join(', ');
  }

  ctx.reply(
    `🎮 *Welcome to RizzDigiBot, ${ctx.from.first_name}!*\n\n` +
    `Level: ${user.level} | EXP: ${user.exp}\n` +
    `💰 Coins: ${user.coins.toLocaleString()}` +
    petInfo +
    eggInfo +
    `\n\n📋 Use /help to see all commands!`,
    { parse_mode: 'Markdown' }
  );
}

function helpCommand(ctx) {
  let text = `📚 *RizzDigiBot - Help Guide*\n\n`;
  text += `Select a category to see detailed commands:\n\n`;

  const buttons = HELP_CATEGORIES.map((cat) => {
    return [Markup.button.callback(cat.name, `help_${cat.id}`)];
  });

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(buttons),
  });
}

function handleHelpCategory(ctx, categoryId) {
  ctx.answerCbQuery();

  const category = HELP_CATEGORIES.find(c => c.id === categoryId);

  if (!category) {
    return ctx.reply('❌ Category not found!');
  }

  let text = `📚 *${category.name}*\n\n`;

  for (const cmd of category.commands) {
    text += `*${cmd.cmd}*\n`;
    text += `   ${cmd.desc}\n\n`;
  }

  text += `📌 *Tips:*\n`;
  text += `• Use /back to return to main menu\n`;
  text += `• Use /help anytime for help`;

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🔙 Back to Menu', 'help_back')],
    ]),
  });
}

function handleHelpBack(ctx) {
  ctx.answerCbQuery();

  let text = `📚 *RizzDigiBot - Help Guide*\n\n`;
  text += `Select a category to see detailed commands:\n\n`;

  const buttons = HELP_CATEGORIES.map((cat) => {
    return [Markup.button.callback(cat.name, `help_${cat.id}`)];
  });

  ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(buttons),
  });
}

module.exports = {
  startCommand,
  helpCommand,
  handleHelpCategory,
  handleHelpBack,
};
