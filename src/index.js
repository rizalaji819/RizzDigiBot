const { Telegraf } = require('telegraf');
const config = require('./config');
const { startCommand } = require('./commands/start');

if (!config.BOT_TOKEN) {
  console.error('BOT_TOKEN is not set in .env');
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

bot.start(startCommand);
bot.command('help', startCommand);

bot.launch();
console.log('RizzDigiBot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
