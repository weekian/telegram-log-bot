// @flow
import Telegraf from 'telegraf';
import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to ${process.env.PORT || 8080}`);
})

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply(`Hello World @ ${(new Date()).toString()}`));
bot.launch();