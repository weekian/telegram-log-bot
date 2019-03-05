// Entrypoint to starting bot application
import Telegraf from "telegraf";
import Server from "./server";
import Bot from "./bot";
import Database from "./db";
import startCommand from "./commands/start";
import checkinCommand from "./commands/checkin";
import checkoutCommand from "./commands/checkout";
import manualCommand from "./commands/manual";
import allCommand from "./commands/all";
import skipCommand from "./commands/skip";
import leaderboardCommand from "./commands/leaderboard";
import helpCommand from "./commands/help";
import addedToGroupEventHandler from "./commands/groupHandler";
import registerCommand from "./commands/register";

(async () => {
    const { PORT, NODE_ENV, TELEGRAM_TOKEN, DATABASE_URL } = process.env;

    const database = await Database(DATABASE_URL, NODE_ENV);
    const server = new Server(PORT, NODE_ENV);
    const bot = new Bot(
        Telegraf,
        TELEGRAM_TOKEN,
        NODE_ENV,
        database,
        addedToGroupEventHandler,
        [helpCommand, startCommand, registerCommand],
        [
            checkinCommand,
            checkoutCommand,
            manualCommand,
            allCommand,
            skipCommand,
        ],
        [leaderboardCommand]
    );

    await bot.start();
    server.start();
})();
