const { getOrCreateUser, getUserPets, getActivePet } = require('../utils/helpers');
const { RARITY_EMOJI } = require('../pet/templates');
const db = require('../database');

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
    `\n\n📋 *Commands:*\n` +
    `/hatch - Hatch a new pet\n` +
    `/eggs - View your eggs\n` +
    `/pets - View your pets\n` +
    `/shop - Buy eggs\n` +
    `/battle - Fight wild monsters\n` +
    `/profile - View your profile`,
    { parse_mode: 'Markdown' }
  );
}

module.exports = { startCommand };
