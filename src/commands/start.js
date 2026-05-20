const { getOrCreateUser, getUserPets, getActivePet } = require('../utils/helpers');

function startCommand(ctx) {
  const user = getOrCreateUser(ctx.from.id, ctx.from.username);
  const pets = getUserPets(user.id);

  let petInfo = '';
  if (pets.length === 0) {
    petInfo = '\n\nYou don\'t have any pets yet! Use /hatch to get your first pet.';
  } else {
    const activePet = getActivePet(user.id);
    petInfo = `\n\nYour pets: ${pets.length}`;
    if (activePet) {
      petInfo += `\nActive: ${activePet.name} (${activePet.species}) - Lv.${activePet.level}`;
    }
  }

  ctx.reply(
    `Welcome to RizzDigiBot, ${ctx.from.first_name}! 🎮\n\n` +
    `Level: ${user.level} | EXP: ${user.exp} | Coins: ${user.coins}` +
    petInfo +
    `\n\nCommands:\n` +
    `/hatch - Hatch a new pet\n` +
    `/pets - View your pets\n` +
    `/battle - Fight wild monsters\n` +
    `/profile - View your profile`
  );
}

module.exports = { startCommand };
