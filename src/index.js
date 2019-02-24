// Entrypoint to starting bot application
import Server from "./server";
import Bot from "./bot";
import Database from "./db/db";

const { PORT, NODE_ENV, TELEGRAM_TOKEN, DATABASE_URL } = process.env;

const server = new Server(PORT, NODE_ENV);
const bot = new Bot(TELEGRAM_TOKEN, NODE_ENV, Database(DATABASE_URL));

server.start();
bot.start();
