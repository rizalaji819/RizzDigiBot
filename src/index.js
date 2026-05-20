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

bot.launch();
console.log('RizzDigiBot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
