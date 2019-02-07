const Telegraf = require('telegraf');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.listen(process.env.PORT, () => {
    console.log("App listening to " + process.env.PORT);
})

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply(`Hello World @ ${new Date()}`));
bot.launch();