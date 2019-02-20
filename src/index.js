import Telegraf from "telegraf";
import express from "express";
import generateResponse from "./helper";

function sum(a: number, b: number): number {
    return a + b;
}

const app = express();

app.get("/", (req, res) => {
    res.send(`${generateResponse()} ${sum(1, 2)}`);
});

app.listen(process.env.PORT, () => {
    // console.log(`Listening to ${process.env.PORT || 8080}`);
});

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) =>
    ctx.reply(
        `[${process.env.NODE_ENV ||
            "development"}] Hello World @ ${new Date().toString()}`
    )
);
bot.launch();
