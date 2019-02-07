// @flow
import Telegraf from 'telegraf';
import express from 'express';
import * as utils from './helper/index.js'
const app = express();

app.get('/', (req, res) => {
    res.send(utils.generateResponse());
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to ${process.env.PORT || 8080}`);
})

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply(`[${process.env.NODE_ENV || 'development'}] Hello World @ ${(new Date()).toString()}`));
bot.launch();