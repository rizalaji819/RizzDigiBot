const { Telegraf } = require('telegraf');
const config = require('./config');
const { startCommand } = require('./commands/start');
const { shopCommand, handleShopBuy } = require('./commands/shop');
const {
  hatchCommand,
  handleHatchEgg,
  handleFreeHatch,
  eggsCommand,
  renameCommand,
  petsCommand,
  handleSetActive,
} = require('./commands/hatch');
const {
  petDetailCommand,
  feedCommand,
  handleFeed,
  trainCommand,
  releaseCommand,
  handleReleaseSell,
  handleReleaseFuse,
  prestigeCommand,
  handlePetRefresh,
} = require('./commands/pet');
const {
  itemShopCommand,
  handleItemBuy,
  handleSlotBuy,
} = require('./commands/items');
const {
  skillShopCommand,
  handleSkillShopBuy,
  skillLearnCommand,
  skillsCommand,
  skillSetCommand,
  inventoryCommand,
} = require('./commands/skills');
const {
  zonesCommand,
  battleCommand,
  handleZoneSelect,
  handleBattleSkill,
} = require('./battle/engine');

if (!config.BOT_TOKEN) {
  console.error('BOT_TOKEN is not set in .env');
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

bot.start(startCommand);
bot.command('help', startCommand);
bot.command('shop', shopCommand);
bot.command('hatch', hatchCommand);
bot.command('eggs', eggsCommand);
bot.command('pets', petsCommand);
bot.command('rename', renameCommand);
bot.command('pet', petDetailCommand);
bot.command('feed', feedCommand);
bot.command('train', trainCommand);
bot.command('release', releaseCommand);
bot.command('prestige', prestigeCommand);
bot.command('inventory', inventoryCommand);
bot.command('items', itemShopCommand);
bot.command('skillshop', skillShopCommand);
bot.command('skilllearn', skillLearnCommand);
bot.command('skills', skillsCommand);
bot.command('skillset', skillSetCommand);
bot.command('zones', zonesCommand);
bot.command('battle', battleCommand);

bot.action(/^shop_buy_(.+)$/, (ctx) => {
  handleShopBuy(ctx, ctx.match[1]);
});

bot.action(/^hatch_egg_(.+)$/, (ctx) => {
  handleHatchEgg(ctx, ctx.match[1]);
});

bot.action('hatch_free', (ctx) => {
  handleFreeHatch(ctx);
});

bot.action(/^pet_setactive_(\d+)$/, (ctx) => {
  handleSetActive(ctx, parseInt(ctx.match[1]));
});

bot.action(/^pet_refresh_(\d+)$/, (ctx) => {
  handlePetRefresh(ctx, parseInt(ctx.match[1]));
});

bot.action(/^feed_(\d+)_(.+)$/, (ctx) => {
  handleFeed(ctx, parseInt(ctx.match[1]), ctx.match[2]);
});

bot.action(/^release_sell_(\d+)$/, (ctx) => {
  handleReleaseSell(ctx, parseInt(ctx.match[1]));
});

bot.action(/^release_fuse_(\d+)$/, (ctx) => {
  handleReleaseFuse(ctx, parseInt(ctx.match[1]));
});

bot.action('release_cancel', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('❌ Release cancelled.');
});

bot.action(/^item_buy_(.+)$/, (ctx) => {
  handleItemBuy(ctx, ctx.match[1]);
});

bot.action('item_buy_slot', (ctx) => {
  handleSlotBuy(ctx);
});

bot.action(/^skillshop_buy_(\d+)$/, (ctx) => {
  handleSkillShopBuy(ctx, ctx.match[1]);
});

bot.action(/^battle_zone_(.+)$/, (ctx) => {
  handleZoneSelect(ctx, ctx.match[1]);
});

bot.action(/^battle_skill_(\d+)$/, (ctx) => {
  handleBattleSkill(ctx, parseInt(ctx.match[1]));
});

bot.launch();
console.log('RizzDigiBot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
