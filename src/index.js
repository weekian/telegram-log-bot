import Server from "./server";
import Bot from "./bot";

const { PORT, NODE_ENV, TELEGRAM_TOKEN } = process.env;

const server = new Server(PORT || "8080", NODE_ENV || "development");
const bot = new Bot(TELEGRAM_TOKEN, NODE_ENV || "development");

server.start();
bot.start();
